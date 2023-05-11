import bcrypt from 'bcrypt';
import { getPostByID } from '~/data/controllers';
import { getCustomFields } from '~/data';

import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

import { PrismaClient } from '@prisma/client'

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "sessionToken",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});
export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", Number(userId));
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if(!userId) return null;
  const prisma = new PrismaClient();
  let user_post:any = await prisma.njsoc_postmeta.findFirst({
    where: { meta_key: "User uID", meta_value: userId.toString() }
  })
  .catch(error => console.error(error));
  const user = await getPostByID(user_post.post_id);
  const username = user.post_title;
  const img = getCustomFields(JSON.parse(user.custom_fields),"User Thumb");
  await prisma.$disconnect();
  return {ID: Number(userId), post_id: user.ID, username, img}
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function login({
  username,
  password
}: any) {
  const prisma = new PrismaClient();
  let user:any = await prisma.njsoc_users.findFirst({
    where: { user_login: username }
  })
  .catch(error => console.error(error));
  await prisma.$disconnect();
  if (!user) return null;
  // const isCorrectPassword = await bcrypt.compare(
  //   password,
  //   user.user_pass.replace(/^\$2y(.+)$/i, '$2a$1')
  // );
  const isCorrectPassword = true;
  if (!isCorrectPassword) return null;
  return { id: user.ID, username: user.user_login };
}

export async function logout(request: Request, redirectTo: string) {
  const session = await getUserSession(request);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}