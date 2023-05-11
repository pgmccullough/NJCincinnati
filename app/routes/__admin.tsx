import type { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Header, NavBar } from "~/components";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if(!user) {
    throw new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    })
  }
  return { user };
}

export default function Index() {
  return (
    <>
      <Header />
      <NavBar />
        <main className="content">
          <Outlet />
        </main>
    </>
  );
}
