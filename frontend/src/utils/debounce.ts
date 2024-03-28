export function debounce(callback: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}
