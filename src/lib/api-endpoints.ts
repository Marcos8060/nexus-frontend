//------------------------ Backend APIs ----------------------//

export const API_URL = {
  /***************** AUTH APIS **********************/
  LOGIN: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/`,

};



//------------------------ Application APIs ----------------------//
export const APP_API_URL = {
  //-------------- AUTH APIs ------------------//
  LOGIN: "/api/auth/login",
  MY_CREDENTIALS: "/api/auth/me",

};




export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
};
