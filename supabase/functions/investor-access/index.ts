import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const serviceClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

async function sendFirstLoginAlert(
  resendKey: string,
  alertEmail: string,
  investorName: string,
  investorEmail: string,
  appUrl: string,
) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
      <div style="margin-bottom:24px">
        <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">NexFrontier · Investor Alert</span>
      </div>
      <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 12px">Investor First Login</h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px">
        <strong style="color:#e2e8f0">${investorName}</strong> (${investorEmail}) has just accessed the data room for the first time.
      </p>
      <a href="${appUrl}/#/investor-data-room?admin=true" style="display:inline-block;background:#22d3ee;color:#0a0f1a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
        View Analytics →
      </a>
      <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
      <p style="color:#475569;font-size:12px;margin:0">NexFrontier · nexfrontierlogic.com</p>
    </div>
  `;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NexFrontier Alerts <sukesh@nexfrontierlogic.nz>",
      to: [alertEmail],
      subject: `🔔 ${investorName} just entered the data room`,
      html,
    }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/investor-access\/?/, "");
    const supabase = serviceClient();

    // ── GET /investor-access/validate?token=xxx ─────────────────────────────
    if (req.method === "GET" && path === "validate") {
      const token = url.searchParams.get("token");
      if (!token) return json({ error: "Missing token" }, 400);

      const { data, error } = await supabase
        .from("investor_access")
        .select("id, email, name, status, nda_signed, nda_signed_at, access_level, expires_at, login_count, first_seen_at, activated_at")
        .eq("token", token)
        .maybeSingle();

      if (error || !data) return json({ error: "Invalid access token" }, 403);
      if (data.status === "revoked") return json({ error: "Access has been revoked" }, 403);
      if (data.status === "pending") return json({ error: "Access pending approval" }, 403);
      // Only check expiry if the investor has never activated the token.
      // Once activated, access continues until explicitly revoked by admin.
      if (!data.activated_at && data.expires_at && new Date(data.expires_at) < new Date()) {
        return json({ error: "Access token has expired" }, 403);
      }

      const now = new Date().toISOString();
      const isFirstLogin = !data.first_seen_at;
      const isFirstActivation = !data.activated_at;

      await supabase
        .from("investor_access")
        .update({
          last_seen_at: now,
          login_count: (data.login_count ?? 0) + 1,
          first_seen_at: isFirstLogin ? now : data.first_seen_at,
          activated_at: isFirstActivation ? now : data.activated_at,
        })
        .eq("token", token);

      // Fire first-login alert email if enabled
      if (isFirstLogin) {
        const resendKey = Deno.env.get("RESEND_API_KEY");
        if (resendKey) {
          const { data: alertSetting } = await supabase
            .from("admin_settings")
            .select("value")
            .eq("key", "first_login_alert")
            .maybeSingle();

          const alertEnabled = alertSetting?.value?.enabled === true;
          const alertEmail = alertSetting?.value?.email ?? "sukesh@nexfrontierlogic.nz";

          if (alertEnabled) {
            const appUrl = Deno.env.get("APP_URL") || "https://nexfrontierlogic.com";
            EdgeRuntime.waitUntil(
              sendFirstLoginAlert(resendKey, alertEmail, data.name, data.email, appUrl)
            );
          }
        }
      }

      return json({ investor: data });
    }

    // ── POST /investor-access/nda ────────────────────────────────────────────
    if (req.method === "POST" && path === "nda") {
      const { token } = await req.json();
      if (!token) return json({ error: "Missing token" }, 400);

      const { data: inv } = await supabase
        .from("investor_access")
        .select("id, email, name, status")
        .eq("token", token)
        .maybeSingle();

      if (!inv || inv.status !== "approved") return json({ error: "Invalid or unapproved token" }, 403);

      const signedAt = new Date().toISOString();
      const { error } = await supabase
        .from("investor_access")
        .update({
          nda_signed: true,
          nda_signed_at: signedAt,
          access_level: 2,
          updated_at: signedAt,
        })
        .eq("token", token);

      if (error) return json({ error: error.message }, 500);

      const resendKey = Deno.env.get("RESEND_API_KEY");
      const appUrl = Deno.env.get("APP_URL") || "https://nexfrontierlogic.com";

      if (resendKey) {
        const signedAtFormatted = new Date(signedAt).toLocaleString("en-NZ", {
          timeZone: "Pacific/Auckland",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });

        const ndaClausesHtml = `
          <p style="font-size:11px;line-height:1.6;color:#64748b;margin:0 0 12px;font-style:italic">By accessing the NexFrontier Investor Data Room, you agreed to the following terms:</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">1. Confidential Information.</strong> All information made available through the NexFrontier Investor Data Room, including but not limited to financial information, forecasts, cap tables, shareholder agreements, customer information, product roadmaps, technical documentation, operational methodologies, intellectual property, commercial arrangements, strategic plans, and investment materials ("Confidential Information"), shall be treated as strictly confidential.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">2. Permitted Use.</strong> Confidential Information may only be used for the purpose of evaluating a potential investment, commercial relationship, partnership, or other authorised business opportunity with NexFrontier.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">3. Non-Disclosure.</strong> The Receiving Party shall not disclose, copy, reproduce, distribute, publish, or otherwise make available any Confidential Information to any third party without NexFrontier's prior written consent, except to professional advisers who are bound by equivalent confidentiality obligations.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">4. Intellectual Property.</strong> All Confidential Information remains the exclusive property of NexFrontier. Access to the Data Room does not grant any licence, ownership right, intellectual property right, or other interest in any NexFrontier technology, methodology, documentation, concepts, or business processes.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">5. Non-Circumvention.</strong> The Receiving Party shall not directly or indirectly circumvent NexFrontier in relation to any customer, partner, supplier, investor, advisor, opportunity, or commercial relationship identified through the Data Room.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">6. No Reverse Engineering.</strong> The Receiving Party shall not reverse engineer, decompile, disassemble, reproduce, derive, replicate, or otherwise attempt to recreate any NexFrontier methodology, framework, process, software, operational logic, product architecture, or intellectual property.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">7. Return or Destruction.</strong> Upon request by NexFrontier, the Receiving Party shall permanently delete, destroy, or return all Confidential Information in its possession, subject to legal or regulatory retention requirements.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">8. Term.</strong> These obligations shall remain in force for one (1) year from acceptance, or until the Confidential Information lawfully enters the public domain through no breach of this Agreement.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0 0 10px"><strong style="color:#e2e8f0">9. Remedies.</strong> The Receiving Party acknowledges that unauthorised disclosure or misuse of Confidential Information may cause irreparable harm. NexFrontier shall be entitled to seek injunctive relief, equitable remedies, damages, and any other remedies available under law.</p>
          <p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:0"><strong style="color:#e2e8f0">10. Governing Law.</strong> This Agreement shall be governed by the laws of New Zealand and the courts of New Zealand shall have exclusive jurisdiction.</p>
        `;

        // Email 1 — confirmation to investor with full NDA text and timestamped record
        const investorHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
            <div style="margin-bottom:32px">
              <span style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">NexFrontier</span>
            </div>
            <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 12px">NDA Signed — Your Record of Acceptance</h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px">
              Hi ${inv.name},<br><br>
              This email confirms that you have digitally signed the NexFrontier Mutual Non-Disclosure Agreement. Please retain this email as your permanent record.
            </p>
            <div style="background:#0f172a;border:1px solid #22d3ee33;border-radius:8px;padding:16px 20px;margin:0 0 28px">
              <p style="color:#22d3ee;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px">Acceptance Record</p>
              <table style="width:100%;font-size:13px;border-collapse:collapse">
                <tr><td style="color:#64748b;padding:3px 0;width:40%">Signatory</td><td style="color:#e2e8f0">${inv.name}</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">Email</td><td style="color:#e2e8f0">${inv.email}</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">Signed at</td><td style="color:#e2e8f0">${signedAtFormatted}</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">IP logged</td><td style="color:#e2e8f0">Yes — server-side</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">Agreement</td><td style="color:#e2e8f0">NexFrontier Mutual NDA v1.0</td></tr>
              </table>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:20px 20px;margin:0 0 28px">
              <p style="color:#22d3ee;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 14px">Agreement Text — MUTUAL NON-DISCLOSURE AGREEMENT</p>
              ${ndaClausesHtml}
            </div>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px">
              You now have full Level 2 access to the NexFrontier Investor Data Room.
            </p>
            <div style="margin-bottom:32px">
              <a href="${appUrl}/#/investor-data-room?token=${token}" style="display:inline-block;background:#22d3ee;color:#0a0f1a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
                Return to Data Room &rarr;
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
            <p style="color:#475569;font-size:12px;margin:0">NexFrontier Logic Limited &middot; Auckland, New Zealand &middot; sukesh@nexfrontierlogic.nz</p>
          </div>
        `;

        // Email 2 — admin notification
        const adminHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
            <div style="margin-bottom:24px">
              <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">NexFrontier · Investor Alert</span>
            </div>
            <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 12px">NDA Signed</h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px">
              <strong style="color:#e2e8f0">${inv.name}</strong> (${inv.email}) has just signed the NDA and now has full Level 2 access to the investor data room.
            </p>
            <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:16px 20px;margin:0 0 28px">
              <table style="width:100%;font-size:13px;border-collapse:collapse">
                <tr><td style="color:#64748b;padding:3px 0;width:40%">Name</td><td style="color:#e2e8f0">${inv.name}</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">Email</td><td style="color:#e2e8f0">${inv.email}</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">Signed at</td><td style="color:#e2e8f0">${signedAtFormatted}</td></tr>
                <tr><td style="color:#64748b;padding:3px 0">Access level</td><td style="color:#22d3ee;font-weight:600">Level 2 — Full Access</td></tr>
              </table>
            </div>
            <a href="${appUrl}/#/investor-data-room?admin=true" style="display:inline-block;background:#22d3ee;color:#0a0f1a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">
              View in Admin Panel &rarr;
            </a>
            <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
            <p style="color:#475569;font-size:12px;margin:0">NexFrontier &middot; nexfrontierlogic.com</p>
          </div>
        `;

        EdgeRuntime.waitUntil(Promise.all([
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "NexFrontier <sukesh@nexfrontierlogic.nz>",
              to: [inv.email],
              subject: "Your NDA is signed — NexFrontier Data Room confirmation",
              html: investorHtml,
            }),
          }),
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "NexFrontier Alerts <sukesh@nexfrontierlogic.nz>",
              to: ["sukesh@nexfrontierlogic.nz"],
              subject: `NDA Signed — ${inv.name} (${inv.email})`,
              html: adminHtml,
            }),
          }),
        ]));
      }

      return json({ ok: true });
    }

    // ── POST /investor-access/track ──────────────────────────────────────────
    if (req.method === "POST" && path === "track") {
      const body = await req.json();
      const { token, event_type, event_data, session_id, duration_seconds, user_agent } = body;
      if (!token || !event_type) return json({ error: "Missing fields" }, 400);

      const { data: inv } = await supabase
        .from("investor_access")
        .select("id, email, status")
        .eq("token", token)
        .maybeSingle();

      if (!inv || inv.status !== "approved") return json({ error: "Invalid token" }, 403);

      await supabase.from("data_room_activity").insert({
        investor_id: inv.id,
        investor_email: inv.email,
        event_type,
        event_data: event_data ?? {},
        session_id: session_id ?? null,
        duration_seconds: duration_seconds ?? null,
        user_agent: user_agent ?? "",
      });

      return json({ ok: true });
    }

    // ── POST /investor-access/otp/send ──────────────────────────────────────
    if (req.method === "POST" && path === "otp/send") {
      const { token } = await req.json();
      if (!token) return json({ error: "Missing token" }, 400);

      const { data: inv } = await supabase
        .from("investor_access")
        .select("id, email, name, status")
        .eq("token", token)
        .maybeSingle();

      if (!inv || inv.status !== "approved") return json({ error: "Invalid or unapproved token" }, 404);

      const otpCode = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const { error: insertErr } = await supabase.from("investor_otp").insert({
        investor_id: inv.id,
        otp_code: otpCode,
        expires_at: expiresAt,
      });
      if (insertErr) return json({ error: insertErr.message }, 500);

      const mailgunKey = Deno.env.get("MAILGUN_API_KEY");
      if (mailgunKey) {
        const formData = new FormData();
        formData.append("from", "NexFrontier <sukesh@nexfrontierlogic.nz>");
        formData.append("to", inv.email);
        formData.append("subject", "Your NexFrontier Access Code");
        formData.append("text", `Your NexFrontier access code is: ${otpCode}\n\nThis code expires in 5 minutes. Do not share it with anyone.`);

        const credentials = btoa(`api:${mailgunKey}`);
        await fetch("https://api.mailgun.net/v3/nexfrontierlogic.nz/messages", {
          method: "POST",
          headers: { Authorization: `Basic ${credentials}` },
          body: formData,
        });
      }

      return json({ sent: true });
    }

    // ── POST /investor-access/otp/send-by-email ──────────────────────────────
    if (req.method === "POST" && path === "otp/send-by-email") {
      const { email } = await req.json();
      if (!email?.trim()) return json({ sent: true }); // reveal nothing

      const { data: inv } = await supabase
        .from("investor_access")
        .select("id, email, name, status")
        .ilike("email", email.trim())
        .maybeSingle();

      // Always return { sent: true } — never reveal whether the email exists
      if (!inv || inv.status !== "approved") return json({ sent: true });

      const otpCode = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const { error: insertErr } = await supabase.from("investor_otp").insert({
        investor_id: inv.id,
        otp_code: otpCode,
        expires_at: expiresAt,
      });
      if (insertErr) return json({ error: insertErr.message }, 500);

      const mailgunKey = Deno.env.get("MAILGUN_API_KEY");
      if (mailgunKey) {
        const html = `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
            <div style="margin-bottom:28px">
              <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">NexFrontier</span>
            </div>
            <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 16px">Your Access Code</h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px">
              Hi ${inv.name},<br><br>
              Use the code below to access the NexFrontier Investor Data Room.
            </p>
            <div style="background:#0f172a;border:1px solid #22d3ee44;border-radius:10px;padding:24px;text-align:center;margin:0 0 28px">
              <p style="font-size:36px;font-weight:700;letter-spacing:0.18em;color:#22d3ee;margin:0;font-family:monospace">${otpCode}</p>
            </div>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
              This code expires in 5 minutes. Do not share it with anyone.
            </p>
            <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
            <p style="color:#475569;font-size:12px;margin:0">NexFrontier Logic Limited &middot; nexfrontierlogic.com</p>
          </div>
        `;

        const formData = new FormData();
        formData.append("from", "NexFrontier <noreply@nexfrontierlogic.nz>");
        formData.append("to", inv.email);
        formData.append("subject", "Your NexFrontier Access Code");
        formData.append("text", `Your NexFrontier access code is: ${otpCode}\n\nThis code expires in 5 minutes. Do not share it with anyone.`);
        formData.append("html", html);

        const credentials = btoa(`api:${mailgunKey}`);
        await fetch("https://api.mailgun.net/v3/nexfrontierlogic.nz/messages", {
          method: "POST",
          headers: { Authorization: `Basic ${credentials}` },
          body: formData,
        });
      }

      return json({ sent: true });
    }

    // ── POST /investor-access/otp/verify ─────────────────────────────────────
    if (req.method === "POST" && path === "otp/verify") {
      const { token, investor_id, otp_code } = await req.json();
      if ((!token && !investor_id) || !otp_code) return json({ error: "Missing token or investor_id, and otp_code" }, 400);

      let invQuery = supabase
        .from("investor_access")
        .select("id, email, name, status, nda_signed, nda_signed_at, access_level, expires_at, login_count, first_seen_at, activated_at");

      invQuery = token
        ? invQuery.eq("token", token)
        : invQuery.eq("id", investor_id);

      const { data: inv } = await invQuery.maybeSingle();

      if (!inv || inv.status !== "approved") return json({ error: "Invalid or unapproved token" }, 400);

      const { data: otpRow } = await supabase
        .from("investor_otp")
        .select("id")
        .eq("investor_id", inv.id)
        .eq("otp_code", String(otp_code))
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!otpRow) return json({ error: "Invalid or expired code" }, 400);

      await supabase.from("investor_otp").update({ used: true }).eq("id", otpRow.id);

      return json({ investor: inv });
    }

    // ── POST /investor-access/admin/auth ─────────────────────────────────────
    // Verifies email + passphrase and returns an admin-bypass token on success.
    if (req.method === "POST" && path === "admin/auth") {
      const { email, passphrase } = await req.json();
      if (!email?.trim() || !passphrase) return json({ error: "Email and passphrase are required" }, 400);

      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id, name, email, passphrase_hash")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (!adminRow) return json({ error: "Invalid credentials" }, 401);
      if (!adminRow.passphrase_hash) return json({ error: "No passphrase set for this account. Contact the system administrator." }, 401);

      const match = await bcrypt.compare(passphrase, adminRow.passphrase_hash);
      if (!match) return json({ error: "Invalid credentials" }, 401);

      return json({
        token: `admin-bypass-${adminRow.id}`,
        admin: { id: adminRow.id, name: adminRow.name, email: adminRow.email },
      });
    }

    // ── GET /investor-access/admin/admins (public — management panel display) ─
    // Returns only id + name — no email, no hash — for display in the admin panel.
    if (req.method === "GET" && path === "admin/admins") {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, name, created_at")
        .order("created_at");
      if (error) return json({ error: error.message }, 500);
      return json({ admins: data });
    }

    // ── GET /investor-access/admin/brief-requests (no key — used by InvestorMgmt panel) ──
    if (req.method === "GET" && path === "admin/brief-requests") {
      const svc = serviceClient();
      const { data, error } = await svc
        .from("investor_brief_requests")
        .select("id, name, email, organisation, phone, referral_source, created_at, invited_at, dismissed_at, investor_id")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ requests: data });
    }

    // ── GET /investor-access/admin/list (no key — used by InvestorMgmt panel) ─
    if (req.method === "GET" && path === "admin/list") {
      const { data, error } = await supabase
        .from("investor_access")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ investors: data });
    }

    // ── Admin routes: authenticate via admin-bypass token in Authorization header ──
    const authHeader = req.headers.get("Authorization") ?? "";
    const bearerToken = authHeader.replace(/^Bearer\s+/i, "");
    const isAdminToken = bearerToken.startsWith("admin-bypass-");
    if (isAdminToken) {
      // Verify the embedded admin ID exists in the admin_users table
      const adminId = bearerToken.replace(/^admin-bypass-/i, "");
      const { data: adminRow, error: adminErr } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", adminId)
        .maybeSingle();
      if (adminErr || !adminRow) {
        return json({ error: "Unauthorized" }, 401);
      }
    } else {
      // Legacy X-Admin-Key fallback
      const adminKey = req.headers.get("X-Admin-Key");
      const expectedKey = Deno.env.get("ADMIN_SECRET_KEY");
      if (expectedKey && adminKey !== expectedKey) {
        return json({ error: "Unauthorized" }, 401);
      }
      if (!expectedKey) {
        return json({ error: "Unauthorized" }, 401);
      }
    }

    // ── GET /investor-access/admin/activity?investor_id=xxx ─────────────────
    if (req.method === "GET" && path === "admin/activity") {
      const investorId = url.searchParams.get("investor_id");
      let query = supabase
        .from("data_room_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (investorId) query = query.eq("investor_id", investorId);

      const { data, error } = await query;
      if (error) return json({ error: error.message }, 500);
      return json({ activity: data });
    }

    // ── GET /investor-access/admin/analytics ────────────────────────────────
    if (req.method === "GET" && path === "admin/analytics") {
      const days = parseInt(url.searchParams.get("days") ?? "30");
      const since = new Date(Date.now() - days * 86400000).toISOString();

      const { data: activity } = await supabase
        .from("data_room_activity")
        .select("investor_id, investor_email, event_type, event_data, session_id, duration_seconds, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: true });

      const events = activity ?? [];

      const { data: investors } = await supabase
        .from("investor_access")
        .select("id, email, name, status, nda_signed, access_level, last_seen_at, created_at, login_count, first_seen_at");

      const allInvestors = investors ?? [];

      // Doc analytics
      const docViewCounts: Record<string, number> = {};
      const docDownloadCounts: Record<string, number> = {};
      const docDurationTotals: Record<string, number> = {};
      const docDurationCounts: Record<string, number> = {};
      const docUniqueViewers: Record<string, Set<string>> = {};

      // Folder completion per investor
      const folderDocsByInvestor: Record<string, Record<string, Set<string>>> = {};

      // Investor-level stats
      const sessionsByInvestor: Record<string, Set<string>> = {};
      const durationByInvestor: Record<string, number> = {};
      const viewsByInvestor: Record<string, number> = {};
      const downloadsByInvestor: Record<string, number> = {};
      const foldersByInvestor: Record<string, Set<string>> = {};
      const lastEventByInvestor: Record<string, string> = {};

      for (const ev of events) {
        const iid = ev.investor_id;
        const evData = (ev.event_data ?? {}) as Record<string, string>;

        if (ev.event_type === "doc_viewed") {
          const name = evData?.doc ?? "Unknown";
          const folder = evData?.folder;
          docViewCounts[name] = (docViewCounts[name] ?? 0) + 1;
          if (iid) {
            if (!docUniqueViewers[name]) docUniqueViewers[name] = new Set();
            docUniqueViewers[name].add(iid);
          }
          if (iid && folder) {
            if (!folderDocsByInvestor[iid]) folderDocsByInvestor[iid] = {};
            if (!folderDocsByInvestor[iid][folder]) folderDocsByInvestor[iid][folder] = new Set();
            folderDocsByInvestor[iid][folder].add(name);
          }
        }
        if (ev.event_type === "doc_downloaded") {
          const name = evData?.doc ?? "Unknown";
          docDownloadCounts[name] = (docDownloadCounts[name] ?? 0) + 1;
        }
        if (ev.event_type === "doc_exit" && ev.duration_seconds) {
          const name = evData?.doc ?? "Unknown";
          docDurationTotals[name] = (docDurationTotals[name] ?? 0) + ev.duration_seconds;
          docDurationCounts[name] = (docDurationCounts[name] ?? 0) + 1;
        }

        if (!iid) continue;

        if (ev.session_id) {
          if (!sessionsByInvestor[iid]) sessionsByInvestor[iid] = new Set();
          sessionsByInvestor[iid].add(ev.session_id);
        }
        if (ev.event_type === "session_end" && ev.duration_seconds) {
          durationByInvestor[iid] = (durationByInvestor[iid] ?? 0) + ev.duration_seconds;
        }
        if (ev.event_type === "doc_viewed") {
          viewsByInvestor[iid] = (viewsByInvestor[iid] ?? 0) + 1;
          const folder = evData?.folder;
          if (folder) {
            if (!foldersByInvestor[iid]) foldersByInvestor[iid] = new Set();
            foldersByInvestor[iid].add(folder);
          }
        }
        if (ev.event_type === "doc_downloaded") {
          downloadsByInvestor[iid] = (downloadsByInvestor[iid] ?? 0) + 1;
        }
        // Track most recent event type per investor (for last action label)
        lastEventByInvestor[iid] = ev.event_type;
      }

      // Top docs
      const allDocNames = new Set([...Object.keys(docViewCounts), ...Object.keys(docDownloadCounts)]);
      const topDocs = Array.from(allDocNames)
        .map((name) => ({
          name,
          views: docViewCounts[name] ?? 0,
          downloads: docDownloadCounts[name] ?? 0,
          unique_viewers: docUniqueViewers[name]?.size ?? 0,
          avg_duration_seconds: docDurationCounts[name]
            ? Math.round(docDurationTotals[name] / docDurationCounts[name])
            : null,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 20);

      // All known doc names across all folders (from event data)
      const allKnownDocs = new Set(Array.from(allDocNames));

      // Unopened docs: docs that have no views at all — we derive from the known set vs viewed set
      const viewedDocNames = new Set(Object.keys(docViewCounts));
      const unopenedDocs = Array.from(allKnownDocs).filter((d) => !viewedDocNames.has(d));

      // Daily view counts
      const dailyCounts: Record<string, number> = {};
      for (let i = 0; i < days; i++) {
        const d = new Date(Date.now() - i * 86400000);
        dailyCounts[d.toISOString().slice(0, 10)] = 0;
      }
      for (const ev of events) {
        if (ev.event_type === "doc_viewed") {
          const key = ev.created_at.slice(0, 10);
          if (key in dailyCounts) dailyCounts[key] = (dailyCounts[key] ?? 0) + 1;
        }
      }
      const dailyViews = Object.entries(dailyCounts)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Investor stats with folder completion
      const folderKeys = ["legal", "financials", "tech", "traction"];
      const investorStats = allInvestors
        .filter((i) => i.status === "approved")
        .map((inv) => {
          const foldersCompleted = folderKeys.map((fk) => ({
            folder: fk,
            docs_viewed: folderDocsByInvestor[inv.id]?.[fk]?.size ?? 0,
          }));
          return {
            id: inv.id,
            email: inv.email,
            name: inv.name,
            nda_signed: inv.nda_signed,
            access_level: inv.access_level,
            last_seen_at: inv.last_seen_at,
            first_seen_at: inv.first_seen_at,
            created_at: inv.created_at,
            login_count: inv.login_count ?? 0,
            session_count: sessionsByInvestor[inv.id]?.size ?? 0,
            total_duration_seconds: durationByInvestor[inv.id] ?? 0,
            doc_views: viewsByInvestor[inv.id] ?? 0,
            doc_downloads: downloadsByInvestor[inv.id] ?? 0,
            folders_accessed: foldersByInvestor[inv.id]?.size ?? 0,
            folder_completion: foldersCompleted,
            last_action: lastEventByInvestor[inv.id] ?? null,
          };
        })
        .sort((a, b) => b.doc_views - a.doc_views);

      // Summary totals
      const totalDocViews = events.filter((e) => e.event_type === "doc_viewed").length;
      const totalDocDownloads = events.filter((e) => e.event_type === "doc_downloaded").length;
      const totalSessions = new Set(events.filter((e) => e.session_id).map((e) => e.session_id)).size;
      const uniqueInvestorIds = new Set(events.map((e) => e.investor_id).filter(Boolean)).size;
      const allDurations = events
        .filter((e) => e.event_type === "session_end" && e.duration_seconds)
        .map((e) => e.duration_seconds as number);
      const avgSessionSeconds = allDurations.length
        ? Math.round(allDurations.reduce((a, b) => a + b, 0) / allDurations.length)
        : null;

      return json({
        summary: {
          total_doc_views: totalDocViews,
          total_doc_downloads: totalDocDownloads,
          total_sessions: totalSessions,
          unique_investors: uniqueInvestorIds,
          avg_session_seconds: avgSessionSeconds,
          days,
        },
        top_docs: topDocs,
        unopened_docs: unopenedDocs,
        daily_views: dailyViews,
        investor_stats: investorStats,
      });
    }

    // ── GET /investor-access/admin/investor-timeline?investor_id=xxx ─────────
    if (req.method === "GET" && path === "admin/investor-timeline") {
      const investorId = url.searchParams.get("investor_id");
      if (!investorId) return json({ error: "investor_id required" }, 400);

      const { data, error } = await supabase
        .from("data_room_activity")
        .select("*")
        .eq("investor_id", investorId)
        .order("created_at", { ascending: true });

      if (error) return json({ error: error.message }, 500);

      const sessions: Record<string, typeof data> = {};
      for (const ev of data ?? []) {
        const sid = ev.session_id ?? "no-session";
        if (!sessions[sid]) sessions[sid] = [];
        sessions[sid].push(ev);
      }

      return json({ events: data, sessions });
    }

    // ── GET /investor-access/admin/settings ──────────────────────────────────
    if (req.method === "GET" && path === "admin/settings") {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("key, value, updated_at");
      if (error) return json({ error: error.message }, 500);
      const settings: Record<string, unknown> = {};
      for (const row of data ?? []) settings[row.key] = row.value;
      return json({ settings });
    }

    // ── POST /investor-access/admin/settings ─────────────────────────────────
    if (req.method === "POST" && path === "admin/settings") {
      const { key, value } = await req.json();
      if (!key) return json({ error: "key required" }, 400);
      const { error } = await supabase
        .from("admin_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── POST /investor-access/admin/create ───────────────────────────────────
    if (req.method === "POST" && path === "admin/create") {
      const { email, name, notes } = await req.json();
      if (!email) return json({ error: "Email required" }, 400);

      const { data, error } = await supabase
        .from("investor_access")
        .insert({ email: email.trim().toLowerCase(), name: name?.trim() ?? "", notes: notes ?? "" })
        .select()
        .single();

      if (error) return json({ error: error.message }, 500);
      return json({ investor: data });
    }

    // ── POST /investor-access/admin/invite ───────────────────────────────────
    if (req.method === "POST" && path === "admin/invite") {
      const { email, name, notes, organisation, phone, referral_source } = await req.json();
      if (!email || !name) return json({ error: "Email and name are required" }, 400);

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      const { data: existing } = await supabase
        .from("investor_access")
        .select("id, status, token")
        .eq("email", cleanEmail)
        .maybeSingle();

      let investor = existing;

      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      if (!existing) {
        const { data: created, error: createErr } = await supabase
          .from("investor_access")
          .insert({ email: cleanEmail, name: cleanName, notes: notes ?? "", status: "approved", expires_at: expiresAt })
          .select()
          .single();
        if (createErr) return json({ error: createErr.message }, 500);
        investor = created;
      } else if (existing.status !== "approved") {
        const { data: updated, error: upErr } = await supabase
          .from("investor_access")
          .update({ status: "approved", name: cleanName, expires_at: expiresAt, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();
        if (upErr) return json({ error: upErr.message }, 500);
        investor = updated;
      } else {
        // Already approved — refresh the expiry window
        const { data: refreshed, error: refErr } = await supabase
          .from("investor_access")
          .update({ expires_at: expiresAt, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();
        if (refErr) return json({ error: refErr.message }, 500);
        investor = refreshed;
      }

      if (!investor) return json({ error: "Failed to create investor record" }, 500);

      // Mark matching brief request as invited, or create one if this came via direct invite
      const { data: existingBrief } = await supabase
        .from("investor_brief_requests")
        .select("id, invited_at")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (existingBrief) {
        await supabase
          .from("investor_brief_requests")
          .update({ invited_at: new Date().toISOString(), investor_id: investor.id })
          .eq("id", existingBrief.id)
          .is("invited_at", null);
      } else {
        // Direct invite — create a brief request record so the pipeline log stays complete
        await supabase
          .from("investor_brief_requests")
          .insert({
            name: cleanName,
            email: cleanEmail,
            organisation: organisation?.trim() || null,
            phone: phone?.trim() || null,
            referral_source: referral_source?.trim() || null,
            investor_id: investor.id,
            invited_at: new Date().toISOString(),
          });
      }

      const mailgunKey = Deno.env.get("MAILGUN_API_KEY");
      const accessUrl = `https://nexfrontierlogic.nz/#/investor-data-room?token=${investor.token}`;

      if (mailgunKey) {
        const html = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
            <div style="margin-bottom:32px">
              <span style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">NexFrontier</span>
            </div>
            <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 12px">You've been granted access to the Investor Data Room</h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px">
              Hi ${cleanName},<br><br>
              Sukesh has personally invited you to access the NexFrontier confidential investor data room.
              Inside you'll find our investor overview, market and competitive analysis, product and proof pathway, Beta commercialisation plan, revenue model, financial forecast, valuation and deal structure, risk framework, founding team profile, and closing investment case.
            </p>
            <div style="background:#0f172a;border:1px solid #1e3a4a;border-radius:8px;padding:16px 20px;margin:0 0 28px">
              <p style="color:#f59e0b;font-size:13px;font-weight:600;margin:0 0 6px;letter-spacing:0.02em">&#9200; Action required within 48 hours</p>
              <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0">
                Your access link expires 48 hours from when this email was sent. Please activate it before then.
                If it expires before you use it, please submit a new access request either via our website, or email Sukesh.
              </p>
            </div>
            <div style="margin-bottom:32px">
              <a href="${accessUrl}" style="display:inline-block;background:#22d3ee;color:#0a0f1a;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none">
                Access the Data Room &rarr;
              </a>
            </div>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 8px">
              This link is personal and confidential. Do not share it. Your access is logged.
            </p>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
              If you didn't expect this email, you can safely ignore it or reply to let us know.
            </p>
            <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
            <p style="color:#475569;font-size:12px;margin:0">NexFrontier &middot; Auckland, New Zealand &middot; sukesh@nexfrontierlogic.nz</p>
          </div>
        `;

        const formData = new FormData();
        formData.append("from", "Sukesh at NexFrontier <sukesh@nexfrontierlogic.nz>");
        formData.append("to", cleanEmail);
        formData.append("subject", "Your NexFrontier Investor Data Room Access");
        formData.append("html", html);

        const credentials = btoa(`api:${mailgunKey}`);
        const emailRes = await fetch("https://api.mailgun.net/v3/nexfrontierlogic.nz/messages", {
          method: "POST",
          headers: { Authorization: `Basic ${credentials}` },
          body: formData,
        });
        if (!emailRes.ok) {
          const errBody = await emailRes.text();
          return json({ error: `Email failed: ${errBody}`, investor }, 500);
        }
      }

      return json({ investor, email_sent: !!mailgunKey });
    }

    // ── POST /investor-access/admin/approve ──────────────────────────────────
    if (req.method === "POST" && path === "admin/approve") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { data, error } = await supabase
        .from("investor_access")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ investor: data });
    }

    // ── POST /investor-access/admin/revoke ───────────────────────────────────
    if (req.method === "POST" && path === "admin/revoke") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { data, error } = await supabase
        .from("investor_access")
        .update({ status: "revoked", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ investor: data });
    }

    // ── POST /investor-access/admin/update ───────────────────────────────────
    if (req.method === "POST" && path === "admin/update") {
      const { id, access_level, nda_signed } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (access_level !== undefined) patch.access_level = access_level;
      if (nda_signed !== undefined) {
        patch.nda_signed = nda_signed;
        patch.nda_signed_at = nda_signed ? new Date().toISOString() : null;
        if (access_level === undefined) patch.access_level = nda_signed ? 2 : 1;
      }
      const { data, error } = await supabase
        .from("investor_access")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ investor: data });
    }

    // ── DELETE /investor-access/admin/delete ─────────────────────────────────
    if (req.method === "DELETE" && path === "admin/delete") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { error } = await supabase.from("investor_access").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }


    // ── GET /investor-access/admin/admins (authenticated — full details) ──────
    if (req.method === "GET" && path === "admin/admins") {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, name, email, created_at")
        .order("created_at");
      if (error) return json({ error: error.message }, 500);
      return json({ admins: data });
    }

    // ── POST /investor-access/admin/admins ───────────────────────────────────
    if (req.method === "POST" && path === "admin/admins") {
      const { name, email, passphrase } = await req.json();
      if (!name?.trim() || !email?.trim()) return json({ error: "Name and email are required" }, 400);
      if (!passphrase?.trim()) return json({ error: "Passphrase is required" }, 400);
      if (passphrase.trim().length < 10) return json({ error: "Passphrase must be at least 10 characters" }, 400);
      const passphrase_hash = await bcrypt.hash(passphrase.trim(), 12);
      const { data, error } = await supabase
        .from("admin_users")
        .insert({ name: name.trim(), email: email.trim().toLowerCase(), passphrase_hash })
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ admin: data });
    }

    // ── POST /investor-access/admin/admins/set-passphrase ────────────────────
    if (req.method === "POST" && path === "admin/admins/set-passphrase") {
      const { admin_id, passphrase } = await req.json();
      if (!admin_id || !passphrase?.trim()) return json({ error: "admin_id and passphrase are required" }, 400);
      if (passphrase.trim().length < 10) return json({ error: "Passphrase must be at least 10 characters" }, 400);
      const hash = await bcrypt.hash(passphrase.trim(), 12);
      const { error } = await supabase
        .from("admin_users")
        .update({ passphrase_hash: hash })
        .eq("id", admin_id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── DELETE /investor-access/admin/admins ─────────────────────────────────
    if (req.method === "DELETE" && path === "admin/admins") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { error } = await supabase.from("admin_users").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── GET /investor-access/admin/docs ──────────────────────────────────────
    if (req.method === "GET" && path === "admin/docs") {
      const { data, error } = await supabase
        .from("investor_docs")
        .select("*")
        .order("folder")
        .order("sort_order");
      if (error) return json({ error: error.message }, 500);
      return json({ docs: data });
    }

    // ── POST /investor-access/admin/docs ─────────────────────────────────────
    if (req.method === "POST" && path === "admin/docs") {
      const body = await req.json();
      const { doc_key, folder, name, locked, sort_order } = body;
      if (!doc_key || !folder || !name) return json({ error: "doc_key, folder, and name are required" }, 400);
      const { data, error } = await supabase
        .from("investor_docs")
        .insert({ doc_key, folder, name, locked: locked ?? false, sort_order: sort_order ?? 0 })
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ doc: data });
    }

    // ── PUT /investor-access/admin/docs ──────────────────────────────────────
    if (req.method === "PUT" && path === "admin/docs") {
      const body = await req.json();
      const { id, doc_key, ...patch } = body;
      if (!id && !doc_key) return json({ error: "id or doc_key required" }, 400);
      const updated = { ...patch, updated_at: new Date().toISOString() };
      const query = id
        ? supabase.from("investor_docs").update(updated).eq("id", id)
        : supabase.from("investor_docs").update(updated).eq("doc_key", doc_key);
      const { error } = await query;
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── GET /investor-access/admin/folder-labels ─────────────────────────────
    if (req.method === "GET" && path === "admin/folder-labels") {
      const { data, error } = await supabase.from("folder_labels").select("folder_key, label").order("folder_key");
      if (error) return json({ error: error.message }, 500);
      return json({ labels: data });
    }

    // ── PUT /investor-access/admin/folder-labels ─────────────────────────────
    if (req.method === "PUT" && path === "admin/folder-labels") {
      const { folder_key, label } = await req.json();
      if (!folder_key || !label?.trim()) return json({ error: "folder_key and label are required" }, 400);
      const { error } = await supabase
        .from("folder_labels")
        .upsert({ folder_key, label: label.trim(), updated_at: new Date().toISOString() }, { onConflict: "folder_key" });
      if (error) return json({ error: error.message }, 500);
      // Also update custom_folders table if this key is a custom folder
      await supabase
        .from("custom_folders")
        .update({ label: label.trim(), updated_at: new Date().toISOString() })
        .eq("folder_key", folder_key);
      return json({ ok: true });
    }

    // ── PATCH /investor-access/admin/folder-color ────────────────────────────
    if (req.method === "PATCH" && path === "admin/folder-color") {
      const { folder_key, color_class } = await req.json();
      if (!folder_key || !color_class?.trim()) return json({ error: "folder_key and color_class are required" }, 400);
      // Update custom_folders if it exists there, otherwise upsert into folder_labels
      const { data: custom } = await supabase
        .from("custom_folders")
        .select("folder_key")
        .eq("folder_key", folder_key)
        .maybeSingle();
      if (custom) {
        const { error } = await supabase
          .from("custom_folders")
          .update({ color_class: color_class.trim(), updated_at: new Date().toISOString() })
          .eq("folder_key", folder_key);
        if (error) return json({ error: error.message }, 500);
      } else {
        const { error } = await supabase
          .from("folder_labels")
          .update({ color_class: color_class.trim(), updated_at: new Date().toISOString() })
          .eq("folder_key", folder_key);
        if (error) return json({ error: error.message }, 500);
      }
      return json({ ok: true });
    }

    // ── GET /investor-access/admin/folders ───────────────────────────────────
    if (req.method === "GET" && path === "admin/folders") {
      const { data, error } = await supabase
        .from("custom_folders")
        .select("id, folder_key, label, color_class, sort_order, created_at")
        .order("sort_order");
      if (error) return json({ error: error.message }, 500);
      return json({ folders: data });
    }

    // ── POST /investor-access/admin/folders ──────────────────────────────────
    if (req.method === "POST" && path === "admin/folders") {
      const { label, color_class } = await req.json();
      if (!label?.trim()) return json({ error: "label is required" }, 400);
      // Generate a slug from the label
      const folder_key = "custom_" + label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") + "_" + Date.now();
      const { data: maxRow } = await supabase
        .from("custom_folders")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const sort_order = (maxRow?.sort_order ?? -1) + 1;
      const { data, error } = await supabase
        .from("custom_folders")
        .insert({ folder_key, label: label.trim(), color_class: color_class ?? "text-violet-400", sort_order })
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ folder: data });
    }

    // ── DELETE /investor-access/admin/folders ────────────────────────────────
    if (req.method === "DELETE" && path === "admin/folders") {
      const { folder_key } = await req.json();
      if (!folder_key) return json({ error: "folder_key required" }, 400);
      // Delete all docs in this folder first
      await supabase.from("investor_docs").delete().eq("folder", folder_key);
      const { error } = await supabase.from("custom_folders").delete().eq("folder_key", folder_key);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── DELETE /investor-access/admin/docs ───────────────────────────────────
    if (req.method === "DELETE" && path === "admin/docs") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { error } = await supabase.from("investor_docs").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── POST /investor-access/admin/brief-requests/dismiss ───────────────────
    if (req.method === "POST" && path === "admin/brief-requests/dismiss") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { error } = await supabase
        .from("investor_brief_requests")
        .update({ dismissed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ── DELETE /investor-access/admin/brief-requests ─────────────────────────
    if (req.method === "DELETE" && path === "admin/brief-requests") {
      const { id } = await req.json();
      if (!id) return json({ error: "ID required" }, 400);
      const { error } = await supabase
        .from("investor_brief_requests")
        .delete()
        .eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
