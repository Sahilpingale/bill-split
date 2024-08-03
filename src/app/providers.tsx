"use client"

import { MantineProvider } from "@mantine/core"
import { SessionProvider } from "next-auth/react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <MantineProvider>{children}</MantineProvider>
    </SessionProvider>
  )
}
