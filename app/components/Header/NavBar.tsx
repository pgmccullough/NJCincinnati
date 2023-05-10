import { Link, useLoaderData } from '@remix-run/react';
import { Login } from '../Login/Login';
import { MemberMenu } from './MemberMenu';

const navLinks = [
  {name: "ABOUT", link: null, children: [
    {name: "WELCOME", link: "/welcome"},
    {name: "PURPOSE", link: "/purpose"},
    {name: "GOVERNANCE", link: "/governance"},
    {name: "DONATE", link: "/treasury"}
  ]},
  {name: "HISTORY", link: null, children: [
    {name: "1783 INSTITUTION", link: "/1783-institution"},
    {name: "NEW JERSEY SOCIETY", link: "/new-jersey-society"}
  ]},  
  {name: "ACTIVITIES", link: null, children: [
    {name: "MEETINGS", link: "/meetings"},
    {name: "HISTORY PRIZE", link: "/history-prize"},
    {name: "GRANTS PROGRAM", link: "/grants-program"}
  ]},
  {name: "MEMBERSHIP", link: null, children: [
    {name: "ELIGIBILITY", link: "/eligibility"},
    {name: "PROPOSITI", link: "/propositi"},
    {name: "MEMBERSHIP INQUIRIES", link: "/membership-inquiries"},
    {name: "HEITMAN'S REGISTER", link: "/heitmans-register"}
  ]},
  {name: "GENERAL SOCIETY", link: "/general-and-constituent-societies/", children: []},
  {name: "CONTACT", link: "/contact", children: []}
]

export const NavBar: React.FC = () => {
  let data: any = useLoaderData<any>();
  return (
    <div className="nav-bar">
      <nav className="nav-bar__links">
        {navLinks.map((navLink) => {
          return (
            <div key={navLink.name} className="nav-bar__container">
              <div className="nav-bar__active" />
              {navLink.link
                ?<li className="nav-bar__parent"><Link to={navLink.link}>{navLink.name}</Link></li>
                :<li className="nav-bar__parent">{navLink.name}</li>}
              {navLink.children.length
                ?<div className="nav-bar__children">
                  {navLink.children.map((subLink) =>
                    <li key={`sub_${subLink.name}`}><Link to={subLink.link}>{subLink.name}</Link></li>
                  )}
                </div>
                :""}
            </div>  
          )
        })}
      </nav>
      {data?.user?<MemberMenu />:<Login />}
    </div>
  )
}