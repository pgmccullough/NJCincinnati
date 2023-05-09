import { PrismaClient } from '@prisma/client'
import { sanitizeArray as sanitize } from '..';
import { getPostByID } from '.';

const prisma = new PrismaClient();

export const getSuccession = async (propositus_id: string) => {
  let query:any = await prisma.njsoc_postmeta.findMany({
    where: { meta_key: "User Propositus", meta_value: propositus_id },
    include: { 
      posts: { 
        include: { 
          custom_fields: true
        }
      } 
    }
  })
  .catch(error => console.error(error));
  await prisma.$disconnect();
  let propositus:any = await getPostByID(propositus_id);
  let succession = query.map((member: any) => member.posts);
  succession = sanitize(succession);
  succession.push(propositus);
  return succession;
}