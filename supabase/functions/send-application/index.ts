import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, companyName, industry, name, role, email, phone, revenue } = body;

    // Save to DB
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("form_submissions").insert({
      action,
      company_name: companyName,
      industry,
      name,
      role,
      email,
      phone,
      revenue,
    });

    // Send email via Resend if API key is configured
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("NOTIFICATION_EMAIL") || "sukesh@nexfrontierlogic.nz";

    let resendResult: unknown = null;

    if (resendKey) {
      const subjectMap: Record<string, string> = {
        "beta": `New Beta Application: ${companyName}`,
        "email": `New QL Report Request: ${companyName}`,
        "investor-brief": `New Investor Brief Request: ${name}`,
      };
      const labelMap: Record<string, string> = {
        "beta": "Beta Application",
        "email": "QL Report Request",
        "investor-brief": "Investor Brief Request",
      };
      const subject = subjectMap[action] ?? `New Form Submission: ${action}`;

      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
          <h2 style="color:#0ea5e9">${labelMap[action] ?? action}</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;font-weight:600;width:160px">Company</td><td>${companyName}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Industry</td><td>${industry}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Name</td><td>${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Role</td><td>${role}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Email</td><td>${email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Phone</td><td>${phone}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Revenue</td><td>${revenue}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Form action</td><td>${action}</td></tr>
          </table>
        </div>
      `;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NexFrontier <onboarding@resend.dev>",
          to: [recipientEmail],
          subject,
          html,
        }),
      });
      resendResult = await resendRes.json().catch(() => ({}));
      console.log("Resend response:", resendRes.status, JSON.stringify(resendResult));
    }

    return new Response(JSON.stringify({ ok: true, resend: resendResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
