export const sanitize = (dirtyObj: any) => {

  for( let obj of dirtyObj ) {
    Object.entries(obj).forEach(([key, value]:any) => {
      if(typeof value==="bigint") obj[key] = value.toString();
      if(key==="custom_fields") {
        const customFields = obj[key];
        const cf = [];
        for(const customField of customFields) cf.push({[customField.meta_key]: customField.meta_value});
        obj[key] = JSON.stringify(cf);
      }
    });
  }
  return dirtyObj;
}

export const getCustomFields = (fields:{[key: string]: string}[], key:string) => {
  const field = fields.find((field:any) => field[key]);
  return field?field[key]:"";
}