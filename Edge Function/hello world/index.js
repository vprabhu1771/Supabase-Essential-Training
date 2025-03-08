import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get Supabase credentials from .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loginAndGetJWT() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@gmail.com", // Replace with a valid email
    password: "admin@123", // Replace with the correct password
  });

  if (error) {
    console.error("Login Error:", error.message);
    return;
  }

  const jwtToken = data.session.access_token;
  console.log("JWT Token:", jwtToken);

  // Use the JWT Token in an API request
  callSupabaseFunction(jwtToken);
}

async function callSupabaseFunction(jwtToken) {
  try {
    const response = await fetch(
       SUPABASE_FUNCTION_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ name: "Functions" }),
      }
    );

    const result = await response.json();
    console.log("Function Response:", result);
  } catch (err) {
    console.error("API Call Error:", err);
  }
}

// Run the function
loginAndGetJWT();
