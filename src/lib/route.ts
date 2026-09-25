import { useEffect, useState } from 'react';
import { QUESTION_COUNT } from '../data/questions';
import { isWardId } from '../data/wards';
import type { WardId } from '../data/types';

export type Route =
  | { name: 'intro' }
  | { name: 'quiz'; q: number }
  | { name: 'result' }
  | { name: 'shared'; ward: WardId }
  | { name: 'about' }
  | { name: 'references' }
  | { name: 'notfound' };

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, '');
  const [path] = h.split('?');
  if (path === '' || path === '/') return { name: 'intro' };
  if (path === '/about') return { name: 'about' };
  if (path === '/references') return { name: 'references' };
  if (path === '/result') return { name: 'result' };
  const q = /^\/q\/(\d{1,2})$/.exec(path);
  if (q) {
    const n = Number(q[1]);
    return n >= 1 && n <= QUESTION_COUNT ? { name: 'quiz', q: n } : { name: 'notfound' };
  }
  const r = /^\/result\/([A-Za-z]+)$/.exec(path);
  if (r && isWardId(r[1])) return { name: 'shared', ward: r[1] };
  return { name: 'notfound' };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'intro':
      return '#/';
    case 'quiz':
      return `#/q/${route.q}`;
    case 'result':
      return '#/result';
    case 'shared':
      return `#/result/${route.ward}?v=1`;
    case 'about':
      return '#/about';
    case 'references':
      return '#/references';
    case 'notfound':
      return '#/not-found';
  }
}

export function navigate(route: Route, replace = false) {
  const hash = routeToHash(route);
  if (window.location.hash === hash) return;
  if (replace) {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = hash;
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
