import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Header, NavBar } from "~/components";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
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
