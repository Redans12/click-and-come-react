import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhrszzywoqetspbtegpd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnN6enl3b3FldHNwYnRlZ3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzEzMDIsImV4cCI6MjA3Njc0NzMwMn0.-xNVGMcn91D6W7WWpQ6N4aYLxlrxKC3s-vh5edbDWOM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)