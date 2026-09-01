import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();

    // Test route: skip DB insert, fire a raw Mailgun test email, return full response
    if (body.test === true) {
      const mailgunKey = Deno.env.get("MAILGUN_API_KEY");
      if (!mailgunKey) {
        return json({ ok: false, error: "MAILGUN_API_KEY not set" }, 500);
      }
      const formData = new FormData();
      formData.append("from", "NexFrontier Website <noreply@nexfrontierlogic.nz>");
      formData.append("to", "sukesh@nexfrontierlogic.nz");
      formData.append("subject", "Mailgun Test");
      formData.append("text", "This is a test email.");
      const credentials = btoa(`api:${mailgunKey}`);
      const mgRes = await fetch("https://api.mailgun.net/v3/nexfrontierlogic.nz/messages", {
        method: "POST",
        headers: { Authorization: `Basic ${credentials}` },
        body: formData,
      });
      const mgBody = await mgRes.text();
      console.log("Mailgun test response:", mgRes.status, mgBody);
      return json({ ok: mgRes.ok, mailgun_status: mgRes.status, mailgun_body: mgBody });
    }

    const { name, email, company, message, formSource } = body;

    if (!name || !email || !message || !formSource) {
      return json({ error: "Missing required fields: name, email, message, formSource" }, 400);
    }

    // Always persist to DB first so no submission is lost
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      company: company || null,
      message,
      form_source: formSource,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    // Attempt Mailgun — if key is absent, log and return success anyway
    const mailgunKey = Deno.env.get("MAILGUN_API_KEY");
    if (!mailgunKey) {
      console.warn("MAILGUN_API_KEY not set — submission saved to DB only");
      return json({ ok: true, email_sent: false });
    }

    const labelMap: Record<string, string> = {
      "early-access": "Early Access Enquiry",
      "beta-programme": "BETA Programme Application",
      "ql-report": "QL Report Request",
    };
    const label = labelMap[formSource] ?? formSource;
    const subject = `${label} — ${name}${company ? ` (${company})` : ""}`;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
        <div style="margin-bottom:24px">
          <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">NexFrontier · ${label}</span>
        </div>
        <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 24px">${label}</h1>
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:16px 20px;margin:0 0 28px">
          <table style="width:100%;font-size:13px;border-collapse:collapse">
            <tr><td style="color:#64748b;padding:5px 0;width:30%">Name</td><td style="color:#e2e8f0">${name}</td></tr>
            <tr><td style="color:#64748b;padding:5px 0">Email</td><td style="color:#e2e8f0">${email}</td></tr>
            ${company ? `<tr><td style="color:#64748b;padding:5px 0">Company</td><td style="color:#e2e8f0">${company}</td></tr>` : ""}
            <tr><td style="color:#64748b;padding:5px 0">Form</td><td style="color:#22d3ee">${label}</td></tr>
          </table>
        </div>
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:16px 20px;margin:0 0 28px">
          <p style="color:#22d3ee;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px">Message</p>
          <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${message}</p>
        </div>
        <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
        <p style="color:#475569;font-size:12px;margin:0">NexFrontier Logic Limited &middot; nexfrontierlogic.com</p>
      </div>
    `;

    const formData = new FormData();
    formData.append("from", "NexFrontier Website <noreply@nexfrontierlogic.nz>");
    formData.append("to", "sukesh@nexfrontierlogic.nz");
    formData.append("subject", subject);
    formData.append("html", html);
    formData.append("h:Reply-To", email);

    const credentials = btoa(`api:${mailgunKey}`);
    const mgRes = await fetch("https://api.mailgun.net/v3/nexfrontierlogic.nz/messages", {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
      body: formData,
    });

    const mgBody = await mgRes.text();
    console.log("Mailgun response:", mgRes.status, mgBody);

    if (!mgRes.ok) {
      console.error("Mailgun error:", mgRes.status, mgBody);
      // Submission is already in DB — return success so user isn't blocked
      return json({ ok: true, email_sent: false, mailgun_error: mgBody });
    }

    return json({ ok: true, email_sent: true });
  } catch (err) {
    console.error("send-email error:", err);
    return json({ error: String(err) }, 500);
  }
});
