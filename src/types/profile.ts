export interface Profile {
  id: string
  email: string
  name: string
  unit: 'kg' | 'lbs'
  weight: number
  height: number
  bodyFat?: number
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  created_at: string
  updated_at: string
}

export type ProfileFormData = Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>

export interface ProfileUpdateRequest extends Partial<ProfileFormData> {
  id: string
}
