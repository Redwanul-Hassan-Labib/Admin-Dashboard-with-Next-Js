'use client';

import { useEffect } from 'react';

export default function OfflineProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/offline.js');
    }
  }, []);
  return null;
}
