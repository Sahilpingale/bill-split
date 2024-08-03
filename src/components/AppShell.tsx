"use client"

import {
  AppShell as MantineAppShell,
  Burger,
  Flex,
  Stack,
  Button,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { signIn, signOut, useSession } from "next-auth/react"

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const session = useSession()

  const [opened, { toggle }] = useDisclosure()
  return (
    <div>
      <MantineAppShell
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <MantineAppShell.Header>
          <Flex justify="space-between">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <div>Logo</div>
          </Flex>
        </MantineAppShell.Header>

        <MantineAppShell.Navbar p="md">
          <Stack>
            {session.status === "authenticated" ? (
              <Button onClick={() => signOut()}>Sign out</Button>
            ) : (
              <Button onClick={() => signIn()}>Sign in</Button>
            )}
          </Stack>
        </MantineAppShell.Navbar>

        <MantineAppShell.Main>
          <div>{children}</div>
          {JSON.stringify(session)}
        </MantineAppShell.Main>
      </MantineAppShell>
    </div>
  )
}

export default AppShell
