import { Link, useLoaderData } from '@remix-run/react';

export const MemberMenu: React.FC = () => {
  let data: any = useLoaderData<any>();
  const { user }:{user: { ID: number, post_id: string, username: string, img: string }} = data;
  const { ID, post_id, username, img } = user;
  return (
    <><img src={img} alt={username} /><>{username}</></>
  )
}