import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export const buildQueryParams = (
    params?: Record<string, string | string[] | number | boolean>
) => {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
        } else {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
};
