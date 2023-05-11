import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { getPostBySlug } from '~/data/controllers';
import { TextEditor } from '~/components/TextEditor/TextEditor';

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const prisma = new PrismaClient();
  const slug = params.page;
  let userData:any = await getPostBySlug(slug!);
  userData
    ?Object.entries(userData).forEach(([key, value]:any) => {
      if(typeof value==="bigint") userData[key] = value.toString()
    })
    :""
  await prisma.$disconnect();
  if(!userData) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  return userData;
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return (
    data
      ?[{ title: `Edit ${data.post_title} | The Society of the Cincinnati in the State of New Jersey` }]
      :[{ title: "The Society of the Cincinnati in the State of New Jersey" }]
  )
};

export default function Page() {
  let userData: any = useLoaderData<any>();
  console.log(userData);
  const custom_fields = JSON.parse(userData.custom_fields);
  const groupedCF:{[key: string]: any[]} = {};
  Object.values(custom_fields).map((cf:any) => {
    if(groupedCF[Object.keys(cf)[0]]) {
      groupedCF[Object.keys(cf)[0]].push(Object.values(cf)[0])
    } else {
      groupedCF[Object.keys(cf)[0]] = [Object.values(cf)[0]];
    }
  })



  const [ postTitle, setPostTitle ] = useState<string>(userData?.post_title)
  const [ postContent, setPostContent ] = useState<string>(userData?.post_content);
  const [ customFields, setCustomFields ] = useState<{[key: string]: any}>(groupedCF);
  
  return (
    <div className="editor">
      <main className="edit-post">
        <input
          onChange={(e) => setPostTitle(e.target.value)}
          type="text"
          value={postTitle}
        />
        <TextEditor
          contentStateSetter={setPostContent}
          htmlString={postContent}
        />
        <section className="edit-custom">
          <h1>Custom Fields</h1>
          {Object.entries(customFields).map((cf:any,i:number) => 
            <div key={`edit_cf_${i}`} className="edit-custom__key-value">
              <div className="">{cf[0]}</div>
              {/* <input 
                className=""
                value={cf[1]}
              /> */}
            </div>
          )}
        </section>
      </main>
      <aside className="edit-sidebar">

      </aside>
    </div>
  )
}