export function useDebouncedRef(value: string, delay = 200, callback: Function | null = null) {
    let timeout: typeof setTimeout | null;
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return value;
            },
            set(newValue) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    value = newValue;
                    if(callback) callback();
                    trigger();
                }, delay);
            }
        };
    });
}