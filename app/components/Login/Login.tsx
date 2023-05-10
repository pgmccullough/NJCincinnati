import { useEffect, useState } from "react"
import { useFetcher } from "@remix-run/react";

export const Login: React.FC = () => {
  const loginForm = useFetcher();

  return (
    <>
      <loginForm.Form
        method="POST"
        action={`/api/login`}
      >
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <input type="hidden" name="redirectTo" value="/" />
        <button>SUBMIT</button>
      </loginForm.Form>
    </>
  )
}