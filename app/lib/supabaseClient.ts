\import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URLhttps://ifkxlpndhczerpxbaigv.supabase.co
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY sb_publishable_4k74T-hffZz6BSG46T4Cpg_1rMB2GLu

export const supabase = createClient(supabaseUrl, supabaseAnonKey)