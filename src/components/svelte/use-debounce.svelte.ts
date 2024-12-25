export const useDebounce = <T>(initialValue: T, delay: number = 250) => {

  let timeout = $state<NodeJS.Timeout | null>(null);
  let value = $state<T>(initialValue);
  let loading = $state<boolean>(false);

  const update = (newValue: T) => {
    if (timeout) clearTimeout(timeout);
    loading = true;

    timeout = setTimeout(() => {
      value = newValue;
      loading = false;
    }, delay);
  };

  return {
    get value() {
      return value;
    },
    update,
    get loading() {
      return loading;
    },
  };
};
