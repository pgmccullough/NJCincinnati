import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { V2_MetaFunction } from '@remix-run/node';
import { Header, NavBar } from '~/components';
import { getPostBySlug } from '~/data/controllers';
import { getCustomFields } from '~/data';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const slug = params.memberSlug;
  let member:any = await getPostBySlug(slug!)
  return member;
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return (
    data
      ?[{ title: `${data.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Member() {
  let member: any = useLoaderData<any>();
  let { custom_fields } = member;
  custom_fields = JSON.parse(custom_fields);
  
  return (
    <>
      <Header />
      <NavBar />
      <main className="content">
        <h1>
          {`${getCustomFields(custom_fields, "User Title")} 
            ${getCustomFields(custom_fields, "User First Name")} 
            ${getCustomFields(custom_fields, "User Last Name")}
          `}
        </h1>
        <h2>
          {`${getCustomFields(custom_fields, "User Membership Type")} 
            Member, Admitted
            ${getCustomFields(custom_fields, "User Year Admitted")}
          `}
        </h2>
        <article 
          className="content__article"
          dangerouslySetInnerHTML={{__html: member?.post_content}}
        />
      </main>
    </>
  )
}