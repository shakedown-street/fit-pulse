import { format, parse } from 'date-fns';

export function parseDateString(dateString: string, format: string) {
  return parse(dateString, format, new Date());
}

export function formatDateString(dateString: string, currentFormat: string, newFormat: string) {
  return format(parseDateString(dateString, currentFormat), newFormat);
}
