import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  orderId: string;
  phone: string;
  amount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { orderId, phone, amount }: PaymentRequest = await req.json();

    console.log("Initiating payment:", { orderId, phone, amount });

    // Validate order belongs to user
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found or unauthorized");
    }

    // Format phone number
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+254" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+254" + formattedPhone;
    }

    console.log("Formatted phone:", formattedPhone);

    // Initiate STK push via Lipana API
    const lipanaResponse = await fetch(
      "https://api.lipana.dev/v1/transactions/push-stk",
      {
        method: "POST",
        headers: {
          "x-api-key": Deno.env.get("LIPANA_API_KEY") ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: amount,
        }),
      }
    );

    const lipanaData = await lipanaResponse.json();
    console.log("Lipana response:", lipanaData);

    if (!lipanaResponse.ok) {
      throw new Error(lipanaData.message || "Failed to initiate payment");
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        order_id: orderId,
        amount: amount,
        phone_number: formattedPhone,
        transaction_id: lipanaData.data?.transactionId || null,
        status: "pending",
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment creation error:", paymentError);
      throw new Error("Failed to create payment record");
    }

    console.log("Payment created:", payment);

    return new Response(
      JSON.stringify({
        success: true,
        message: "STK push sent to your phone",
        data: {
          paymentId: payment.id,
          transactionId: lipanaData.data?.transactionId,
          checkoutRequestID: lipanaData.data?.checkoutRequestID,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in initiate-payment function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to initiate payment",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
