import { PrismaClient } from '@prisma/client'
import { LoaderArgs, LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
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

  const custom_fields = JSON.parse(userData.custom_fields);
  const groupedCF:{[key: string]: any[]} = {};
  Object.values(custom_fields).map((cf:any) => {
    if(groupedCF[Object.keys(cf)[0]]) {
      groupedCF[Object.keys(cf)[0]].push(Object.values(cf)[0])
    } else {
      groupedCF[Object.keys(cf)[0]] = [Object.values(cf)[0]];
    }
  })

  const [ htmlCheck ] = useSearchParams();
  const [ postTitle, setPostTitle ] = useState<string>(userData?.post_title);
  const [ postSlug, setPostSlug ] = useState<string>(userData?.post_name);
  const [ , setPostContent ] = useState<string>(userData?.post_content);
  const [ customFields, setCustomFields ] = useState<{[key: string]: any}>(groupedCF);

  if(htmlCheck.get("view")) {
    userData.post_content = `${userData.post_content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`;
  }
  
  const updateCF = (newValue: string, cfKey: string, cfId: string) => {
    const updatedCfVal = customFields[cfKey].map(
      (val: any) => 
      val[1]===cfId?[newValue,val[1],val[2]]:[val[0],val[1],val[2]]
    );
    setCustomFields({...customFields, [cfKey]: updatedCfVal});
  }

  return (
    <div className="editor">
      <main className="edit-post">
        <input
          onChange={(e) => setPostTitle(e.target.value)}
          type="text"
          value={postTitle}
        />
        <input
          onChange={(e) => setPostSlug(e.target.value)}
          type="text"
          value={postSlug}
        />
        {!htmlCheck.get("view")?<a href="?view=html">HTML</a>:<a href="?">Rich Text</a>}
        <TextEditor
          contentStateSetter={setPostContent}
          htmlString={userData?.post_content}
        />
        <section className="edit-custom">
          <h1>Custom Fields</h1>
          {Object.entries(customFields).map((cf:any,i:number) => 
            <div key={`parent_${cf[1][0][1]}`} className="edit-custom__key-value">
              <div className="">{cf[0]}</div>
              {cf[1].map((val:any) => 
                <input 
                  className=""
                  key={`input_${val[1]}`}
                  onChange={(e) => updateCF(e.target.value, cf[0], val[1])}
                  value={val[0]}
                />
              )}
            </div>
          )}
        </section>
      </main>
      <aside className="edit-sidebar">

      </aside>
    </div>
  )
}