import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { V2_MetaFunction } from '@remix-run/node';
import { Header, NavBar } from '~/components';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const prisma = new PrismaClient();
  const slug = params.memberSlug;
  let userData:any = await prisma.njsoc_posts.findFirst({
    where: { post_name: slug }
  })
  userData
    ?Object.entries(userData).forEach(([key, value]:any) => {
      if(typeof value==="bigint") userData[key] = value.toString()
    })
    :""

  await prisma.$disconnect();
  return userData;
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return (
    data
      ?[{ title: `${data.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Member() {
  let userData: any = useLoaderData<any>();
  return (
    <>
      <Header />
      <NavBar />
      <main className="content">
        <article dangerouslySetInnerHTML={{__html: userData?.post_content}} />
      </main>
    </>
  )
}