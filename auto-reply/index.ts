// import { serve } from 'std/server'
// import { createClient } from '@supabase/supabase-js'
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  try {
    const { message } = await req.json();

    // Call OpenAI API for auto-reply
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'system', content: 'You are a helpful chatbot.' }, { role: 'user', content: message }]
      })
    });

    const openaiData = await openaiResponse.json();
    const aiReply = openaiData.choices[0].message.content;

    return new Response(JSON.stringify({ reply: aiReply }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
