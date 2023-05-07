import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Header, NavBar } from '~/components';
import { V2_MetaFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  const prisma = new PrismaClient();
  let propositi = {};
  const cfArr:any = [];
  let userDataArr:any = await prisma.njsoc_posts.findMany({
    take: 2,
    include: { categories: true }
  }).catch(error => console.log(error));
  console.log(userDataArr);
  userDataArr.forEach((userData:any) => {
    Object.entries(userData).forEach(([key, value]:any) => {
      if(typeof value==="bigint") userData[key] = value.toString();
      if(key==="custom_fields") {
        const customFields = userData[key];
        for(const customField of customFields) cfArr.push([customField.meta_key, customField.meta_value]);
        userData[key] = cfArr;
      }
    });
    console.log(userData);
    propositi = {...propositi, [userData.ID]: userData}
  })
  await prisma.$disconnect();
  if(!propositi) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  console.log(propositi);
  return propositi;
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [{ title: "Propositi | The Society of the Cincinnati in the State of New Jersey" }];
};

export default function Page() {
  let userData: any = useLoaderData<any>();
  return (
    <>
      <Header />
      <NavBar />
      <main className="content">
        {/* {Object.entries(userData)?.map(prop => <div>{JSON.stringify(prop)}</div>)} */}
        {/* <h1>{userData?.post_title}</h1>
        <article dangerouslySetInnerHTML={{__html: userData?.post_content}} />
        {userData.custom_fields.map(cf => <div key={`${cf[0]}${cf[1]}`}>{cf[0]}: {cf[1]}</div>)} */}
      </main>
    </>
  )
}