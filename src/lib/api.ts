const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function githubFetch(input: RequestInfo, init: RequestInit = {}) {
  const config: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...init.headers,
    },
  };

  const res = await fetch(`${BASE_URL}${input}`, config);
  return res;
}
