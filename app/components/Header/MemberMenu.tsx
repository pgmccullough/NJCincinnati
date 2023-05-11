import { Link, useFetcher, useLoaderData, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Login } from '../Login/Login';

export const MemberMenu: React.FC = () => {
  let data: any = useLoaderData<any>();
  const logoutFetcher = useFetcher();
  const loginForm = useFetcher();
  const { pathname } = useLocation();

  const [ isExpanded, setIsExpanded ] = useState<boolean>(false);

  useEffect(() => {
    loginForm.state==="loading"?setIsExpanded(false):"";
  },[ loginForm ])

  const { user }:{user: { ID: number, post_id: string, username: string, img: string }} = data;

  const logout = (e: any) => {
    e.preventDefault();
    setIsExpanded(false);
    logoutFetcher.submit(
      {redirectTo: pathname},
      {method: "POST", action: "/api/logout"}
    )
  }

  return (
    <div className="nav-bar__container nav-bar__container--member">
      {isExpanded
        ?<div 
          className="nav-bar__blur" 
          onClick={() => setIsExpanded(false)} 
        />
        :""
      }
      <div className={`nav-bar__active${isExpanded?" nav-bar__active--expanded":""}`} />
      <li 
        className="nav-bar__parent nav-bar__parent--member"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {data?.user
          ?<div className="nav-bar__logged-in">
            <img className="nav-bar__image" src={user?.img} alt={user?.username} />
            <div className="nav-bar__member-name">{user?.username}</div>
          </div>
          :"Member Log In"
        }
      </li>
      {data?.user
        ?<div className={`nav-bar__children nav-bar__children--logged-in${isExpanded?" nav-bar__children--expanded":""}`}>
          <li><Link to="/">MY ACCOUNT</Link></li>
          <li><Link to="/">DIRECTORY</Link></li>
          <li><Link to="/">DISCUSSION</Link></li>
          <li><Link to="/">DOCUMENTS</Link></li>
          <li><Link to="/">DONATE</Link></li>
          <li><Link to="/">MEMBER CALLING</Link></li>
          <li><Link to="/" onClick={logout}>LOG OUT</Link></li>
        </div>
        :<div className={`nav-bar__children nav-bar__children--logged-out${isExpanded?" nav-bar__children--expanded":""}`}>
          <Login 
          loginForm={loginForm}
          pathname={pathname}
        />
        </div>
      }
    </div>
  )
}