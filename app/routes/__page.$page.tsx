import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction, redirect, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getCategories } from '~/data/controllers';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const prisma = new PrismaClient();
  const slug = params.page;
  let postData:any = await prisma.njsoc_posts.findFirst({
    where: { post_name: slug }
  })
  postData
    ?Object.entries(postData).forEach(([key, value]:any) => {
      if(typeof value==="bigint") postData[key] = value.toString()
    })
    :""

  await prisma.$disconnect();
  if(!postData) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  const postCategories = await getCategories(postData.ID);
  const isUser = postCategories.find((cat:{
    term_id: bigint, name: string, slug: string, term_group: bigint
  }) => cat.name === 'Users');
  if(isUser) return redirect(`/member/${params.page}`, 301);
  return postData;
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return (
    data
      ?[{ title: `${data.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Page() {
  let postData: any = useLoaderData<any>();
  return (
    <>
        <h1>{postData?.post_title}</h1>
        <article className="content__article" dangerouslySetInnerHTML={{__html: postData?.post_content}} />
    </>
  )
}