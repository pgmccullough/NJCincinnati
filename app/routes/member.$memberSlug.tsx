import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

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

export default function Member() {
  let userData: any = useLoaderData<any>();
  return <>{userData.post_content}</>
}