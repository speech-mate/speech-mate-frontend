import Cookies from "universal-cookie";

const cookies = new Cookies();

const options = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: Number(process.env.REACT_APP_COOKIE_MAX_AGE),
};

export const setCookie = (name, value) => {
  // cookies.set(name, value, options);
  return cookies.set(name, value);
};

export const removeCookie = (name) => {
  // cookies.remove(name, options)
  return cookies.remove(name);
};
