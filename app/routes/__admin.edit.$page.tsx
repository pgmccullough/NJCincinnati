import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { V2_MetaFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const prisma = new PrismaClient();
  const slug = params.page;
  let userData:any = await prisma.njsoc_posts.findFirst({
    where: { post_name: slug }
  })
  userData
    ?Object.entries(userData).forEach(([key, value]:any) => {
      if(typeof value==="bigint") userData[key] = value.toString()
    })
    :""

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
      ?[{ title: `Edit ${data.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Page() {
  let userData: any = useLoaderData<any>();
  return (
    <>
        <input type="text" value={userData?.post_title} />
        <article className="content__article" dangerouslySetInnerHTML={{__html: userData?.post_content}} />
    </>
  )
}