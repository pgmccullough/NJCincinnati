import { PrismaClient } from '@prisma/client'
import { sanitize } from '..';

const prisma = new PrismaClient();

export const getPostBySlug = async (slug: string) => {
  let query:any = await prisma.njsoc_posts.findFirst({
    where: { post_name: slug },
    include: { custom_fields: true }
  })
  .catch(error => console.error(error));
  await prisma.$disconnect();
  return sanitize(query);
}