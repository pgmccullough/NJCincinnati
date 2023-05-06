import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Header, NavBar } from '~/components';
import { V2_MetaFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const prisma = new PrismaClient();
  const cfArr:any = [];
  let userData:any = await prisma.njsoc_posts.findFirst({
    where: { ID: 209 },
    include: { custom_fields: true }
  })
  userData
    ?Object.entries(userData).forEach(([key, value]:any) => {
      if(typeof value==="bigint") userData[key] = value.toString();
      if(key==="custom_fields") {
        const customFields = userData[key];
        for(const customField of customFields) cfArr.push([customField.meta_key, customField.meta_value]);
        userData[key] = cfArr;
      }
    })
    :""
  // delete userData.custom_fields;
  await prisma.$disconnect();
  if(!userData) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  return userData;
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return (
    data
      ?[{ title: `${data.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Page() {
  let userData: any = useLoaderData<any>();
  return (
    <>
      <Header />
      <NavBar />
      <main className="content">
        <h1>{userData?.post_title}</h1>
        <article dangerouslySetInnerHTML={{__html: userData?.post_content}} />
        {userData.custom_fields.map(cf => <div key={`${cf[0]}${cf[1]}`}>{cf[0]}: {cf[1]}</div>)}
      </main>
    </>
  )
}