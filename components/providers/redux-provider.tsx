'use client';

import { AppStore, makeStore } from '@/lib/store';
import { ChildrenProps } from '@/types';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export default function ReduxProvider({ children }: ChildrenProps) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
