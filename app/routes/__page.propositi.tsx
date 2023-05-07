import { LoaderFunction } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Header, NavBar } from '~/components';
import { V2_MetaFunction } from '@remix-run/node';

import { getPostByCategory } from '~/data/controllers';
import { getCustomFields } from '~/data';

export const loader: LoaderFunction = async () => {

  const propositi = await getPostByCategory('Propositi');

  if(!propositi) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  return propositi;
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [{ title: "Propositi | The Society of the Cincinnati in the State of New Jersey" }];
};

export default function Page() {
  let propositi: any = useLoaderData<any>();
  propositi = propositi.map((propositus:any) => {
    return {...propositus, custom_fields: JSON.parse(propositus.custom_fields)}
  })

  propositi.sort((a:any,b:any) => {
    const aSort = getCustomFields(a.custom_fields, "Sort Last Name");
    const bSort = getCustomFields(b.custom_fields, "Sort Last Name");
    return aSort.localeCompare(bSort);
  })

  return (
    <>
      <Header />
      <NavBar />
      <main className="content">
        {propositi.map((propositus: any) => {
          const { custom_fields } = propositus;
          return (
            <div
              key={propositus.ID}
              className={`propositi-table${Number(getCustomFields(custom_fields,"Represented"))?" propositi-table--represented":""}`}
            >
              <div className="propositi-table__cell">
                <NavLink to={`/member/${propositus.post_name}`}>
                  {`${getCustomFields(custom_fields,"Sort Last Name")}, 
                    ${getCustomFields(custom_fields,"Sort First Name")}`}
                </NavLink>
              </div>
              <div className="propositi-table__cell">
                <NavLink to={`/member/${propositus.post_name}`}>
                  {getCustomFields(custom_fields,"Sort Desc")}
                </NavLink>
              </div>
            </div>
          )
        })}
      </main>
    </>
  )
}