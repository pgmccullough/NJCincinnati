import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import { Header, NavBar } from "~/components";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return { user };
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "The Society of the Cincinnati in the State of New Jersey" }];
};

export default function Index() {
  let user: any = useLoaderData<any>();
  console.log(user);
  return (
    <>
      <Header />
      <NavBar />
      <Outlet />
    </>
  );
}
