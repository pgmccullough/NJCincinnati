export const Login: React.FC<{ loginForm: any, pathname: string }> = ({ loginForm, pathname }) => {
  return (
    <>
      <loginForm.Form
        method="POST"
        action={`/api/login`}
      >
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <input type="hidden" name="redirectTo" value={pathname} />
        <button>SUBMIT</button>
      </loginForm.Form>
    </>
  )
}