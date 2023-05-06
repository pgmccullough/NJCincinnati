import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "@remix-run/react";
import { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import styles from "~/styles/style.css";

export const links: LinksFunction = () => [
  ...[{ rel: "stylesheet", href: styles }],
];

export const ErrorBoundary: V2_ErrorBoundaryComponent|any = () => {
  const error = useRouteError();
  if(isRouteErrorResponse(error)) {
    return <><h1>{error.status}</h1><p>{error.statusText}</p></>
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
