import { createServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Profile not found. Please contact support.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <ProfileForm profile={profile} />
    </div>
  )
}
