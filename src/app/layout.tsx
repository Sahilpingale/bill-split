import "@mantine/core/styles.css"
import { ColorSchemeScript } from "@mantine/core"
import { Providers } from "./providers"
import AppShell from "@/components/AppShell"

export const metadata = {
  title: "BillSplit",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
