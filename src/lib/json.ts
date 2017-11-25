//JSON.parse errors if given JSON. Since API may set return header in future
//allParse works with both JSON objects and strings.
export function allParse (json : any) {
  if(json !== null && typeof json === 'object'){
    return json;
  }else if(typeof json === 'string'){
    return JSON.parse(json);
  }else{
    return json;
  }
};
