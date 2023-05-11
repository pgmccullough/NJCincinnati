export const sanitize = (dirtyObj: any) => {
  Object.entries(dirtyObj).forEach(([key, value]:any) => {
    if(typeof value==="bigint") dirtyObj[key] = value.toString();
    if(key==="custom_fields") {
      const customFields = dirtyObj[key];
      const cf = [];
      for(const customField of customFields) cf.push({[customField.meta_key]: [customField.meta_value, String(customField.meta_id), String(customField.post_id)]});
      dirtyObj[key] = JSON.stringify(cf);
    }
  });
  return dirtyObj;
}

export const sanitizeArray = (dirtyObj: any) => {
  for( let obj of dirtyObj ) {
    Object.entries(obj).forEach(([key, value]:any) => {
      if(typeof value==="bigint") obj[key] = value.toString();
      if(key==="custom_fields") {
        const customFields = obj[key];
        const cf = [];
        for(const customField of customFields) cf.push({[customField.meta_key]: [customField.meta_value, String(customField.meta_id), String(customField.post_id)]});
        obj[key] = JSON.stringify(cf);
      }
    });
  }
  return dirtyObj;
}

export const getCustomFields = (fields:{[key: string]: string}[], key:string) => {
  const field = fields.find((field:any) => field[key]);
  return field?field[key][0]:"";
}