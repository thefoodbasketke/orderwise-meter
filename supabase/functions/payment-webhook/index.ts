import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-lipana-signature, content-type",
};

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Simple comparison for Deno environment
  return signature === expectedSignature;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-lipana-signature");
    const payload = await req.text();

    console.log("Webhook received");
    console.log("Signature:", signature);
    console.log("Payload:", payload);

    // Verify webhook signature
    const webhookSecret = Deno.env.get("LIPANA_WEBHOOK_SECRET");
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    const data = JSON.parse(payload);
    const { event, data: eventData } = data;

    console.log("Event:", event);
    console.log("Event data:", eventData);

    // Initialize Supabase client with service role for webhook
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find payment by transaction ID
    const { data: payment, error: findError } = await supabaseClient
      .from("payments")
      .select("*, orders(*)")
      .eq("transaction_id", eventData.transactionId)
      .single();

    if (findError || !payment) {
      console.error("Payment not found:", findError);
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update payment status based on event
    let paymentStatus = "pending";
    let orderStatus = payment.orders.status;

    if (event === "payment.success" || event === "transaction.success") {
      paymentStatus = "success";
      orderStatus = "processing";
    } else if (
      event === "payment.failed" ||
      event === "transaction.failed"
    ) {
      paymentStatus = "failed";
    } else if (
      event === "payment.cancelled" ||
      event === "transaction.cancelled"
    ) {
      paymentStatus = "failed";
    }

    // Update payment
    const { error: updatePaymentError } = await supabaseClient
      .from("payments")
      .update({
        status: paymentStatus,
        mpesa_receipt_number: eventData.mpesaReceiptNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      console.error("Error updating payment:", updatePaymentError);
      throw updatePaymentError;
    }

    // Update order status if payment successful
    if (paymentStatus === "success") {
      const { error: updateOrderError } = await supabaseClient
        .from("orders")
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.order_id);

      if (updateOrderError) {
        console.error("Error updating order:", updateOrderError);
        throw updateOrderError;
      }
    }

    console.log("Payment and order updated successfully");

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in payment-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
