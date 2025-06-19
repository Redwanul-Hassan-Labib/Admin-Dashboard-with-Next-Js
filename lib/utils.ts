import { clsx, type ClassValue } from 'clsx';
import mongoose from 'mongoose';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formUrlQuery({ params, key, value }: { params: string; key: string; value: string | null }) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({ params, keysToRemove }: { params: string; keysToRemove: [string] }) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export const objectId = (id: string) => (id ? new mongoose.Types.ObjectId(id) : id);
