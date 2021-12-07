import Api from "./api";

export const TOKEN_KEY = "@supermix-Token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {

  Api.post(`/logout`, {
    accessToken: getToken()
  }, {
  }).then(res => {
    localStorage.removeItem(TOKEN_KEY);
    setTimeout(function(){ 
      window.location = "/admin/login";
    }, 500);
    
  }).catch((error) => {
    localStorage.removeItem(TOKEN_KEY);
    window.location = "/admin/login";
  });

  
};