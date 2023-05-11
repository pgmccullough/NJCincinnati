import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const redirectTo = form.get("redirectTo")?.toString();
  return logout(request, redirectTo||"");
};
export const loader: LoaderFunction = async () => {
  return redirect("/");
};