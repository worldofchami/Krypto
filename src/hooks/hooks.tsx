import { theme } from "../client/interfaces";

export function useToggleLocalStorage(key: string, values: string[]) {
    const current: string = localStorage.getItem(key);
    const valOne = values[0];
    const valTwo = values[1];

    if(!current) {
        localStorage.setItem(key, valOne);
        return valOne;
    }

    else if(current === valOne) {
        localStorage.setItem(key, valTwo);
        return valTwo;
    }

    else {
        localStorage.setItem(key, valOne);
        return valOne;
    }
};

export function useFetchLocalStorage(key: string) {
    return localStorage.getItem(key);
};

export function useUpdateTheme(theme: theme) {
    document.querySelector("html").setAttribute("data-theme", theme);
}