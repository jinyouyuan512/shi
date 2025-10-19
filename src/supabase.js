import { createClient } from '@supabase/supabase-js'

// Supabase项目URL和匿名密钥
const supabaseUrl = 'https://jppkanmbiltjjlywzzhb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcGthbm1iaWx0ampseXd6emhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODMyNDMsImV4cCI6MjA3NjM1OTI0M30.Y1zVit3ozvAf7S-dUxXhXrDzWv3lnqJ7RH9SKJxw9S4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)