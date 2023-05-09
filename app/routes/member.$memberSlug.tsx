import { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { V2_MetaFunction } from '@remix-run/node';
import { Header, NavBar } from '~/components';
import { getPostBySlug, getSuccession } from '~/data/controllers';
import { getCustomFields } from '~/data';
import { Card } from '~/components/Card';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const slug = params.memberSlug;
  const member:any = await getPostBySlug(slug!);
  let { custom_fields } = member;
  custom_fields = JSON.parse(custom_fields);
  const succession = await getSuccession(getCustomFields(custom_fields,"User Propositus")||member.ID);
  return { member, succession };
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const { member } = data;
  return (
    member
      ?[{ title: `${member.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Member() {
  const data: any = useLoaderData<any>();
  let { member, succession } = data;
  let { custom_fields } = member;
  custom_fields = JSON.parse(custom_fields);
  const displayName = getCustomFields(custom_fields, "User Title")+" "+getCustomFields(custom_fields, "User First Name")+" "+getCustomFields(custom_fields, "User Last Name");

  succession = succession.map((succession:any) => {
    return {...succession, custom_fields: JSON.parse(succession.custom_fields)}
  })

  succession.sort((a:any,b:any) => {
    const aSort = getCustomFields(a.custom_fields, "User Year Admitted");
    const bSort = getCustomFields(b.custom_fields, "User Year Admitted");
    return aSort.localeCompare(bSort);
  })

  return (
    <>
      <Header />
      <NavBar />
      <main className="content member">
        <section style={{position:"relative"}}>
          <h1 className="member__title">
            {displayName}
          </h1>
          <h2 className="member__sub-title">
            {`${getCustomFields(custom_fields, "User Membership Type")} 
              ${getCustomFields(custom_fields, "User Membership Type")!=="Propositus"
                ?"Member, Admitted"
                :""
              }
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
          <div style={{clear:"both"}}/>
        </section>
        <section>
          {succession.map((successor:any, i:number) =>
            member.ID===successor.ID&&!getCustomFields(successor.custom_fields,"User Propositus")
              ?<h1 key={successor.ID}>Successors</h1>
              :!getCustomFields(successor.custom_fields,"User Propositus")
                ?<div key={successor.ID}>
                    <h1>Succession</h1>
                    <h2>Propositus</h2>
                    <Card 
                      key={successor.ID} 
                      isCurrent={member.ID===successor.ID} 
                      successor={successor}
                    />
                    {member.ID!==succession[i+1].ID
                      ?<h2>Predecessors</h2>
                      :""
                    }
                  </div>
                :member.ID===successor.ID&&succession[i+1]
                  ?<div key={successor.ID}>
                    <Card 
                      isCurrent={member.ID===successor.ID}
                      successor={successor} 
                    />
                    <h2>Successors</h2>
                  </div>
                  :<Card
                    key={successor.ID}
                    isCurrent={member.ID===successor.ID}
                    successor={successor}
                  />
          )}
        </section>
      </main>
    </>
  )
}