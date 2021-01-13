import cookie from 'js-cookie';
// import {isServerSide} from '@/utils/helpers';
const isServerSide= false
export const setCookie = (key:string, value:string) => {
  if (!isServerSide) {
    cookie.set(key, value, {
      expires: 1,
      path: '/'
    });
  }
};

export const removeCookie = (key:string) => {
  if (!isServerSide) {
    cookie.remove(key, {
      expires: 1
    });
  }
};

export const getCookie = (key:string, req:any) => {
  return !isServerSide
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key:string) => {
  return cookie.get(key);
};

const getCookieFromServer = (key:string, req:any) => {
  if (!req?.headers?.cookie) {
    return undefined;
  }
  const rawCookie = req?.headers?.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};
