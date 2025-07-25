"use client";

import { SessionProvider } from "next-auth/react";

import { NotificationProvider } from "./Notification";


export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
       
          {children}
       
      </NotificationProvider>
    </SessionProvider>
  );
}
