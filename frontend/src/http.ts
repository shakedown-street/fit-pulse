import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  config.headers['X-CSRFToken'] = parseCookie(document.cookie, 'csrftoken');
  return config;
});

export function parseCookie(cookieString: string, name: string) {
  let cookieValue = null;
  if (cookieString && cookieString !== '') {
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export type ListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
