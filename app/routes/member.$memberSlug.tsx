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
  const displayName = getCustomFields(custom_fields, "User Title")+" "+getCustomFields(custom_fields, "User First Name")+" "+getCustomFields(custom_fields, "User Last Name");

  return (
    <>
      <Header />
      <NavBar />
      <main className="content member">
        <h1 className="member__title">
          {displayName}
        </h1>
        <h2 className="member__sub-title">
          {`${getCustomFields(custom_fields, "User Membership Type")} 
            Member, Admitted
            ${getCustomFields(custom_fields, "User Year Admitted")}
          `}
        </h2>
        {getCustomFields(custom_fields, "User Profile Picture")
          ?<figure className="member__profile-image">
              <img
                alt={`${displayName}, a Member of the Society of the Cincinnati in the State of New Jersey`}
                className="member__img"
                src={getCustomFields(custom_fields, "User Profile Picture")}
              />
              <figcaption className="member__caption">
                <p>{displayName}</p>
                {getCustomFields(custom_fields, "NJ Officer President")
                  ?<><p>President of the New Jersey Society</p><p>{getCustomFields(custom_fields, "NJ Officer President").split("||")[1]}</p></>
                  :""
                }
              </figcaption>
          </figure>
          :""
        }
        <article 
          className="content__article"
          dangerouslySetInnerHTML={{__html: member?.post_content}}
        />
      </main>
    </>
  )
}