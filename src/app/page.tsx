import { getServerSession } from "next-auth"
import { NEXT_AUTH } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH)
  return (
    <>
      bill split
      <br />
      Server session: {JSON.stringify(session)}
    </>
  )
}
