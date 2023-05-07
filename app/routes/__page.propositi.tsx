import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Header, NavBar } from '~/components';
import { V2_MetaFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  const prisma = new PrismaClient();

  let catId:any = await prisma.njsoc_terms.findFirst({
    where: { name: 'Propositi' }
  })
  .catch(error => console.log(error));

  let matchData:any = await prisma.njsoc_term_taxonomy.findFirst({
    where: { term_id: catId.term_id },
    include: { 
      posts: { 
        include: { 
          post: {
            include: {
              custom_fields: true
            }
          }
        }
      } 
    }
  })
  .catch(error => console.log(error));

  const { posts } = matchData;

  const propositi = posts.map((post:any) => post.post);

  // DEAL WITH BIGINT BUG
  for( let propositus of propositi ) {
    Object.entries(propositus).forEach(([key, value]:any) => {
      if(typeof value==="bigint") propositus[key] = value.toString();
      if(key==="custom_fields") {
        const customFields = propositus[key];
        const cf = [];
        for(const customField of customFields) cf.push({[customField.meta_key]: customField.meta_value});
        propositus[key] = JSON.stringify(cf);
      }
    });
  }

  await prisma.$disconnect();
  if(!propositi) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  return propositi;
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [{ title: "Propositi | The Society of the Cincinnati in the State of New Jersey" }];
};

const getCustom = (fields:{[key: string]: string}[], key:string) => {
  const field = fields.find((field:any) => field[key]);
  return field?field[key]:"";
}

export default function Page() {
  let propositi: any = useLoaderData<any>();
  propositi = propositi.map((propositus:any) => {
    return {...propositus, custom_fields: JSON.parse(propositus.custom_fields)}
  })

  propositi.sort((a:any,b:any) => {
    const aSort = getCustom(a.custom_fields, "Sort Last Name");
    const bSort = getCustom(b.custom_fields, "Sort Last Name");
    return aSort.localeCompare(bSort);
  })

  return (
    <>
      <Header />
      <NavBar />
      <main className="content">
        {propositi.map((propositus: any, i: number) => {
          return (
            <div key={propositus.ID}>{getCustom(propositus.custom_fields,"Sort Last Name")}</div>
          )
        })}
      </main>
    </>
  )
}