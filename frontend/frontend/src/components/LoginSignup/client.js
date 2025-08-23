import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rtmezggfafrtbwqrwhmt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWV6Z2dmYWZydGJ3cXJ3aG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzg1NzEsImV4cCI6MjA2NDM1NDU3MX0.lDWSqovsj0tEOZ-eX_ukxnLPwsw3C84imnGi8xUavZQ';
export const supabase = createClient(supabaseUrl, supabaseKey)