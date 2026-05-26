import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  // Test 1: Try signup with realistic email
  console.log("--- Test 1: Sign Up ---");
  const email = 'chargentest' + Math.floor(Math.random()*1000) + '@gmail.com';
  const password = 'CharGen123!';
  console.log("Email:", email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: 'Test User' }
    }
  });

  if (error) {
    console.error("SignUp Error:", error.message, error.status);
  } else {
    console.log("SignUp Result:");
    console.log("  User ID:", data.user?.id);
    console.log("  Email:", data.user?.email);
    console.log("  Confirmed:", data.user?.email_confirmed_at ? "Yes" : "No");
    console.log("  Session:", data.session ? "Has session" : "No session (needs confirmation)");
  }

  // Test 2: Try login with existing email (if any)
  console.log("\n--- Test 2: Sign In ---");
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInErr) {
    console.error("SignIn Error:", signInErr.message, signInErr.status);
  } else {
    console.log("SignIn Success!");
    console.log("  User ID:", signInData.user?.id);
    console.log("  Session token:", signInData.session?.access_token?.substring(0, 20) + "...");
  }

  // Test 3: Check profiles table
  console.log("\n--- Test 3: Check profiles ---");
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .limit(5);
  
  if (profileErr) {
    console.error("Profile query error:", profileErr.message);
  } else {
    console.log("Profiles found:", profiles?.length || 0);
    profiles?.forEach(p => console.log("  -", p.id, p.name, p.plan, p.credits));
  }
}

testSignUp();
