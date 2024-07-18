import { HttpInterceptorFn } from '@angular/common/http';

export const getCookie = (cookieString: string, name: string) => {
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
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    withCredentials: true,
  });

  const csrfCookie = getCookie(document.cookie, 'csrftoken');

  if (csrfCookie) {
    req = req.clone({
      setHeaders: {
        'X-CSRFToken': csrfCookie,
      },
    });
  }

  return next(req);
};
