import { parse } from 'date-fns';

export function parseDateString(dateString: string, format: string) {
  return parse(dateString, format, new Date());
}
