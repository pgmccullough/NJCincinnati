import type { V2_MetaFunction } from "@remix-run/node";
import { Header, NavBar } from "~/components";
import { Outlet } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "The Society of the Cincinnati in the State of New Jersey" }];
};

export default function Index() {
  return (
    <>
      <Header />
      <NavBar />
      <Outlet />
    </>
  );
}
