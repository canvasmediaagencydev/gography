/**
 * Create Admin User Script
 *
 * This script creates an admin user in Supabase Authentication
 * and adds them to the admin_users table.
 *
 * Usage: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      process.env[key] = value
    }
  })
}

async function createAdminUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials')
    process.exit(1)
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🔐 Creating admin user...\n')

  // Admin credentials
  const email = 'admin@gography.com'
  const password = 'qwer1234'
  const fullName = 'Admin User'

  try {
    // Step 1: Create auth user
    console.log('📧 Creating authentication user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      process.exit(1)
    }

    if (!authData.user) {
      console.error('❌ Error: No user data returned')
      process.exit(1)
    }

    console.log('✅ Auth user created!')
    console.log('   User ID:', authData.user.id)
    console.log('   Email:', authData.user.email)

    // Step 2: Add to admin_users table
    console.log('\n👤 Adding to admin_users table...')
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'admin',
        is_active: true
      })

    if (adminError) {
      console.error('❌ Error adding to admin_users:', adminError.message)
      console.log('\n⚠️  Note: Auth user was created but not added to admin_users table.')
      console.log('   You can manually add them with this SQL:')
      console.log(`
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES ('${authData.user.id}', '${email}', '${fullName}', 'admin', true);
`)
      process.exit(1)
    }

    console.log('✅ Added to admin_users table!')

    console.log('\n🎉 Admin user created successfully!')
    console.log('\n📝 Login credentials:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('\n🔗 Login at: http://localhost:3000/admin/login')

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

// Run the script
createAdminUser()
