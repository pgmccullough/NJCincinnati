import { PrismaClient } from '@prisma/client'
import { sanitize } from '..';

const prisma = new PrismaClient();

export const getPostByID = async (ID: string|number) => {
  ID = Number(ID);
  let query:any = await prisma.njsoc_posts.findFirst({
    where: { ID },
    include: { custom_fields: true }
  })
  .catch(error => console.error(error));
  await prisma.$disconnect();
  return sanitize(query);
}