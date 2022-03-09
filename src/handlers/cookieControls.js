import Cookies from "universal-cookie";

const cookies = new Cookies();

const options = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: Number(process.env.REACT_APP_COOKIE_MAX_AGE),
  path: "/",
};

export const setCookie = (name, value) => {
  return cookies.set(name, value, options);
};

export const removeCookie = (name) => {
  return cookies.remove(name, options);
};
