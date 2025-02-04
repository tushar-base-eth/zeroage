-- Add unit column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS unit TEXT CHECK (unit IN ('kg', 'lbs'));

-- Set default value for existing rows
UPDATE profiles 
SET unit = 'kg' 
WHERE unit IS NULL;
