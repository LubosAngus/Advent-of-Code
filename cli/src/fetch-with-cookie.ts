export default async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  options.headers = {
    ...(options.headers || {}),
    cookie: `session=${process.env.USER_SESSION_COOKIE}`,
  };

  return fetch(url, options);
};
