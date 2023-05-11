import { PrismaClient } from '@prisma/client'
import { sanitize } from '..';

const prisma = new PrismaClient();

export const getCategories = async (postId: string|number) => {
  postId = Number(postId);
  let post:any = await prisma.njsoc_posts.findFirst({
    where: { ID: postId },
    select: { 
      categories: { 
        include: { 
          category: true,
        }
      } 
    }
  })
  .catch(error => console.error(error));

  const catArray = post.categories.map((cat:any) => cat.category.term_id);

  let categories:any = await prisma.njsoc_terms.findMany({
    where: { term_id: { in: catArray } }
  })
  .catch(error => console.error(error));

  await prisma.$disconnect();
  return sanitize(categories);
}