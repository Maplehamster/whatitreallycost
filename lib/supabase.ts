import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://naaisswcxymuxnkyvheo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYWlzc3djeHltdXhua3l2aGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTMzOTIsImV4cCI6MjA5NDk2OTM5Mn0.KqgeIC8s3_GaGzEDRbK46T74_-Ki3wO8yHqOP4MSEuw'
)
