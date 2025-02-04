"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Profile, ProfileFormData } from "@/types/profile"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/lib/hooks/useToast"
import { useRouter } from "next/navigation"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  unit: z.enum(["kg", "lbs"]),
  weight: z.number().min(20, "Weight must be at least 20").max(500, "Weight must be less than 500"),
  height: z.number().min(100, "Height must be at least 100cm").max(300, "Height must be less than 300cm"),
  bodyFat: z.number().min(1, "Body fat must be at least 1%").max(50, "Body fat must be less than 50%").optional(),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
})

interface ProfileFormProps {
  profile: Profile
  onSuccess?: () => void
}

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      unit: profile.unit,
      weight: profile.weight,
      height: profile.height,
      bodyFat: profile.bodyFat,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", profile.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Profile updated successfully!")
      onSuccess?.()
      router.refresh()
    } catch {
      toast.error("An error occurred while updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <select
              className="w-full p-2 border rounded"
              {...register("unit")}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
            {errors.unit && (
              <p className="text-sm text-red-500">{errors.unit.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Weight"
              {...register("weight", { valueAsNumber: true })}
            />
            {errors.weight && (
              <p className="text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Height (cm)"
              {...register("height", { valueAsNumber: true })}
            />
            {errors.height && (
              <p className="text-sm text-red-500">{errors.height.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Body Fat %"
              {...register("bodyFat", { valueAsNumber: true })}
            />
            {errors.bodyFat && (
              <p className="text-sm text-red-500">{errors.bodyFat.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="date"
              {...register("dateOfBirth")}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <select
              className="w-full p-2 border rounded"
              {...register("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
