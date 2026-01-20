import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client to fetch knowledge base
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch active knowledge base entries
    const { data: knowledgeBase, error: kbError } = await supabase
      .from("knowledge_base")
      .select("title, content, category")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (kbError) {
      console.error("Error fetching knowledge base:", kbError);
    }

    // Build knowledge context
    let knowledgeContext = "";
    if (knowledgeBase && knowledgeBase.length > 0) {
      knowledgeContext = "\n\n## Knowledge Base:\n" + 
        knowledgeBase.map(kb => 
          `### ${kb.title}${kb.category ? ` (${kb.category})` : ""}\n${kb.content}`
        ).join("\n\n");
    }

    const systemPrompt = `You are a helpful customer support assistant for UMS Kenya, a company that sells prepaid utility meters (electricity, water, gas).

Your role is to:
- Answer questions about UMS products and services
- Help customers with meter registration and token purchases
- Provide information about pricing, delivery, and support
- Guide users to the appropriate pages or contact methods

Be friendly, professional, and concise. If you don't know something specific, suggest the customer contact us via WhatsApp at 0700444448.
${knowledgeContext}

Always be helpful and provide accurate information based on the knowledge base above. If asked about something not in the knowledge base, politely explain you don't have that specific information and suggest contacting customer support.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're experiencing high traffic. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to process your request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
