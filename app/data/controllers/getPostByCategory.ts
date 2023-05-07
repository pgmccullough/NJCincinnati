import { PrismaClient } from '@prisma/client'
import { sanitizeArray as sanitize } from '..';

const prisma = new PrismaClient();

export const getPostByCategory = async (category: string) => {
  let catId:any = await prisma.njsoc_terms.findFirst({
    where: { name: category }
  })
  .catch(error => console.error(error));

  let query:any = await prisma.njsoc_term_taxonomy.findFirst({
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
  .catch(error => console.error(error));
  await prisma.$disconnect();

  let { posts } = query;

  return sanitize(posts.map((post:any) => post.post));
}