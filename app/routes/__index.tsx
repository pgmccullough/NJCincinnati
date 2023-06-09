import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { Header, NavBar } from "~/components";
import { getUser } from "~/utils/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "The Society of the Cincinnati in the State of New Jersey" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return { user }
}

export default function Index() {
  return (
    <>
      <Header />
      <NavBar />
      <Outlet />
    </>
  );
}
