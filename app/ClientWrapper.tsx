// ClientWrapper.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider >{children}</SessionProvider>;
}
