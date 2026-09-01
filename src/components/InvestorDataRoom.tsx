import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, BarChart2, Users, Lock, FileText, Eye,
  Clock, ShieldCheck, ChevronRight, X, Menu, ArrowLeft, TrendingUp,
  CheckCircle2, AlertCircle, File, Folder, PenLine, KeyRound, Loader2,
  ExternalLink, RefreshCw, Download, UserPlus, Send, Trash2, Mail, Plus, Archive,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface InvestorRecord {
  id: string;
  email: string;
  name: string;
  nda_signed: boolean;
  access_level: 1 | 2;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface InvestorDoc {
  id: string;
  doc_key: string;
  folder: string;
  name: string;
  drive_url: string;
  embed_url: string;
  locked: boolean;
  sort_order: number;
}

type NavSection = 'overview' | 'documents' | 'analytics' | 'team' | 'admins';
type FolderKey = 'legal' | 'financials' | 'tech' | 'traction' | string;

interface CustomFolder {
  id: string;
  folder_key: string;
  label: string;
  color_class: string;
  sort_order: number;
}

interface FolderMeta {
  label: string;
  color: string;
  isCustom?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/investor-access`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const STATIC_FOLDER_META: Record<string, FolderMeta> = {
  legal:      { label: 'Legal',      color: 'text-amber-400'   },
  financials: { label: 'Financials', color: 'text-emerald-400' },
  tech:       { label: 'Technology', color: 'text-sky-400'     },
  traction:   { label: 'Traction',   color: 'text-nex-cyan'    },
};

const COLOR_OPTIONS = [
  { label: 'Cyan',    value: 'text-cyan-400',    hex: '#22d3ee' },
  { label: 'Lime',    value: 'text-lime-400',    hex: '#a3e635' },
  { label: 'Amber',   value: 'text-amber-400',   hex: '#fbbf24' },
  { label: 'Orange',  value: 'text-orange-400',  hex: '#fb923c' },
  { label: 'Rose',    value: 'text-rose-400',    hex: '#fb7185' },
  { label: 'Sky',     value: 'text-sky-400',     hex: '#38bdf8' },
  { label: 'Purple',  value: 'text-purple-400',  hex: '#c084fc' },
  { label: 'Yellow',  value: 'text-yellow-300',  hex: '#fde047' },
];

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview',   label: 'Overview',        icon: LayoutDashboard },
  { id: 'documents',  label: 'Documents',        icon: FolderOpen      },
  { id: 'analytics',  label: 'Analytics',        icon: BarChart2       },
  { id: 'team',       label: 'Investor Mgmt',    icon: Users           },
  { id: 'admins',     label: 'Admin Access',     icon: ShieldCheck     },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Detect if a URL is a Google Docs/Sheets/Slides file (not a Drive PDF). */
function isGoogleDocsUrl(url: string): boolean {
  return /docs\.google\.com\/(document|spreadsheets|presentation)\/d\//.test(url);
}

/** Convert a Google Drive file URL to an embeddable preview URL (PDFs only). */
function toEmbedUrl(url: string): string {
  // Google Docs/Sheets/Slides cannot be reliably iframed — caller should use drive_url directly
  const fileM = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileM) return `https://drive.google.com/file/d/${fileM[1]}/preview`;
  return url;
}

/** Convert any Google Drive/Docs URL to a direct export/download URL. */
function toDownloadUrl(url: string): string | null {
  const docM = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docM) return `https://docs.google.com/document/d/${docM[1]}/export?format=pdf`;
  const sheetM = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetM) return `https://docs.google.com/spreadsheets/d/${sheetM[1]}/export?format=pdf`;
  const slideM = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slideM) return `https://docs.google.com/presentation/d/${slideM[1]}/export?format=pdf`;
  const fileM = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileM) return `https://drive.google.com/uc?export=download&id=${fileM[1]}`;
  return null;
}

/** Generate a stable session ID for this page load */
function newSessionId(): string {
  return crypto.randomUUID();
}

const SESSION_ID = newSessionId();

async function track(
  token: string,
  event_type: string,
  event_data: Record<string, unknown> = {},
  extras: { duration_seconds?: number } = {},
) {
  if (token.startsWith('admin-bypass-')) return;
  try {
    await fetch(`${FN_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
      body: JSON.stringify({
        token,
        event_type,
        event_data,
        session_id: SESSION_ID,
        duration_seconds: extras.duration_seconds ?? null,
        user_agent: navigator.userAgent,
      }),
    });
  } catch (_) { /* non-blocking */ }
}

// ─── Access Gate ─────────────────────────────────────────────────────────────

function AccessGate({ onAccess }: { onAccess: (investor: InvestorRecord, token: string) => void }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP step state
  const [otpStep, setOtpStep] = useState(false);
  const [validatedToken, setValidatedToken] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Return visitor (email-based) flow
  const [emailStep, setEmailStep] = useState(false);
  const [returnEmail, setReturnEmail] = useState('');
  const [returnEmailLoading, setReturnEmailLoading] = useState(false);
  const [returnEmailError, setReturnEmailError] = useState('');
  // investor_id returned from send-by-email (used in verify instead of token)
  const [otpInvestorId, setOtpInvestorId] = useState<string | null>(null);

  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassphrase, setAdminPassphrase] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const [hashQuery, setHashQuery] = useState(() =>
    window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''
  );
  const isAdminMode = new URLSearchParams(hashQuery).get('admin') === 'true';

  useEffect(() => {
    const onHashChange = () => {
      const q = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
      setHashQuery(q);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const sendOtp = useCallback(async (tok: string) => {
    const res = await fetch(`${FN_BASE}/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
      body: JSON.stringify({ token: tok }),
    });
    return res.ok;
  }, []);

  const validate = useCallback(async (tok: string) => {
    const t = tok.trim();
    if (!t) { setError('Please enter your access token.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${FN_BASE}/validate?token=${encodeURIComponent(t)}`, {
        headers: { Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Access denied.'); return; }
      // Token is valid — send OTP and move to second step
      const sent = await sendOtp(t);
      if (!sent) { setError('Could not send verification code. Please try again.'); return; }
      setValidatedToken(t);
      setOtpStep(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sendOtp]);

  const verifyOtp = useCallback(async () => {
    const code = otp.trim();
    if (code.length !== 6) { setOtpError('Enter the 6-digit code from your email.'); return; }
    setOtpLoading(true);
    setOtpError('');
    try {
      const body = otpInvestorId
        ? { investor_id: otpInvestorId, otp_code: code }
        : { token: validatedToken, otp_code: code };
      const res = await fetch(`${FN_BASE}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) { setOtpError(json.error ?? 'Invalid or expired code.'); return; }
      onAccess(json.investor, validatedToken);
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  }, [otp, validatedToken, otpInvestorId, onAccess]);

  const sendByEmail = useCallback(async () => {
    const email = returnEmail.trim();
    if (!email) { setReturnEmailError('Please enter your email address.'); return; }
    setReturnEmailLoading(true);
    setReturnEmailError('');
    try {
      const res = await fetch(`${FN_BASE}/otp/send-by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) { setReturnEmailError(json.error ?? 'Something went wrong. Please try again.'); return; }
      // Store investor_id if returned, fall back to null (server always returns { sent: true })
      setOtpInvestorId(json.investor_id ?? null);
      setEmailStep(false);
      setOtpStep(true);
    } catch {
      setReturnEmailError('Network error. Please try again.');
    } finally {
      setReturnEmailLoading(false);
    }
  }, [returnEmail]);

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setOtpError('');
    let sent = false;
    if (otpInvestorId) {
      try {
        const res = await fetch(`${FN_BASE}/otp/send-by-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
          body: JSON.stringify({ email: returnEmail.trim() }),
        });
        sent = res.ok;
      } catch { /* ignore */ }
    } else {
      sent = await sendOtp(validatedToken);
    }
    setResending(false);
    if (sent) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } else {
      setOtpError('Could not resend code. Please try again.');
    }
  };

  const adminLogin = useCallback(async () => {
    if (!adminEmail.trim() || !adminPassphrase) { setError('Enter your email and passphrase.'); return; }
    setAdminLoading(true);
    setError('');
    try {
      const res = await fetch(`${FN_BASE}/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
        body: JSON.stringify({ email: adminEmail.trim(), passphrase: adminPassphrase }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Authentication failed.'); return; }
      onAccess(
        { id: `admin-${json.admin.id}`, email: json.admin.email, name: json.admin.name, nda_signed: true, access_level: 2 },
        json.token,
      );
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setAdminLoading(false);
    }
  }, [adminEmail, adminPassphrase, onAccess]);

  useEffect(() => {
    const hq = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const urlToken = new URLSearchParams(hq).get('token');
    if (urlToken) { setToken(urlToken); validate(urlToken); }
  }, [validate]);

  return (
    <div className="min-h-screen bg-nex-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="flex items-center gap-1.5 font-inter text-nex-grey/60 text-sm hover:text-nex-cyan transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to NexFrontier
          </a>
          <span className="font-urbanist text-white font-bold text-lg">
            Nex<span className="text-nex-cyan">Frontier</span>
          </span>
        </div>

        <div className="bg-nex-darker border border-white/10 rounded-2xl p-8">

          {/* ── Email step (return visitor) ── */}
          {emailStep ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-nex-cyan/15 border border-nex-cyan/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-nex-cyan" />
                </div>
                <div>
                  <h1 className="font-urbanist text-white font-bold text-lg">Return visitor login</h1>
                  <p className="font-inter text-nex-grey text-xs">Enter your email to receive a one-time code</p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  value={returnEmail}
                  onChange={(e) => { setReturnEmail(e.target.value); setReturnEmailError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && sendByEmail()}
                  placeholder="you@company.com"
                  autoFocus
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-nex-dark border border-white/12 rounded-xl font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                />
                {returnEmailError && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="font-inter text-xs">{returnEmailError}</p>
                  </div>
                )}
                <button
                  onClick={sendByEmail}
                  disabled={returnEmailLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-nex-cyan text-nex-dark font-urbanist font-bold text-sm rounded-xl hover:shadow-glow-cyan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {returnEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {returnEmailLoading ? 'Sending...' : 'Send Code'}
                </button>
                <button
                  onClick={() => { setEmailStep(false); setReturnEmailError(''); }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 font-inter text-nex-grey/40 text-xs hover:text-nex-grey/70 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to token login
                </button>
              </div>
            </>
          ) : /* ── OTP Step ── */
          otpStep ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-nex-cyan/15 border border-nex-cyan/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-nex-cyan" />
                </div>
                <div>
                  <h1 className="font-urbanist text-white font-bold text-lg">Check your email</h1>
                  <p className="font-inter text-nex-grey text-xs">We sent a 6-digit code to your registered address</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-4 py-3 bg-nex-dark border border-white/12 rounded-xl font-mono text-center text-2xl tracking-widest text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                />

                {otpError && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="font-inter text-xs">{otpError}</p>
                  </div>
                )}

                {resendSuccess && (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/8 border border-emerald-400/20 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <p className="font-inter text-xs">New code sent. Check your email.</p>
                  </div>
                )}

                <button
                  onClick={verifyOtp}
                  disabled={otpLoading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-nex-cyan text-nex-dark font-urbanist font-bold text-sm rounded-xl hover:shadow-glow-cyan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {otpLoading ? 'Verifying...' : 'Confirm Code'}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setOtpStep(false);
                      setOtp('');
                      setOtpError('');
                      if (otpInvestorId) { setEmailStep(true); setOtpInvestorId(null); }
                    }}
                    className="font-inter text-nex-grey/50 text-xs hover:text-nex-grey transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    {otpInvestorId ? 'Change email' : 'Use different token'}
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="font-inter text-nex-cyan/70 text-xs hover:text-nex-cyan transition-colors flex items-center gap-1"
                  >
                    {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    {resending ? 'Sending...' : 'Resend code'}
                  </button>
                </div>
              </div>
            </>
          ) : isAdminMode ? (
            /* ── Admin login ── */
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-nex-cyan/15 border border-nex-cyan/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-nex-cyan" />
                </div>
                <div>
                  <h1 className="font-urbanist text-white font-bold text-lg">Admin Access</h1>
                  <p className="font-inter text-nex-grey text-xs">Enter your email and passphrase</p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => { setAdminEmail(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && adminLogin()}
                  placeholder="admin@company.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-nex-dark border border-white/12 rounded-xl font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                />
                <input
                  type="password"
                  value={adminPassphrase}
                  onChange={(e) => { setAdminPassphrase(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && adminLogin()}
                  placeholder="Passphrase"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-nex-dark border border-white/12 rounded-xl font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="font-inter text-xs">{error}</p>
                  </div>
                )}
                <button
                  onClick={adminLogin}
                  disabled={adminLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-nex-cyan text-nex-dark font-urbanist font-bold text-sm rounded-xl hover:shadow-glow-cyan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {adminLoading ? 'Verifying...' : 'Enter Admin Mode'}
                </button>
                <button
                  onClick={() => { window.location.hash = '/investor-data-room'; setError(''); }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 font-inter text-nex-grey/40 text-xs hover:text-nex-grey/70 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to investor login
                </button>
              </div>
            </>
          ) : (
            /* ── Token entry ── */
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-nex-cyan/15 border border-nex-cyan/30 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-nex-cyan" />
                </div>
                <div>
                  <h1 className="font-urbanist text-white font-bold text-lg">Secure Access</h1>
                  <p className="font-inter text-nex-grey text-xs">Enter the token from your invitation email</p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && validate(token)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-nex-dark border border-white/12 rounded-xl font-mono text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="font-inter text-xs">{error}</p>
                  </div>
                )}
                <button
                  onClick={() => validate(token)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-nex-cyan text-nex-dark font-urbanist font-bold text-sm rounded-xl hover:shadow-glow-cyan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
                <p className="font-inter text-nex-grey/60 text-xs text-center">
                  No token?{' '}
                  <a href="#investor-brief" className="text-nex-cyan hover:underline">Request investor access</a>
                </p>
                <button
                  onClick={() => { setEmailStep(true); setError(''); setReturnEmailError(''); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 font-inter text-nex-grey/60 text-xs hover:text-nex-cyan transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Return visitor login
                </button>
                <button
                  onClick={() => { window.location.hash = '/investor-data-room?admin=true'; }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-nex-dark border border-nex-cyan/20 rounded-xl font-inter text-nex-cyan/70 text-xs hover:border-nex-cyan/50 hover:text-nex-cyan transition-all duration-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Login
                </button>
              </div>
            </>
          )}
        </div>

        <p className="font-inter text-nex-grey/40 text-xs text-center mt-4">
          {otpStep ? 'Code expires in 5 minutes. Check your spam folder if not received.' : emailStep ? 'We will send a code if your email is registered.' : isAdminMode ? 'Internal use only.' : 'Access is logged and monitored. Confidential.'}
        </p>
      </motion.div>
    </div>
  );
}function NdaGateModal({
  investorEmail,
  onSign,
  onClose,
}: {
  investorEmail: string;
  onSign: () => void;
  onClose: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleSign = async () => {
    if (!agreed) return;
    setSigning(true);
    await new Promise((r) => setTimeout(r, 700));
    setSigning(false);
    onSign();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-lg bg-nex-darker border border-white/12 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-urbanist text-white font-bold text-base">Non-Disclosure Agreement</h2>
              <p className="font-inter text-nex-grey text-xs">Level 2 access, signature required</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-nex-grey hover:text-white hover:bg-white/8 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="h-72 overflow-y-auto rounded-xl bg-nex-dark/60 border border-white/8 p-4 mb-5 space-y-4">
            <p className="font-inter text-white font-semibold text-xs tracking-widest uppercase mb-1">Mutual Non-Disclosure Agreement</p>
            <p className="font-inter text-nex-grey text-xs leading-relaxed border-b border-white/6 pb-3">
              By accessing the NexFrontier Investor Data Room, you agree to the following terms:
            </p>
            {[
              ['1. Confidential Information', 'All information made available through the NexFrontier Investor Data Room, including but not limited to financial information, forecasts, cap tables, shareholder agreements, customer information, product roadmaps, technical documentation, operational methodologies, intellectual property, commercial arrangements, strategic plans, and investment materials ("Confidential Information"), shall be treated as strictly confidential.'],
              ['2. Permitted Use', 'Confidential Information may only be used for the purpose of evaluating a potential investment, commercial relationship, partnership, or other authorised business opportunity with NexFrontier.'],
              ['3. Non-Disclosure', "The Receiving Party shall not disclose, copy, reproduce, distribute, publish, or otherwise make available any Confidential Information to any third party without NexFrontier's prior written consent, except to professional advisers who are bound by equivalent confidentiality obligations."],
              ['4. Intellectual Property', 'All Confidential Information remains the exclusive property of NexFrontier. Access to the Data Room does not grant any licence, ownership right, intellectual property right, or other interest in any NexFrontier technology, methodology, documentation, concepts, or business processes.'],
              ['5. Non-Circumvention', 'The Receiving Party shall not directly or indirectly circumvent NexFrontier in relation to any customer, partner, supplier, investor, advisor, opportunity, or commercial relationship identified through the Data Room.'],
              ['6. No Reverse Engineering', 'The Receiving Party shall not reverse engineer, decompile, disassemble, reproduce, derive, replicate, or otherwise attempt to recreate any NexFrontier methodology, framework, process, software, operational logic, product architecture, or intellectual property.'],
              ['7. Return or Destruction', 'Upon request by NexFrontier, the Receiving Party shall permanently delete, destroy, or return all Confidential Information in its possession, subject to legal or regulatory retention requirements.'],
              ['8. Term', 'These obligations shall remain in force for one (1) year from acceptance, or until the Confidential Information lawfully enters the public domain through no breach of this Agreement.'],
              ['9. Remedies', 'The Receiving Party acknowledges that unauthorised disclosure or misuse of Confidential Information may cause irreparable harm. NexFrontier shall be entitled to seek injunctive relief, equitable remedies, damages, and any other remedies available under law.'],
              ['10. Governing Law', 'This Agreement shall be governed by the laws of New Zealand and the courts of New Zealand shall have exclusive jurisdiction.'],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-2.5">
                <span className="font-inter text-nex-cyan font-semibold text-xs mt-0.5 shrink-0 w-5 text-right leading-relaxed">{title.split('.')[0]}.</span>
                <p className="font-inter text-nex-grey text-xs leading-relaxed">
                  <span className="text-nex-text font-semibold">{title.replace(/^\d+\.\s*/, '')}. </span>{body}
                </p>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer group mb-5" onClick={() => setAgreed(!agreed)}>
            <div className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all duration-200 ${agreed ? 'bg-nex-cyan border-nex-cyan' : 'border-white/25 bg-white/5 group-hover:border-white/40'}`}>
              {agreed && <CheckCircle2 className="w-3.5 h-3.5 text-nex-dark" />}
            </div>
            <span className="font-inter text-nex-text text-sm leading-relaxed">
              I have read, understood, and agree to be bound by this NDA. I acknowledge that my identity ({investorEmail}) and this acceptance are permanently logged.
            </span>
          </label>

          <button
            onClick={handleSign}
            disabled={!agreed || signing}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-urbanist text-sm font-bold transition-all duration-300 ${agreed && !signing ? 'bg-nex-cyan text-nex-dark hover:shadow-glow-cyan-lg cursor-pointer' : 'bg-white/8 text-nex-grey/50 cursor-not-allowed'}`}
          >
            {signing ? <><Loader2 className="w-4 h-4 animate-spin" />Signing...</> : <><PenLine className="w-4 h-4" />Sign &amp; Enter</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Google Drive Document Viewer ─────────────────────────────────────────────

function DocumentViewer({
  doc,
  investorEmail,
  token,
  isAdmin,
  onClose,
}: {
  doc: InvestorDoc;
  investorEmail: string;
  token: string;
  isAdmin: boolean;
  onClose: () => void;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const openedAt = useRef(Date.now());
  const watermarkText = `CONFIDENTIAL: ${investorEmail}`;
  const hasUrl = doc.embed_url.length > 0;
  const downloadUrl = doc.drive_url ? toDownloadUrl(doc.drive_url) : null;
  const downloadBlocked = doc.locked && !isAdmin;
  const isGoogleDoc = doc.drive_url ? isGoogleDocsUrl(doc.drive_url) : false;

  const handleClose = () => {
    const duration = Math.round((Date.now() - openedAt.current) / 1000);
    track(token, 'doc_exit', { doc: doc.name, folder: doc.folder }, { duration_seconds: duration });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-nex-darker border border-white/12 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0 bg-nex-darker z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <File className="w-4 h-4 text-nex-cyan flex-shrink-0" />
            <span className="font-inter text-nex-text text-sm font-medium truncate">{doc.name}</span>
            <span className="font-inter text-xs text-nex-grey bg-white/6 px-2 py-0.5 rounded flex-shrink-0">{isGoogleDoc ? 'Google Doc' : 'PDF'}</span>
          </div>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            {isGoogleDoc ? (
              <a
                href={doc.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(token, 'doc_viewed', { doc: doc.name, folder: doc.folder })}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nex-cyan/12 border border-nex-cyan/30 text-nex-cyan text-xs font-medium hover:bg-nex-cyan/20 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open in Google Docs
              </a>
            ) : downloadUrl && !downloadBlocked ? (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(token, 'doc_downloaded', { doc: doc.name, folder: doc.folder })}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nex-cyan/12 border border-nex-cyan/30 text-nex-cyan text-xs font-medium hover:bg-nex-cyan/20 transition-colors"
              >
                <Download className="w-3 h-3" />
                Download PDF
              </a>
            ) : downloadBlocked ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/4 border border-white/10 text-nex-grey/50 text-xs cursor-default select-none">
                <Lock className="w-3 h-3" />
                Download restricted
              </div>
            ) : null}
            <button
              onClick={handleClose}
              className="p-1.5 text-nex-grey hover:text-white hover:bg-white/8 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewer body */}
        <div className="relative flex-1 overflow-hidden bg-[#1a1a1a]">
          {/* Diagonal watermark — sits above iframe */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="absolute whitespace-nowrap select-none"
                style={{
                  top: `${(i / 14) * 130 - 15}%`,
                  left: '-25%',
                  width: '150%',
                  transform: 'rotate(-35deg)',
                  transformOrigin: 'center center',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'rgba(255,255,255,0.045)',
                  textTransform: 'uppercase',
                  userSelect: 'none',
                }}
              >
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="mr-12">{watermarkText}</span>
                ))}
              </div>
            ))}
          </div>

          {/* Loading spinner — only for iframeable content */}
          {hasUrl && !isGoogleDoc && !iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-5">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-nex-cyan animate-spin mx-auto mb-3" />
                <p className="font-inter text-nex-grey text-sm">Loading document...</p>
              </div>
            </div>
          )}

          {isGoogleDoc ? (
            /* Google Docs/Sheets/Slides cannot be iframed — show open-in-app panel */
            <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-6">
              <div className="w-20 h-20 rounded-2xl bg-nex-cyan/10 border border-nex-cyan/25 flex items-center justify-center">
                <FileText className="w-10 h-10 text-nex-cyan" />
              </div>
              <div>
                <p className="font-urbanist text-white font-semibold text-xl mb-2">{doc.name}</p>
                <p className="font-inter text-nex-grey text-sm max-w-sm">
                  This document opens in Google Docs. Click below to view it in a new tab.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={doc.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(token, 'doc_viewed', { doc: doc.name, folder: doc.folder })}
                  className="flex items-center gap-2 px-6 py-3 bg-nex-cyan text-nex-dark font-semibold rounded-xl hover:shadow-glow-cyan transition-all font-inter text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Docs
                </a>
                {downloadUrl && !downloadBlocked && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(token, 'doc_downloaded', { doc: doc.name, folder: doc.folder })}
                    className="flex items-center gap-2 px-6 py-3 bg-white/6 border border-white/12 text-nex-text hover:bg-white/10 rounded-xl transition-colors font-inter text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          ) : hasUrl ? (
            <>
              {downloadBlocked && (
                <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-3 px-4 py-2.5 bg-nex-darker/95 border-t border-amber-400/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="font-inter text-xs text-amber-300/90">
                      Downloading is disabled for this document.
                    </span>
                  </div>
                  <a
                    href="mailto:sukesh@nexfrontierlogic.nz?subject=PDF Request - NexFrontier Data Room"
                    className="flex-shrink-0 font-inter text-xs px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-400 rounded-lg hover:bg-amber-400/20 transition-colors whitespace-nowrap"
                  >
                    Request PDF
                  </a>
                </div>
              )}
              <iframe
                key={doc.embed_url}
                src={doc.embed_url}
                className="w-full h-full border-0"
                style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
                onLoad={() => setIframeLoaded(true)}
                title={doc.name}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                allow="autoplay"
              />
            </>
          ) : (
            /* Placeholder when no URL has been set yet */
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-nex-grey/40" />
              </div>
              <p className="font-urbanist text-white font-semibold text-lg mb-2">{doc.name}</p>
              <p className="font-inter text-nex-grey text-sm max-w-sm">
                This document hasn&apos;t been uploaded yet. The admin needs to add a Google Drive link for this file.
              </p>
            </div>
          )}
        </div>

        {/* Footer security bar */}
        <div className="flex items-center justify-between px-5 py-2 bg-nex-dark border-t border-white/6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-nex-cyan flex-shrink-0" />
            <span className="font-inter text-nex-grey/60 text-xs">
              Confidential · {investorEmail} · Unauthorised distribution prohibited
            </span>
          </div>
          {doc.drive_url && (
            <a
              href={doc.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Open in Google Drive for accessibility but warn
                if (!confirm('This will open the document in Google Drive in a new tab. Continue?')) {
                  e.preventDefault();
                }
              }}
              className="font-inter text-nex-grey/40 hover:text-nex-grey text-xs flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Open in Drive</span>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Metrics Bar ─────────────────────────────────────────────────────────────

function MetricsBar({
  ndaApproved,
  onSignNda,
  totalViews,
  avgSessionSeconds,
  uniqueInvestors,
  isAdmin,
}: {
  ndaApproved: boolean;
  onSignNda: () => void;
  totalViews: number | null;
  avgSessionSeconds: number | null;
  uniqueInvestors: number | null;
  isAdmin: boolean;
}) {
  const fmtDuration = (secs: number | null) => {
    if (secs === null) return 'N/A';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-nex-darker/80 border-b border-white/5 text-sm">
      {isAdmin ? (
        <>
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            <Eye className="w-4 h-4 text-nex-cyan" />
            <span className="font-inter text-white font-semibold">{totalViews ?? 'N/A'}</span>
            <span className="font-inter text-nex-grey">total views</span>
          </div>
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="font-inter text-white font-semibold">{fmtDuration(avgSessionSeconds)}</span>
            <span className="font-inter text-nex-grey">avg. session</span>
          </div>
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="font-inter text-white font-semibold">{uniqueInvestors ?? 'N/A'}</span>
            <span className="font-inter text-nex-grey">unique investors</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nex-cyan" />
            <span className="font-inter text-nex-cyan font-semibold">Admin Mode</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            {ndaApproved ? (
              <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="font-inter text-emerald-400 font-semibold">Full Access</span></>
            ) : (
              <><Lock className="w-4 h-4 text-amber-400" /><span className="font-inter text-amber-400 font-semibold">Level 1 Access</span></>
            )}
          </div>
          <div className="flex items-center gap-2">
            {ndaApproved ? (
              <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="font-inter text-emerald-400 font-semibold">NDA Signed</span></>
            ) : (
              <><AlertCircle className="w-4 h-4 text-amber-400" /><span className="font-inter text-amber-400 font-semibold">NDA Pending</span></>
            )}
          </div>
          {!ndaApproved && (
            <button onClick={onSignNda} className="ml-auto font-inter text-xs px-3 py-1 bg-nex-cyan text-nex-dark font-semibold rounded-full hover:shadow-glow-cyan transition-all duration-200">
              Sign NDA
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────────────────────

function OverviewPage({
  docs,
  investor,
  setSection,
  onScheduleCall,
  totalViews,
  avgSessionSeconds,
  uniqueInvestors,
  topDocs,
  isAdmin,
  folderLabels,
  allFolders,
}: {
  docs: InvestorDoc[];
  investor: InvestorRecord;
  setSection: (s: NavSection) => void;
  onScheduleCall: () => void;
  totalViews: number | null;
  avgSessionSeconds: number | null;
  uniqueInvestors: number | null;
  topDocs: { name: string; views: number }[];
  isAdmin: boolean;
  folderLabels: Record<string, string>;
  allFolders: Record<string, FolderMeta>;
}) {
  const totalUploaded = docs.filter((d) => d.embed_url.length > 0).length;
  const fmtDuration = (secs: number | null) => {
    if (secs === null) return 'N/A';
    const m = Math.floor(secs / 60);
    return `${m}m`;
  };

  const ndaApproved = investor.access_level === 2;

  // Admin stat cards — platform-wide metrics
  const adminStats = [
    { label: 'Documents Available', value: String(totalUploaded), icon: FileText, color: 'text-nex-cyan', bg: 'bg-nex-cyan/10' },
    { label: 'Document Views', value: String(totalViews ?? 'N/A'), icon: Eye, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { label: 'Avg. Time / Session', value: fmtDuration(avgSessionSeconds), icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Investors Engaged', value: String(uniqueInvestors ?? 'N/A'), icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  // Investor stat cards — personal context only
  const folderCount = Object.keys(allFolders).length;
  const lockedCount = docs.filter((d) => d.locked).length;
  const investorStats = [
    { label: 'Documents Available', value: String(totalUploaded), icon: FileText, color: 'text-nex-cyan', bg: 'bg-nex-cyan/10' },
    { label: 'Folders', value: String(folderCount), icon: Folder, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { label: 'Access Level', value: `Level ${investor.access_level}`, icon: ShieldCheck, color: ndaApproved ? 'text-emerald-400' : 'text-amber-400', bg: ndaApproved ? 'bg-emerald-400/10' : 'bg-amber-400/10' },
    { label: 'NDA-Locked Docs', value: ndaApproved ? 'Unlocked' : String(lockedCount) + ' locked', icon: Lock, color: ndaApproved ? 'text-emerald-400' : 'text-amber-400', bg: ndaApproved ? 'bg-emerald-400/10' : 'bg-amber-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-urbanist text-2xl font-bold text-white mb-1">Investor Data Room</h1>
        <p className="font-inter text-nex-grey text-sm">Confidential materials for qualified investors and strategic partners.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(isAdmin ? adminStats : investorStats).map((s) => (
          <div key={s.label} className="bg-nex-darker/60 border border-white/8 rounded-xl p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="font-urbanist text-xl font-bold text-white">{s.value}</p>
            <p className="font-inter text-nex-grey text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-5">
          <h3 className="font-urbanist text-white font-semibold text-base mb-4">Document Folders</h3>
          <div className="space-y-3">
            {(Object.entries(allFolders) as [string, FolderMeta][]).map(([key, f]) => {
              const folderDocs = docs.filter((d) => d.folder === key);
              const count = folderDocs.filter((d) => d.embed_url.length > 0).length;
              return (
                <button key={key} onClick={() => setSection('documents')} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group text-left">
                  <Folder className={`w-4 h-4 ${f.color} flex-shrink-0`} />
                  <span className="font-inter text-nex-cyan text-sm flex-1">{folderLabels[key] ?? f.label}</span>
                  <span className="font-inter text-nex-grey text-xs">{count}/{folderDocs.length} ready</span>
                  <ChevronRight className="w-3.5 h-3.5 text-nex-grey group-hover:text-nex-cyan transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {isAdmin ? (
          <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-5">
            <h3 className="font-urbanist text-white font-semibold text-base mb-4">Most Viewed</h3>
            {topDocs.length > 0 ? (
              <div className="space-y-3">
                {topDocs.slice(0, 5).map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-nex-cyan flex-shrink-0" />
                    <span className="font-inter text-nex-text text-sm flex-1 truncate">{doc.name}</span>
                    <span className="font-inter text-nex-grey text-xs">{doc.views} views</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-inter text-nex-grey/60 text-sm">No views tracked yet.</p>
            )}
          </div>
        ) : (
          <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-urbanist text-white font-semibold text-base mb-2">Your Access</h3>
              <p className="font-inter text-nex-grey text-sm mb-4">
                {ndaApproved
                  ? 'You have full access to all documents including NDA-restricted materials.'
                  : 'You currently have Level 1 access. Sign the NDA to unlock all documents.'}
              </p>
              {ndaApproved ? (
                <div className="flex items-center gap-2 text-emerald-400 font-inter text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Full access unlocked
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-inter text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {lockedCount} document{lockedCount !== 1 ? 's' : ''} require NDA
                  </div>
                  <button
                    onClick={() => setSection('documents')}
                    className="font-inter text-sm px-4 py-2 bg-nex-cyan text-nex-dark font-semibold rounded-full hover:shadow-glow-cyan transition-all duration-200 mt-2"
                  >
                    Sign NDA to unlock
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-nex-cyan/10 via-nex-blue/5 to-transparent border border-nex-cyan/20 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-urbanist text-white font-semibold">Ready to go deeper?</h3>
            <p className="font-inter text-nex-grey text-sm mt-0.5">Request a live walkthrough with the NexFrontier founding team.</p>
          </div>
          <button onClick={onScheduleCall} className="font-inter flex-shrink-0 px-5 py-2.5 bg-nex-cyan text-nex-dark text-sm font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300">
            Schedule a Call
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Documents Page ───────────────────────────────────────────────────────────

function DocumentsPage({
  investor,
  token,
  docs: initialDocs,
  onRequestNda,
  folderLabels: initialFolderLabels,
  onFolderLabelChange,
  allFolders: initialAllFolders,
  onFoldersChange,
}: {
  investor: InvestorRecord;
  token: string;
  docs: InvestorDoc[];
  onRequestNda: () => void;
  folderLabels: Record<string, string>;
  onFolderLabelChange: (key: string, label: string) => void;
  allFolders: Record<string, FolderMeta>;
  onFoldersChange: (folders: Record<string, FolderMeta>) => void;
}) {
  const isAdmin = token.startsWith('admin-bypass-');
  const ndaApproved = investor.access_level === 2;
  const [openFolder, setOpenFolder] = useState<string | null>('traction');
  const [viewingDoc, setViewingDoc] = useState<InvestorDoc | null>(null);

  // Admin edit state — local copy so saves reflect immediately
  const [docs, setDocs] = useState<InvestorDoc[]>(initialDocs);
  const [urlEdits, setUrlEdits] = useState<Record<string, string>>({});
  const [nameEdits, setNameEdits] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [addingToFolder, setAddingToFolder] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [addingDoc, setAddingDoc] = useState(false);

  // Folder label state (admin-editable, driven by parent)
  const [folderLabels, setFolderLabels] = useState<Record<string, string>>(initialFolderLabels);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [folderLabelEdit, setFolderLabelEdit] = useState('');
  const [folderColorEdit, setFolderColorEditState] = useState('text-nex-cyan');
  const folderColorEditRef = useRef('text-nex-cyan');
  const folderInputRef = useRef<HTMLInputElement>(null);
  const setFolderColorEdit = (v: string) => { folderColorEditRef.current = v; setFolderColorEditState(v); };
  const [savingFolder, setSavingFolder] = useState<string | null>(null);

  const [allFolders, setAllFolders] = useState<Record<string, FolderMeta>>(initialAllFolders);

  // Add Folder modal state
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('text-nex-cyan');
  const [addingFolder, setAddingFolder] = useState(false);
  const [addFolderError, setAddFolderError] = useState('');
  const [deletingFolder, setDeletingFolder] = useState<string | null>(null);

  useEffect(() => { setFolderLabels(initialFolderLabels); }, [initialFolderLabels]);

  const handleStartFolderEdit = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(key);
    setSavingFolder(null);
    setFolderLabelEdit(folderLabels[key] ?? '');
    const color = allFolders[key]?.color ?? 'text-nex-cyan';
    setFolderColorEdit(color);
    setOpenFolder(null);
    setTimeout(() => folderInputRef.current?.focus(), 50);
  };

  const handleSaveFolderLabel = async (key: string) => {
    const label = folderLabelEdit.trim();
    if (!label) return;
    const color = folderColorEditRef.current;
    setSavingFolder(key);
    try {
      await fetch(`${FN_BASE}/admin/folder-labels`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
        body: JSON.stringify({ folder_key: key, label }),
      });
      await fetch(`${FN_BASE}/admin/folder-color`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
        body: JSON.stringify({ folder_key: key, color_class: color }),
      });
    } catch (_) {
      // network failure — still close the edit and update local state
    }
    const updatedFolders = { ...allFolders, [key]: { ...allFolders[key], color } };
    setAllFolders(updatedFolders);
    onFoldersChange(updatedFolders);
    setFolderLabels((prev) => ({ ...prev, [key]: label }));
    onFolderLabelChange(key, label);
    setSavingFolder(null);
    setEditingFolder(null);
  };

  const handleCancelFolderEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingFolder(null);
  };

  const handleAddFolder = async () => {
    const label = newFolderName.trim();
    if (!label) return;
    setAddingFolder(true);
    setAddFolderError('');
    const res = await fetch(`${FN_BASE}/admin/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ label, color_class: newFolderColor }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      setAddFolderError(errBody.error ?? `Failed (${res.status})`);
      setAddingFolder(false);
      return;
    }
    const { folder } = await res.json();
    const updatedFolders = { ...allFolders, [folder.folder_key]: { label: folder.label, color: folder.color_class, isCustom: true } };
    setAllFolders(updatedFolders);
    onFoldersChange(updatedFolders);
    setFolderLabels((prev) => ({ ...prev, [folder.folder_key]: folder.label }));
    onFolderLabelChange(folder.folder_key, folder.label);
    setShowAddFolder(false);
    setNewFolderName('');
    setNewFolderColor('text-nex-cyan');
    setAddFolderError('');
    setAddingFolder(false);
  };

  const handleDeleteFolder = async (key: string) => {
    if (!window.confirm(`Delete folder "${allFolders[key]?.label ?? key}" and all its documents? This cannot be undone.`)) return;
    setDeletingFolder(key);
    await fetch(`${FN_BASE}/admin/folders`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ folder_key: key }),
    });
    const updatedFolders = Object.fromEntries(Object.entries(allFolders).filter(([k]) => k !== key));
    setAllFolders(updatedFolders);
    onFoldersChange(updatedFolders);
    setDocs((prev) => prev.filter((d) => d.folder !== key));
    setDeletingFolder(null);
  };

  // Keep local docs in sync if parent reloads
  useEffect(() => { setDocs(initialDocs); }, [initialDocs]);

  // Group docs by folder (from DB data, not hardcoded keys)
  const docsByFolder = Object.keys(allFolders).reduce<Record<string, InvestorDoc[]>>((acc, key) => {
    acc[key] = docs
      .filter((d) => d.folder === key)
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<string, InvestorDoc[]>);

  const handleFolderOpen = (key: string) => {
    const next = openFolder === key ? null : key;
    setOpenFolder(next);
    if (next && !isAdmin) track(token, 'folder_opened', { folder: key });
  };

  const handleView = (doc: InvestorDoc) => {
    setViewingDoc(doc);
    if (!isAdmin) track(token, 'doc_viewed', { doc: doc.name, folder: doc.folder });
  };

  // Admin handlers
  const handleUrlChange = (docKey: string, value: string) => {
    setUrlEdits((p) => ({ ...p, [docKey]: value }));
    setSaved((p) => ({ ...p, [docKey]: false }));
    setErrors((p) => ({ ...p, [docKey]: '' }));
  };

  const adminHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    Apikey: ANON_KEY,
  };

  const docPut = (body: Record<string, unknown>) =>
    fetch(`${FN_BASE}/admin/docs`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });

  const handleSave = async (doc: InvestorDoc) => {
    const rawUrl = (urlEdits[doc.doc_key] ?? doc.drive_url).trim();
    if (!rawUrl) {
      setErrors((p) => ({ ...p, [doc.doc_key]: 'Paste a Google Drive share link.' }));
      return;
    }
    const embedUrl = toEmbedUrl(rawUrl);
    setSaving((p) => ({ ...p, [doc.doc_key]: true }));
    const res = await docPut({ doc_key: doc.doc_key, drive_url: rawUrl, embed_url: embedUrl });
    setSaving((p) => ({ ...p, [doc.doc_key]: false }));
    if (!res.ok) { const j = await res.json(); setErrors((p) => ({ ...p, [doc.doc_key]: j.error ?? 'Save failed.' })); return; }
    setSaved((p) => ({ ...p, [doc.doc_key]: true }));
    setDocs((prev) => prev.map((d) => d.doc_key === doc.doc_key ? { ...d, drive_url: rawUrl, embed_url: embedUrl } : d));
    setEditingDoc(null);
    setTimeout(() => setSaved((p) => ({ ...p, [doc.doc_key]: false })), 2500);
  };

  const handleSaveName = async (docKey: string) => {
    const newName = (nameEdits[docKey] ?? '').trim();
    if (!newName) return;
    setSaving((p) => ({ ...p, [docKey]: true }));
    const res = await docPut({ doc_key: docKey, name: newName });
    setSaving((p) => ({ ...p, [docKey]: false }));
    if (!res.ok) { const j = await res.json(); setErrors((p) => ({ ...p, [docKey]: j.error ?? 'Save failed.' })); return; }
    setDocs((prev) => prev.map((d) => d.doc_key === docKey ? { ...d, name: newName } : d));
    setEditingName(null);
  };

  const handleClear = async (docKey: string) => {
    if (!confirm('Remove the Google Drive link for this document?')) return;
    await docPut({ doc_key: docKey, drive_url: '', embed_url: '' });
    setUrlEdits((p) => ({ ...p, [docKey]: '' }));
    setDocs((prev) => prev.map((d) => d.doc_key === docKey ? { ...d, drive_url: '', embed_url: '' } : d));
  };

  const handleToggleLocked = async (doc: InvestorDoc) => {
    const newLocked = !doc.locked;
    setSaving((p) => ({ ...p, [doc.doc_key]: true }));
    const res = await docPut({ doc_key: doc.doc_key, locked: newLocked });
    setSaving((p) => ({ ...p, [doc.doc_key]: false }));
    if (!res.ok) { const j = await res.json(); setErrors((p) => ({ ...p, [doc.doc_key]: j.error ?? 'Save failed.' })); return; }
    setDocs((prev) => prev.map((d) => d.doc_key === doc.doc_key ? { ...d, locked: newLocked } : d));
  };

  const handleAddDoc = async (folderKey: string) => {
    const name = newDocName.trim();
    if (!name) return;
    setAddingDoc(true);
    const newKey = `${folderKey}-${crypto.randomUUID().slice(0, 8)}`;
    const folderDocs = docsByFolder[folderKey] ?? [];
    const maxOrder = folderDocs.length > 0 ? Math.max(...folderDocs.map((d) => d.sort_order)) : -1;
    const res = await fetch(`${FN_BASE}/admin/docs`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ doc_key: newKey, folder: folderKey, name, locked: false, sort_order: maxOrder + 1 }),
    });
    setAddingDoc(false);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      setErrors((p) => ({ ...p, [`add-${folderKey}`]: errBody.error ?? `Failed (${res.status})` }));
      return;
    }
    setErrors((p) => { const n = { ...p }; delete n[`add-${folderKey}`]; return n; });
    const { doc } = await res.json();
    if (!doc) return;
    setDocs((prev) => [...prev, doc as InvestorDoc]);
    setNewDocName('');
    setAddingToFolder(null);
  };

  const handleDeleteDoc = async (doc: InvestorDoc) => {
    if (!confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    const res = await fetch(`${FN_BASE}/admin/docs`, {
      method: 'DELETE',
      headers: adminHeaders,
      body: JSON.stringify({ id: doc.id }),
    });
    if (!res.ok) return;
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    if (viewingDoc?.id === doc.id) setViewingDoc(null);
  };

  return (
    <>
      <AnimatePresence>
        {viewingDoc && (
          <DocumentViewer
            doc={viewingDoc}
            investorEmail={investor.email}
            token={token}
            isAdmin={isAdmin}
            onClose={() => setViewingDoc(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-urbanist text-2xl font-bold text-white mb-1">Documents</h1>
            <p className="font-inter text-nex-grey text-sm">
              {isAdmin
                ? 'Admin view: link Google Drive files, set security levels, and preview documents.'
                : ndaApproved
                  ? 'Full access granted. All documents are available to view.'
                  : 'Some documents require NDA approval. Sign the NDA to unlock restricted files.'}
            </p>
          </div>
          {isAdmin && (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-nex-cyan/10 border border-nex-cyan/25 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-nex-cyan" />
              <span className="font-inter text-nex-cyan text-xs font-medium">Admin</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="bg-sky-900/20 border border-sky-500/25 rounded-xl px-4 py-3 text-xs text-sky-300/80">
            <span className="font-semibold text-sky-200">How to link a document: </span>
            Open file in Google Drive → Share → "Anyone with the link" → Copy link → paste below → Save.
            Toggle the security badge to require NDA or make public.
            <span className="ml-2 font-semibold text-sky-200">To rename a folder:</span> click the pencil icon on the folder row.
            <span className="ml-2 font-semibold text-sky-200">To add a folder:</span> click "Add Folder" below.
          </div>
        )}

        <div className="space-y-3">
          {(Object.entries(allFolders) as [string, FolderMeta][]).map(([key, folder]) => {
            const isOpen = openFolder === key;
            const folderDocs = docsByFolder[key] ?? [];
            const lockedCount = folderDocs.filter((d) => d.locked).length;
            const linkedCount = folderDocs.filter((d) => d.embed_url.length > 0).length;
            const isAddingHere = addingToFolder === key;

            return (
              <div key={key} className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                {editingFolder === key ? (
                  <div className="flex flex-col gap-2 px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <Folder className={`w-5 h-5 ${folderColorEdit} flex-shrink-0`} />
                      <input
                        ref={folderInputRef}
                        type="text"
                        value={folderLabelEdit}
                        onChange={(e) => setFolderLabelEdit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveFolderLabel(key);
                          if (e.key === 'Escape') handleCancelFolderEdit();
                        }}
                        className="flex-1 min-w-0 bg-nex-dark border border-nex-cyan/40 rounded-lg px-2.5 py-1.5 font-urbanist text-white font-semibold text-sm focus:border-nex-cyan focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleSaveFolderLabel(key); }}
                        disabled={savingFolder === key}
                        className="p-1.5 text-nex-cyan hover:text-white bg-nex-cyan/10 hover:bg-nex-cyan/20 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                        title="Save"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelFolderEdit}
                        className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors flex-shrink-0"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 pl-8">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFolderColorEdit(c.value); }}
                          title={c.label}
                          style={{ backgroundColor: c.hex }}
                          className={`w-5 h-5 rounded-full border-2 transition-all ${folderColorEdit === c.value ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        />
                      ))}
                      <span className="font-inter text-nex-grey/50 text-xs ml-1">Icon colour</span>
                    </div>
                  </div>
                ) : (
                <div
                  onClick={() => handleFolderOpen(key)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/4 transition-colors cursor-pointer"
                >
                  <Folder className={`w-5 h-5 ${folder.color} flex-shrink-0`} />
                  <span className="font-urbanist text-nex-cyan font-semibold text-sm flex-1 text-left">{folderLabels[key] ?? folder.label}</span>
                  {isAdmin ? (
                    <>
                      <button
                        onClick={(e) => handleStartFolderEdit(key, e)}
                        className="p-1.5 text-nex-grey/60 hover:text-nex-cyan hover:bg-nex-cyan/10 rounded-lg transition-colors flex-shrink-0"
                        title="Rename folder"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                      </button>
                      {folder.isCustom && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteFolder(key); }}
                          disabled={deletingFolder === key}
                          className="p-1.5 text-nex-grey/60 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors flex-shrink-0 mr-1"
                          title="Delete folder"
                        >
                          {deletingFolder === key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <span className="font-inter text-nex-grey text-xs mr-3">{linkedCount}/{folderDocs.length} linked</span>
                    </>
                  ) : (
                    <span className="font-inter text-nex-grey text-xs mr-3">{folderDocs.length} files</span>
                  )}
                  {!ndaApproved && !isAdmin && lockedCount > 0 && (
                    <span className="font-inter text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full mr-2">
                      {lockedCount} locked
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 text-nex-grey transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </div>
                )}

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {isAdmin ? (
                        /* ── Admin management rows ── */
                        <div className="border-t border-white/6 divide-y divide-white/4">
                          {folderDocs.map((doc) => {
                            if (!doc) return null;
                            const hasFile = doc.embed_url.length > 0;
                            const isEditing = editingDoc === doc.doc_key;
                            const isEditingName = editingName === doc.doc_key;
                            const currentUrl = urlEdits[doc.doc_key] ?? doc.drive_url;
                            const currentName = nameEdits[doc.doc_key] ?? doc.name;
                            const downloadUrl = doc.drive_url ? toDownloadUrl(doc.drive_url) : null;
                            const isSaving = saving[doc.doc_key];
                            const isSaved = saved[doc.doc_key];
                            const err = errors[doc.doc_key];

                            return (
                              <div key={doc.doc_key} className="px-5 py-4 space-y-3">
                                {/* Row header */}
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <File className={`w-4 h-4 flex-shrink-0 ${hasFile ? folder.color : 'text-nex-grey/40'}`} />
                                  {isEditingName ? (
                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                      <input
                                        type="text"
                                        value={currentName}
                                        onChange={(e) => setNameEdits((p) => ({ ...p, [doc.doc_key]: e.target.value }))}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveName(doc.doc_key);
                                          if (e.key === 'Escape') setEditingName(null);
                                        }}
                                        className="flex-1 min-w-0 bg-nex-dark border border-nex-cyan/40 rounded-lg px-2.5 py-1 font-inter text-sm text-nex-text focus:border-nex-cyan focus:outline-none transition-colors"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => handleSaveName(doc.doc_key)}
                                        disabled={isSaving}
                                        className="p-1.5 text-nex-cyan hover:text-white bg-nex-cyan/10 hover:bg-nex-cyan/20 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                                        title="Save name"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingName(null)}
                                        className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors flex-shrink-0"
                                        title="Cancel"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditingName(doc.doc_key);
                                        setNameEdits((p) => ({ ...p, [doc.doc_key]: p[doc.doc_key] ?? doc.name }));
                                      }}
                                      className="font-inter text-nex-text text-sm font-medium flex-1 min-w-0 truncate text-left hover:text-white group flex items-center gap-1.5"
                                      title="Click to rename"
                                    >
                                      <span className="truncate">{doc.name}</span>
                                      <PenLine className="w-3 h-3 text-nex-grey/30 group-hover:text-nex-grey/70 flex-shrink-0 transition-colors" />
                                    </button>
                                  )}

                                  {/* Security toggle */}
                                  <button
                                    onClick={() => handleToggleLocked(doc)}
                                    disabled={isSaving}
                                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 flex-shrink-0 ${
                                      doc.locked
                                        ? 'text-amber-400 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20'
                                        : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20'
                                    }`}
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    {doc.locked ? 'NDA required' : 'Public'}
                                  </button>

                                  {/* Live / No URL badge */}
                                  {hasFile
                                    ? <span className="text-xs text-nex-cyan bg-nex-cyan/10 px-2 py-0.5 rounded-full border border-nex-cyan/20 flex-shrink-0">Linked</span>
                                    : <span className="text-xs text-nex-grey/50 bg-white/5 px-2 py-0.5 rounded-full flex-shrink-0">No link</span>
                                  }

                                  {/* Actions */}
                                  <div className="flex items-center gap-1.5 ml-auto">
                                    {hasFile && !isEditing && (
                                      <>
                                        <button
                                          onClick={() => handleView(doc)}
                                          className="font-inter text-xs px-2.5 py-1.5 border border-nex-cyan/30 text-nex-cyan rounded-lg hover:bg-nex-cyan/10 transition-colors flex items-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Preview
                                        </button>
                                        {downloadUrl && !doc.locked && (
                                          <a
                                            href={downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-inter text-xs px-2.5 py-1.5 border border-white/15 text-nex-grey hover:text-white hover:border-white/30 rounded-lg transition-colors flex items-center gap-1"
                                          >
                                            <Download className="w-3 h-3" />
                                            PDF
                                          </a>
                                        )}
                                      </>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (isEditing) { setEditingDoc(null); } else {
                                          setEditingDoc(doc.doc_key);
                                          setUrlEdits((p) => ({ ...p, [doc.doc_key]: p[doc.doc_key] ?? doc.drive_url }));
                                        }
                                      }}
                                      className="font-inter text-xs px-2.5 py-1.5 border border-white/15 text-nex-grey hover:text-white hover:border-white/30 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                      {isEditing ? <X className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                                      {isEditing ? 'Cancel' : hasFile ? 'Edit link' : 'Add link'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDoc(doc)}
                                      className="p-1.5 text-nex-grey/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                                      title="Delete document"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Inline URL editor */}
                                <AnimatePresence>
                                  {isEditing && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={currentUrl}
                                            onChange={(e) => handleUrlChange(doc.doc_key, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSave(doc)}
                                            placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                                            className="flex-1 bg-nex-dark border border-white/12 rounded-lg px-3 py-2 font-mono text-xs text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                                            autoFocus
                                          />
                                          <button
                                            onClick={() => handleSave(doc)}
                                            disabled={isSaving}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-nex-cyan text-nex-dark text-xs font-semibold rounded-lg hover:shadow-glow-cyan disabled:opacity-50 transition-all flex-shrink-0"
                                          >
                                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : isSaved ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                                            {isSaving ? 'Saving…' : isSaved ? 'Saved!' : 'Save'}
                                          </button>
                                          {hasFile && (
                                            <button
                                              onClick={() => handleClear(doc.doc_key)}
                                              className="p-2 text-nex-grey/50 hover:text-red-400 transition-colors"
                                              title="Remove link"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                        {err && (
                                          <p className="font-inter text-red-400 text-xs flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {err}
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}

                          {/* Add document row */}
                          <div className="px-5 py-3">
                            {isAddingHere ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                  <Plus className="w-4 h-4 text-nex-cyan flex-shrink-0" />
                                  <input
                                    type="text"
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddDoc(key);
                                      if (e.key === 'Escape') { setAddingToFolder(null); setNewDocName(''); }
                                    }}
                                    placeholder="Document name…"
                                    className="flex-1 bg-nex-dark border border-nex-cyan/40 rounded-lg px-2.5 py-1.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleAddDoc(key)}
                                    disabled={addingDoc || !newDocName.trim()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-nex-cyan text-nex-dark text-xs font-semibold rounded-lg hover:shadow-glow-cyan disabled:opacity-50 transition-all flex-shrink-0"
                                  >
                                    {addingDoc ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                    Add
                                  </button>
                                  <button
                                    onClick={() => { setAddingToFolder(null); setNewDocName(''); setErrors((p) => { const n = { ...p }; delete n[`add-${key}`]; return n; }); }}
                                    className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {errors[`add-${key}`] && (
                                  <p className="font-inter text-xs text-rose-400 pl-6">{errors[`add-${key}`]}</p>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => { setAddingToFolder(key); setNewDocName(''); }}
                                className="flex items-center gap-1.5 text-xs text-nex-grey/50 hover:text-nex-cyan transition-colors group"
                              >
                                <Plus className="w-3.5 h-3.5 group-hover:text-nex-cyan transition-colors" />
                                Add document
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* ── Investor read-only rows ── */
                        <div className="border-t border-white/6">
                          <div className="hidden sm:grid grid-cols-[1fr_100px_160px] gap-4 px-5 py-2.5 bg-white/3 text-xs font-inter text-nex-grey uppercase tracking-wider">
                            <span>Document</span>
                            <span>Status</span>
                            <span className="text-right">Actions</span>
                          </div>

                          {folderDocs.map((doc) => {
                            if (!doc) return null;
                            const isLocked = doc.locked && !ndaApproved;
                            const hasFile = doc.embed_url.length > 0 || (doc.drive_url ? isGoogleDocsUrl(doc.drive_url) : false);
                            const isDocFile = doc.drive_url ? isGoogleDocsUrl(doc.drive_url) : false;
                            const downloadUrl = doc.drive_url ? toDownloadUrl(doc.drive_url) : null;
                            return (
                              <div
                                key={doc.doc_key}
                                className={`flex sm:grid sm:grid-cols-[1fr_100px_160px] gap-4 items-center px-5 py-3.5 border-t border-white/4 transition-colors ${isLocked ? 'opacity-50' : 'hover:bg-white/3'}`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {isLocked
                                    ? <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    : <File className={`w-4 h-4 flex-shrink-0 ${hasFile ? folder.color : 'text-nex-grey/40'}`} />
                                  }
                                  <p className={`font-inter text-sm truncate ${isLocked ? 'text-nex-grey' : 'text-nex-text'}`}>
                                    {doc.name}
                                  </p>
                                </div>

                                <div className="hidden sm:flex items-center">
                                  {isLocked ? (
                                    <span className="font-inter text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Restricted</span>
                                  ) : hasFile ? (
                                    <span className="font-inter text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Ready</span>
                                  ) : (
                                    <span className="font-inter text-xs text-nex-grey/50 bg-white/5 px-2 py-0.5 rounded-full">Pending</span>
                                  )}
                                </div>

                                <div className="ml-auto sm:ml-0 flex items-center justify-end gap-1.5">
                                  {isLocked ? (
                                    <button
                                      onClick={onRequestNda}
                                      className="font-inter text-xs px-3 py-1.5 border border-amber-400/40 text-amber-400 rounded-lg hover:bg-amber-400/10 transition-colors flex items-center gap-1"
                                    >
                                      <Lock className="w-3 h-3" />
                                      <span className="hidden sm:inline">Sign NDA</span>
                                    </button>
                                  ) : hasFile ? (
                                    <>
                                      {isDocFile ? (
                                        <a
                                          href={doc.drive_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => track(token, 'doc_viewed', { doc: doc.name, folder: doc.folder })}
                                          className="font-inter text-xs px-2.5 py-1.5 border border-nex-cyan/40 text-nex-cyan rounded-lg hover:bg-nex-cyan/10 transition-colors flex items-center gap-1"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          <span>Open in GDoc</span>
                                        </a>
                                      ) : (
                                        <button
                                          onClick={() => handleView(doc)}
                                          className="font-inter text-xs px-2.5 py-1.5 border border-nex-cyan/40 text-nex-cyan rounded-lg hover:bg-nex-cyan/10 transition-colors flex items-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          <span>Preview</span>
                                        </button>
                                      )}
                                      {downloadUrl && !doc.locked && (
                                        <a
                                          href={downloadUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => track(token, 'doc_downloaded', { doc: doc.name, folder: doc.folder })}
                                          className="font-inter text-xs px-2.5 py-1.5 border border-white/15 text-nex-grey hover:text-white hover:border-white/30 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                          <Download className="w-3 h-3" />
                                          <span className="hidden sm:inline">PDF</span>
                                        </a>
                                      )}
                                    </>
                                  ) : (
                                    <span className="font-inter text-xs text-nex-grey/40 px-3 py-1.5">N/A</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <>
            <button
              onClick={() => setShowAddFolder(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-nex-cyan/10 border border-nex-cyan/25 text-nex-cyan hover:bg-nex-cyan/20 rounded-xl transition-colors font-inter text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Folder
            </button>

            <AnimatePresence>
              {showAddFolder && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setShowAddFolder(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-nex-darker border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                  >
                    <h3 className="font-urbanist text-white font-bold text-lg mb-4">New Folder</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="font-inter text-nex-grey text-xs uppercase tracking-wider mb-1.5 block">Folder Name</label>
                        <input
                          autoFocus
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddFolder(); if (e.key === 'Escape') setShowAddFolder(false); }}
                          placeholder="e.g. Due Diligence"
                          className="w-full bg-nex-dark border border-white/10 rounded-xl px-3.5 py-2.5 font-inter text-sm text-white placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="font-inter text-nex-grey text-xs uppercase tracking-wider mb-1.5 block">Colour</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {COLOR_OPTIONS.map((c) => (
                            <button
                              key={c.value}
                              onClick={() => setNewFolderColor(c.value)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs font-inter ${newFolderColor === c.value ? 'border-white/30 bg-white/10' : 'border-white/8 hover:border-white/20'}`}
                            >
                              <Folder className={`w-3.5 h-3.5 ${c.value}`} />
                              <span className="text-nex-text">{c.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {addFolderError && (
                      <p className="font-inter text-xs text-rose-400 mt-3">{addFolderError}</p>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => { setShowAddFolder(false); setAddFolderError(''); }}
                        className="flex-1 px-4 py-2.5 border border-white/10 text-nex-grey hover:text-white hover:border-white/20 rounded-xl font-inter text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddFolder}
                        disabled={addingFolder || !newFolderName.trim()}
                        className="flex-1 px-4 py-2.5 bg-nex-cyan text-nex-dark font-semibold rounded-xl font-inter text-sm hover:shadow-glow-cyan transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {addingFolder ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</> : 'Create Folder'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {!ndaApproved && !isAdmin && (
          <div className="bg-amber-400/8 border border-amber-400/25 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-urbanist text-white font-semibold text-sm">NDA Required for Full Access</p>
                <p className="font-inter text-nex-grey text-sm mt-0.5">Sign the NDA to unlock all restricted documents. Takes under 2 minutes.</p>
              </div>
            </div>
            <button onClick={onRequestNda} className="sm:ml-auto font-inter px-5 py-2.5 bg-amber-400 text-nex-dark text-sm font-semibold rounded-full hover:bg-amber-300 transition-colors flex-shrink-0">
              Sign NDA Now
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────

interface AnalyticsSummary {
  total_doc_views: number;
  total_doc_downloads: number;
  total_sessions: number;
  unique_investors: number;
  avg_session_seconds: number | null;
  days: number;
}

interface FolderCompletion {
  folder: string;
  docs_viewed: number;
}

interface InvestorStat {
  id: string;
  email: string;
  name: string;
  nda_signed: boolean;
  first_seen_at: string | null;
  login_count: number;
  last_action: string | null;
  folder_completion: FolderCompletion[];
  access_level: number;
  last_seen_at: string | null;
  created_at: string;
  session_count: number;
  total_duration_seconds: number;
  doc_views: number;
  doc_downloads: number;
  folders_accessed: number;
}

interface TopDoc {
  name: string;
  views: number;
  downloads: number;
  unique_viewers: number;
  avg_duration_seconds: number | null;
}

function AnalyticsPage({
  token,
  summary,
  topDocs,
  dailyViews,
  investorStats,
  unopenedDocs,
  settings,
  loading,
  onRefresh,
}: {
  token: string;
  summary: AnalyticsSummary | null;
  topDocs: TopDoc[];
  dailyViews: { date: string; views: number }[];
  investorStats: InvestorStat[];
  unopenedDocs: string[];
  settings: Record<string, Record<string, unknown>>;
  loading: boolean;
  onRefresh: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'documents' | 'funnel' | 'settings'>('leaderboard');
  const [drillInvestor, setDrillInvestor] = useState<InvestorStat | null>(null);
  const [auditEvents, setAuditEvents] = useState<Array<{ event_type: string; event_data: Record<string, string>; created_at: string; session_id: string | null }>>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Local settings state (controlled)
  const alertEnabled = !!(settings.first_login_alert?.enabled);
  const alertEmail = (settings.first_login_alert?.email as string) ?? 'sukesh@nexfrontierlogic.nz';
  const granularEnabled = settings.granular_tracking?.enabled !== false;

  const [localAlertEnabled, setLocalAlertEnabled] = useState(alertEnabled);
  const [localAlertEmail, setLocalAlertEmail] = useState(alertEmail);
  const [localGranular, setLocalGranular] = useState(granularEnabled);

  // Sync when settings prop changes
  React.useEffect(() => {
    setLocalAlertEnabled(!!(settings.first_login_alert?.enabled));
    setLocalAlertEmail((settings.first_login_alert?.email as string) ?? 'sukesh@nexfrontierlogic.nz');
    setLocalGranular(settings.granular_tracking?.enabled !== false);
  }, [settings]);

  const fmtDuration = (secs: number | null) => {
    if (!secs) return 'N/A';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
  };

  const fmtDate = (iso: string | null) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const fmtRelative = (iso: string | null) => {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return fmtDate(iso);
  };

  const last7 = dailyViews.slice(-7);
  const maxVal = Math.max(...last7.map((d) => d.views), 1);

  const dayLabel = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' });

  const engagementScore = (inv: InvestorStat) =>
    inv.doc_views * 3 + inv.doc_downloads * 5 + inv.session_count * 2 + inv.folders_accessed * 4 + inv.login_count * 2;

  const sortedByEngagement = [...investorStats].sort((a, b) => engagementScore(b) - engagementScore(a));
  const maxScore = Math.max(engagementScore(sortedByEngagement[0] ?? { doc_views: 0, doc_downloads: 0, session_count: 0, folders_accessed: 0, login_count: 0 } as InvestorStat), 1);

  const FOLDER_LABELS: Record<string, { label: string; total: number; color: string }> = {
    legal: { label: 'Legal', total: 4, color: 'bg-amber-400' },
    financials: { label: 'Financials', total: 4, color: 'bg-emerald-400' },
    tech: { label: 'Technology', total: 4, color: 'bg-sky-400' },
    traction: { label: 'Traction', total: 4, color: 'bg-nex-cyan' },
  };

  const openAuditTrail = async (inv: InvestorStat) => {
    setDrillInvestor(inv);
    setAuditLoading(true);
    setAuditEvents([]);
    try {
      const res = await fetch(`${FN_BASE}/admin/investor-timeline?investor_id=${inv.id}`, {
        headers: { Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      });
      if (res.ok) {
        const j = await res.json();
        setAuditEvents(j.events ?? []);
      }
    } catch (_) {}
    setAuditLoading(false);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    await Promise.all([
      fetch(`${FN_BASE}/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
        body: JSON.stringify({ key: 'first_login_alert', value: { enabled: localAlertEnabled, email: localAlertEmail } }),
      }),
      fetch(`${FN_BASE}/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
        body: JSON.stringify({ key: 'granular_tracking', value: { enabled: localGranular } }),
      }),
    ]);
    setSavingSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const TABS = [
    { key: 'leaderboard', label: 'Investor Leaderboard' },
    { key: 'documents', label: 'Document Intelligence' },
    { key: 'funnel', label: 'Due Diligence Funnel' },
    { key: 'settings', label: 'Settings' },
  ] as const;

  const eventLabel = (type: string) => {
    const map: Record<string, string> = {
      session_start: 'Entered data room',
      session_end: 'Left data room',
      doc_viewed: 'Opened document',
      doc_exit: 'Closed document',
      doc_downloaded: 'Downloaded document',
      nda_signed: 'Signed NDA',
      folder_opened: 'Opened folder',
      nav_section_changed: 'Navigated to section',
      schedule_call_clicked: 'Clicked Schedule Call',
      contact_clicked: 'Clicked Contact',
    };
    return map[type] ?? type;
  };

  const eventColor = (type: string) => {
    if (type === 'session_start') return 'text-emerald-400';
    if (type === 'session_end') return 'text-nex-grey/50';
    if (type === 'doc_downloaded') return 'text-amber-400';
    if (type === 'nda_signed') return 'text-nex-cyan';
    if (type === 'doc_viewed' || type === 'folder_opened') return 'text-sky-400';
    return 'text-nex-grey';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-urbanist text-2xl font-bold text-white mb-1">Analytics</h1>
          <p className="font-inter text-nex-grey text-sm">Investor behaviour and document intelligence, last 30 days.</p>
        </div>
        <button onClick={onRefresh} disabled={loading} className="p-2 text-nex-grey hover:text-nex-cyan transition-colors disabled:opacity-40" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !summary ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-nex-cyan animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: 'Active Investors', value: String(summary?.unique_investors ?? 'N/A'), color: 'text-emerald-400', sub: 'visited data room' },
              { label: 'Total Sessions', value: String(summary?.total_sessions ?? 'N/A'), color: 'text-sky-400', sub: 'last 30 days' },
              { label: 'Doc Views', value: String(summary?.total_doc_views ?? 'N/A'), color: 'text-nex-cyan', sub: 'documents opened' },
              { label: 'Downloads', value: String(summary?.total_doc_downloads ?? 'N/A'), color: 'text-amber-400', sub: 'files taken offline' },
              { label: 'Avg. Session', value: fmtDuration(summary?.avg_session_seconds ?? null), color: 'text-rose-400', sub: 'time in data room' },
            ].map((s) => (
              <div key={s.label} className="bg-nex-darker/60 border border-white/8 rounded-xl p-4">
                <p className="font-inter text-nex-grey/70 text-xs uppercase tracking-wider mb-1.5">{s.label}</p>
                <p className={`font-urbanist text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="font-inter text-nex-grey/50 text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Activity sparkline */}
          <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-5">
            <h3 className="font-urbanist text-white font-semibold text-sm mb-5">
              Document Views <span className="text-nex-grey font-normal text-xs ml-1">(last 7 days)</span>
            </h3>
            {last7.every((d) => d.views === 0) ? (
              <p className="font-inter text-nex-grey/50 text-sm text-center py-8">No activity in this period.</p>
            ) : (
              <div className="flex items-end gap-2 h-28">
                {last7.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.views / maxVal) * 100}%` }}
                      transition={{ duration: 0.55, delay: 0.04 }}
                      className="w-full bg-nex-cyan/25 rounded-t hover:bg-nex-cyan/50 transition-colors relative group cursor-default"
                      style={{ minHeight: d.views > 0 ? 4 : 0 }}
                    >
                      {d.views > 0 && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-inter text-xs text-white bg-nex-dark px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-10">
                          {d.views} view{d.views !== 1 ? 's' : ''}
                        </span>
                      )}
                    </motion.div>
                    <span className="font-inter text-nex-grey/60 text-xs">{dayLabel(d.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-nex-darker/60 border border-white/8 rounded-xl p-1 w-fit flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`font-inter text-sm px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === t.key ? 'bg-white/10 text-white font-medium' : 'text-nex-grey hover:text-nex-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: Investor Leaderboard ── */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              {/* Audit trail drill-down modal */}
              <AnimatePresence>
                {drillInvestor && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setDrillInvestor(null); }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-nex-darker border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
                    >
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
                        <div>
                          <h2 className="font-urbanist text-white font-bold">Audit Trail: {drillInvestor.name || drillInvestor.email}</h2>
                          <p className="font-inter text-nex-grey/60 text-xs mt-0.5">{drillInvestor.email} · Full click-path history</p>
                        </div>
                        <button onClick={() => setDrillInvestor(null)} className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        {auditLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 text-nex-cyan animate-spin" />
                          </div>
                        ) : auditEvents.length === 0 ? (
                          <p className="font-inter text-nex-grey/50 text-sm text-center py-12">No activity recorded for this investor yet.</p>
                        ) : (
                          <div className="space-y-0">
                            {auditEvents.map((ev, i) => {
                              const evData = ev.event_data ?? {};
                              const detail = evData.doc ?? evData.folder ?? evData.section ?? '';
                              const dur = (ev as { duration_seconds?: number }).duration_seconds;
                              return (
                                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/4 last:border-0">
                                  <div className="w-1.5 h-1.5 rounded-full bg-nex-grey/30 flex-shrink-0 mt-2" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`font-inter text-sm font-medium ${eventColor(ev.event_type)}`}>
                                        {eventLabel(ev.event_type)}
                                      </span>
                                      {detail && <span className="font-inter text-nex-grey/60 text-xs truncate">{detail}</span>}
                                      {dur != null && dur > 0 && <span className="font-inter text-nex-grey/40 text-xs ml-auto flex-shrink-0">{fmtDuration(dur)}</span>}
                                    </div>
                                    <p className="font-inter text-nex-grey/40 text-xs mt-0.5">{fmtDate(ev.created_at)} · {new Date(ev.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/6 flex items-center justify-between">
                  <div>
                    <h3 className="font-urbanist text-white font-semibold text-sm">Engagement Leaderboard</h3>
                    <p className="font-inter text-nex-grey/50 text-xs mt-0.5">Ranked by composite score: views × 3, downloads × 5, sessions × 2, folders × 4, logins × 2</p>
                  </div>
                  <span className="font-inter text-nex-grey/60 text-xs">{investorStats.length} investors</span>
                </div>
                {investorStats.length === 0 ? (
                  <p className="font-inter text-nex-grey/50 text-sm px-5 py-10 text-center">No investor activity recorded yet.</p>
                ) : (
                  <div>
                    {sortedByEngagement.map((inv, rank) => {
                      const score = engagementScore(inv);
                      const scorePct = Math.min((score / maxScore) * 100, 100);
                      const isHot = scorePct > 60;
                      const isWarm = scorePct > 25;
                      return (
                        <div key={inv.id} className="px-5 py-4 border-t border-white/4 hover:bg-white/2 transition-colors">
                          <div className="flex items-start gap-3">
                            {/* Rank badge */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-urbanist text-xs font-bold mt-0.5 ${rank === 0 ? 'bg-amber-400/20 text-amber-400' : rank === 1 ? 'bg-nex-grey/20 text-nex-grey' : 'bg-white/5 text-nex-grey/50'}`}>
                              {rank + 1}
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Name + badges */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-inter text-nex-text text-sm font-medium">{inv.name || 'N/A'}</span>
                                {isHot && <span className="font-inter text-xs px-1.5 py-0.5 bg-amber-400/15 text-amber-400 rounded-full border border-amber-400/20">Hot lead</span>}
                                {!isHot && isWarm && <span className="font-inter text-xs px-1.5 py-0.5 bg-sky-400/10 text-sky-400 rounded-full border border-sky-400/20">Warm</span>}
                                {inv.nda_signed && <span className="font-inter text-xs px-1.5 py-0.5 bg-emerald-400/10 text-emerald-400 rounded-full">NDA</span>}
                              </div>

                              {/* Email + last seen */}
                              <div className="flex items-center gap-4 text-xs font-inter text-nex-grey/50 flex-wrap">
                                <span>{inv.email}</span>
                                <span>First login: {fmtDate(inv.first_seen_at)}</span>
                                <span>Last seen: {fmtRelative(inv.last_seen_at)}</span>
                              </div>

                              {/* Metrics row */}
                              <div className="flex items-center gap-4 flex-wrap text-xs font-inter">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-nex-grey/50" /><span className="text-nex-text font-medium">{fmtDuration(inv.total_duration_seconds || null)}</span><span className="text-nex-grey/50">total time</span></span>
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-nex-grey/50" /><span className="text-nex-cyan font-medium">{inv.doc_views}</span><span className="text-nex-grey/50">views</span></span>
                                <span className="flex items-center gap-1"><Download className="w-3 h-3 text-nex-grey/50" /><span className={`font-medium ${inv.doc_downloads > 0 ? 'text-amber-400' : 'text-nex-grey/30'}`}>{inv.doc_downloads}</span><span className="text-nex-grey/50">downloads</span></span>
                                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 text-nex-grey/50" /><span className={`font-medium ${inv.login_count > 1 ? 'text-sky-400' : 'text-nex-grey/30'}`}>{inv.login_count}</span><span className="text-nex-grey/50">logins</span></span>
                                <span className="flex items-center gap-1"><FolderOpen className="w-3 h-3 text-nex-grey/50" /><span className="text-nex-text font-medium">{inv.folders_accessed}/4</span><span className="text-nex-grey/50">folders</span></span>
                              </div>

                              {/* Engagement bar */}
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-white/6 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scorePct}%` }}
                                    transition={{ duration: 0.7, delay: rank * 0.05 }}
                                    className={`h-full rounded-full ${isHot ? 'bg-gradient-to-r from-amber-400 to-amber-400/40' : isWarm ? 'bg-gradient-to-r from-sky-400 to-sky-400/30' : 'bg-gradient-to-r from-nex-grey/40 to-nex-grey/10'}`}
                                  />
                                </div>
                                <span className="font-inter text-xs text-nex-grey/50 w-10 text-right flex-shrink-0">{score} pts</span>
                              </div>
                            </div>

                            {/* Audit trail button */}
                            <button
                              onClick={() => openAuditTrail(inv)}
                              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-nex-grey text-xs font-inter rounded-lg hover:border-nex-cyan/40 hover:text-nex-cyan transition-colors mt-0.5"
                              title="View full audit trail"
                            >
                              <Eye className="w-3 h-3" />
                              Trail
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: Document Intelligence ── */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Content Friction Report */}
              <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/6">
                  <h3 className="font-urbanist text-white font-semibold text-sm">Content Friction Report</h3>
                  <p className="font-inter text-nex-grey/50 text-xs mt-0.5">Ranked by views. High avg-time = compelling or complex. High downloads = committee-sharing.</p>
                </div>
                {topDocs.length === 0 ? (
                  <p className="font-inter text-nex-grey/50 text-sm px-5 py-10 text-center">No document activity yet.</p>
                ) : (
                  <div>
                    <div className="hidden md:grid grid-cols-[1fr_64px_64px_72px_80px_120px] gap-4 px-5 py-2.5 bg-white/3 text-xs font-inter text-nex-grey uppercase tracking-wider">
                      <span>Document</span>
                      <span className="text-center">Views</span>
                      <span className="text-center">Unique</span>
                      <span className="text-center">DLs</span>
                      <span className="text-center">Avg Time</span>
                      <span className="text-right">Interest</span>
                    </div>
                    {topDocs.map((doc, i) => {
                      const maxViews = topDocs[0]?.views ?? 1;
                      return (
                        <div key={doc.name} className="px-5 py-3.5 border-t border-white/4 hover:bg-white/2 transition-colors">
                          <div className="flex md:grid md:grid-cols-[1fr_64px_64px_72px_80px_120px] gap-4 items-center">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="font-inter text-nex-grey/40 text-xs w-4 flex-shrink-0 text-right">{i + 1}</span>
                              <File className="w-3.5 h-3.5 text-nex-grey/40 flex-shrink-0" />
                              <span className="font-inter text-nex-text text-sm truncate">{doc.name}</span>
                            </div>
                            <div className="hidden md:flex justify-center">
                              <span className={`font-inter text-sm font-semibold ${doc.views > 0 ? 'text-nex-cyan' : 'text-nex-grey/30'}`}>{doc.views}</span>
                            </div>
                            <div className="hidden md:flex justify-center">
                              <span className={`font-inter text-sm ${doc.unique_viewers > 0 ? 'text-sky-400' : 'text-nex-grey/30'}`}>{doc.unique_viewers}</span>
                            </div>
                            <div className="hidden md:flex justify-center">
                              <span className={`font-inter text-sm font-medium ${doc.downloads > 0 ? 'text-amber-400' : 'text-nex-grey/30'}`}>{doc.downloads}</span>
                            </div>
                            <div className="hidden md:flex justify-center">
                              <span className="font-inter text-sm text-nex-grey/70">{fmtDuration(doc.avg_duration_seconds)}</span>
                            </div>
                            <div className="hidden md:flex items-center justify-end gap-2">
                              <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(doc.views / maxViews) * 100}%` }}
                                  transition={{ duration: 0.7, delay: i * 0.04 }}
                                  className="h-full bg-nex-cyan rounded-full"
                                />
                              </div>
                            </div>
                            {/* Mobile compact */}
                            <div className="md:hidden flex items-center gap-3 text-xs font-inter flex-shrink-0 ml-auto">
                              <span className="text-nex-cyan font-medium">{doc.views}v</span>
                              {doc.downloads > 0 && <span className="text-amber-400">{doc.downloads}dl</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Unopened docs */}
              {unopenedDocs.length > 0 && (
                <div className="bg-nex-darker/60 border border-amber-400/15 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-urbanist text-white font-semibold text-sm">Unopened Files ({unopenedDocs.length})</h3>
                      <p className="font-inter text-nex-grey/60 text-xs mt-0.5">These documents have not been viewed by any investor. Check for broken links or consider removing irrelevant files.</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {unopenedDocs.map((name) => (
                      <div key={name} className="flex items-center gap-2 px-3 py-2 bg-white/3 rounded-lg">
                        <File className="w-3.5 h-3.5 text-nex-grey/40 flex-shrink-0" />
                        <span className="font-inter text-nex-grey/60 text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download signal callout */}
              {(summary?.total_doc_downloads ?? 0) > 0 && (
                <div className="bg-amber-400/6 border border-amber-400/20 rounded-xl p-4 flex items-start gap-3">
                  <Download className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-inter text-amber-300 text-sm font-semibold">{summary?.total_doc_downloads} download{(summary?.total_doc_downloads ?? 0) !== 1 ? 's' : ''} recorded</p>
                    <p className="font-inter text-nex-grey/60 text-xs mt-0.5">High download activity indicates investors are sharing materials with their investment committee. Follow up promptly.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: Due Diligence Funnel ── */}
          {activeTab === 'funnel' && (
            <div className="space-y-4">
              <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/6">
                  <h3 className="font-urbanist text-white font-semibold text-sm">Due Diligence Progress</h3>
                  <p className="font-inter text-nex-grey/50 text-xs mt-0.5">Which folders each investor has opened. Gaps reveal where they are stuck or disengaged.</p>
                </div>
                {investorStats.length === 0 ? (
                  <p className="font-inter text-nex-grey/50 text-sm px-5 py-10 text-center">No investor activity yet.</p>
                ) : (
                  <div>
                    {sortedByEngagement.map((inv) => {
                      const totalFolders = 4;
                      const completedFolders = inv.folder_completion.filter((f) => f.docs_viewed > 0).length;
                      const completionPct = Math.round((completedFolders / totalFolders) * 100);
                      return (
                        <div key={inv.id} className="px-5 py-4 border-t border-white/4 first:border-t-0 hover:bg-white/2 transition-colors">
                          {/* Investor identity */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-nex-cyan/15 border border-nex-cyan/20 flex items-center justify-center flex-shrink-0">
                                <span className="font-urbanist text-nex-cyan text-xs font-bold">
                                  {(inv.name || inv.email).slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-inter text-nex-text text-sm font-medium truncate">{inv.name || inv.email}</p>
                                <p className="font-inter text-nex-grey/50 text-xs truncate">{inv.email}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-4 text-right">
                              <p className={`font-urbanist text-lg font-bold ${completionPct > 75 ? 'text-emerald-400' : completionPct > 25 ? 'text-sky-400' : 'text-nex-grey/40'}`}>{completionPct}%</p>
                              <p className="font-inter text-nex-grey/50 text-xs">{completedFolders}/{totalFolders} folders</p>
                            </div>
                          </div>

                          {/* Folder bars */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(Object.entries(FOLDER_LABELS) as [string, { label: string; total: number; color: string }][]).map(([key, meta]) => {
                              const fc = inv.folder_completion.find((f) => f.folder === key);
                              const viewed = fc?.docs_viewed ?? 0;
                              const pct = Math.min((viewed / meta.total) * 100, 100);
                              const touched = viewed > 0;
                              return (
                                <div key={key} className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-inter text-xs text-nex-grey/60">{meta.label}</span>
                                    <span className={`font-inter text-xs font-medium ${touched ? 'text-nex-text' : 'text-nex-grey/30'}`}>{viewed}/{meta.total}</span>
                                  </div>
                                  <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.6 }}
                                      className={`h-full rounded-full ${touched ? meta.color : 'bg-white/5'}`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Red flag detection */}
                          {completedFolders === 0 && inv.login_count > 0 && (
                            <div className="mt-3 flex items-center gap-2 text-xs font-inter text-amber-400/80 bg-amber-400/6 border border-amber-400/15 rounded-lg px-3 py-2">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              Logged in but opened no folders. May need outreach.
                            </div>
                          )}
                          {inv.folder_completion.find((f) => f.folder === 'legal' && f.docs_viewed > 0) &&
                            inv.folder_completion.find((f) => f.folder === 'traction' && f.docs_viewed === 0) && (
                            <div className="mt-3 flex items-center gap-2 text-xs font-inter text-sky-400/80 bg-sky-400/6 border border-sky-400/15 rounded-lg px-3 py-2">
                              <TrendingUp className="w-3 h-3 flex-shrink-0" />
                              Reviewing legal but hasn't reached Traction. Consider sharing traction highlights proactively.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: Settings ── */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-nex-darker/60 border border-white/8 rounded-xl divide-y divide-white/6">

                {/* Granular tracking */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-inter text-nex-text text-sm font-medium">Granular Tracking</p>
                      <p className="font-inter text-nex-grey/60 text-xs mt-1">Record every document open, folder click, and navigation event. Disable to track sessions only.</p>
                    </div>
                    <button
                      onClick={() => setLocalGranular((v) => !v)}
                      className={`relative flex-shrink-0 w-10 h-5.5 rounded-full transition-colors ${localGranular ? 'bg-nex-cyan' : 'bg-white/15'}`}
                      style={{ height: '22px', minWidth: '40px' }}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${localGranular ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                {/* First login alert */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <p className="font-inter text-nex-text text-sm font-medium">Instant Login Alert</p>
                      <p className="font-inter text-nex-grey/60 text-xs mt-1">Receive an email the moment an investor logs in for the first time. Know exactly when they start their evaluation.</p>
                    </div>
                    <button
                      onClick={() => setLocalAlertEnabled((v) => !v)}
                      className={`relative flex-shrink-0 w-10 rounded-full transition-colors ${localAlertEnabled ? 'bg-nex-cyan' : 'bg-white/15'}`}
                      style={{ height: '22px', minWidth: '40px' }}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${localAlertEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {localAlertEnabled && (
                    <div className="space-y-1.5">
                      <label className="font-inter text-xs text-nex-grey/60 uppercase tracking-wider">Alert email address</label>
                      <input
                        type="email"
                        value={localAlertEmail}
                        onChange={(e) => setLocalAlertEmail(e.target.value)}
                        className="w-full max-w-sm bg-nex-dark border border-white/12 rounded-xl px-3 py-2 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>

                {/* Dynamic watermarking — informational */}
                <div className="px-5 py-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-nex-grey/50 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-inter text-nex-grey text-sm font-medium">Dynamic Watermarking</p>
                      <p className="font-inter text-nex-grey/50 text-xs mt-1">Automated watermarks containing the viewer's email and IP address on all PDFs. Configure in your document hosting platform (Google Drive / Docsend).</p>
                    </div>
                  </div>
                </div>

                {/* Download permissions — informational */}
                <div className="px-5 py-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-nex-grey/50 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-inter text-nex-grey text-sm font-medium">Download Permissions</p>
                      <p className="font-inter text-nex-grey/50 text-xs mt-1">Restrict downloading on highly sensitive files to force on-screen viewing. Set via Google Drive share settings on individual documents.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={saveSettings}
                  disabled={savingSettings}
                  className="flex items-center gap-2 px-5 py-2.5 bg-nex-cyan text-nex-dark font-inter text-sm font-semibold rounded-xl hover:shadow-glow-cyan transition-all disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {savingSettings ? 'Saving…' : 'Save Settings'}
                </button>
                {settingsSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-inter text-sm text-emerald-400"
                  >
                    Settings saved
                  </motion.span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Team / Investor Access Management ───────────────────────────────────────

interface InvestorAccessRecord {
  id: string;
  email: string;
  name: string;
  token: string;
  status: 'pending' | 'approved' | 'revoked';
  nda_signed: boolean;
  access_level: number;
  notes: string;
  last_seen_at: string | null;
  first_seen_at: string | null;
  activated_at: string | null;
  created_at: string;
  expires_at: string | null;
}

interface BriefRequest {
  id: string;
  name: string;
  email: string;
  organisation: string | null;
  phone: string | null;
  referral_source: string | null;
  created_at: string;
  invited_at: string | null;
  dismissed_at: string | null;
  investor_id: string | null;
}

function TeamPage({ token }: { token: string }) {
  const [investors, setInvestors] = useState<InvestorAccessRecord[]>([]);
  const [briefRequests, setBriefRequests] = useState<BriefRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'active' | 'all' | 'archive'>('pipeline');

  // Invite form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteOrg, setInviteOrg] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteReferral, setInviteReferral] = useState('');
  const [inviteNotes, setInviteNotes] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Per-row action state
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [listRes, briefRes] = await Promise.all([
      fetch(`${FN_BASE}/admin/list`, { headers: { Authorization: `Bearer ${token}`, Apikey: ANON_KEY } }),
      fetch(`${FN_BASE}/admin/brief-requests`, { headers: { Authorization: `Bearer ${token}`, Apikey: ANON_KEY } }),
    ]);
    if (listRes.ok) { const j = await listRes.json(); setInvestors(j.investors ?? []); }
    if (briefRes.ok) { const j = await briefRes.json(); setBriefRequests(j.requests ?? []); }
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const fmtDate = (iso: string | null) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const fmtRelative = (iso: string | null) => {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return fmtDate(iso);
  };

  const handleApprove = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    await fetch(`${FN_BASE}/admin/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ id }),
    });
    setActionLoading((p) => ({ ...p, [id]: false }));
    load();
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this investor\'s access? They will no longer be able to log in.')) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    await fetch(`${FN_BASE}/admin/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ id }),
    });
    setActionLoading((p) => ({ ...p, [id]: false }));
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this investor record? This cannot be undone.')) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    await fetch(`${FN_BASE}/admin/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ id }),
    });
    setActionLoading((p) => ({ ...p, [id]: false }));
    load();
  };

  const handleDismissBrief = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    await fetch(`${FN_BASE}/admin/brief-requests/dismiss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ id }),
    });
    setActionLoading((p) => ({ ...p, [id]: false }));
    load();
  };

  const handleDeleteBrief = async (id: string) => {
    if (!confirm('Permanently delete this request record?')) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    await fetch(`${FN_BASE}/admin/brief-requests`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ id }),
    });
    setActionLoading((p) => ({ ...p, [id]: false }));
    load();
  };

  const handleCopyLink = (invToken: string, id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/investor-data-room?token=${invToken}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopyFeedback((p) => ({ ...p, [id]: false })), 2000);
  };

  const openInviteFromBrief = (req: BriefRequest) => {
    setInviteName(req.name);
    setInviteEmail(req.email);
    setInviteOrg(req.organisation ?? '');
    setInvitePhone(req.phone ?? '');
    setInviteReferral(req.referral_source ?? '');
    setInviteNotes('');
    setInviteResult(null);
    setShowInvite(true);
  };

  const resetInviteForm = () => {
    setInviteName('');
    setInviteEmail('');
    setInviteOrg('');
    setInvitePhone('');
    setInviteReferral('');
    setInviteNotes('');
    setInviteResult(null);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviting(true);
    setInviteResult(null);
    const res = await fetch(`${FN_BASE}/admin/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({
        name: inviteName.trim(),
        email: inviteEmail.trim().toLowerCase(),
        organisation: inviteOrg.trim() || null,
        phone: invitePhone.trim() || null,
        referral_source: inviteReferral.trim() || null,
        notes: inviteNotes.trim(),
      }),
    });
    const json = await res.json();
    setInviting(false);
    if (res.ok) {
      setInviteResult({ ok: true, msg: json.email_sent ? `Invite sent to ${inviteEmail}.` : `Record created. Email will be sent once DNS is active.` });
      resetInviteForm();
      load();
    } else {
      setInviteResult({ ok: false, msg: json.error ?? 'Something went wrong.' });
    }
  };

  const statusBadge = (status: InvestorAccessRecord['status']) => {
    if (status === 'approved') return <span className="flex items-center gap-1 font-inter text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" />Active</span>;
    if (status === 'revoked') return <span className="flex items-center gap-1 font-inter text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full"><X className="w-3 h-3" />Revoked</span>;
    return <span className="flex items-center gap-1 font-inter text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" />Pending</span>;
  };

  const displayStatusBadge = (inv: InvestorAccessRecord) => {
    const ds = investorDisplayStatus(inv);
    if (ds === 'active') return (
      <span className="flex items-center gap-1 font-inter text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" />Active
      </span>
    );
    if (ds === 'expired') return (
      <span className="flex items-center gap-1 font-inter text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
        <AlertCircle className="w-3 h-3" />Expired
      </span>
    );
    if (ds === 'revoked') return (
      <span className="flex items-center gap-1 font-inter text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
        <X className="w-3 h-3" />Terminated
      </span>
    );
    return (
      <span className="flex items-center gap-1 font-inter text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
        <Send className="w-3 h-3" />Invited
      </span>
    );
  };

  // Derive display status for each investor record
  const investorDisplayStatus = (inv: InvestorAccessRecord): 'active' | 'expired' | 'revoked' | 'invited' => {
    if (inv.status === 'revoked') return 'revoked';
    if (inv.activated_at) return 'active';
    if (inv.expires_at && new Date(inv.expires_at) < new Date()) return 'expired';
    return 'invited';
  };

  // Data splits
  const pendingBriefs = briefRequests.filter((r) => !r.dismissed_at && !r.invited_at);
  const respondedBriefs = briefRequests.filter((r) => r.invited_at || r.dismissed_at);
  const approved = investors.filter((i) => i.status === 'approved');
  const others = investors.filter((i) => i.status !== 'approved');

  const pipelineCount = pendingBriefs.length;
  const activeCount = approved.length;
  const archiveCount = respondedBriefs.length + others.length;

  const tabs = [
    { id: 'pipeline' as const, label: 'Request Queue', count: pipelineCount, dot: pipelineCount > 0 },
    { id: 'active' as const, label: 'Active Investors', count: activeCount, dot: false },
    { id: 'all' as const, label: 'All Requestors', count: investors.length, dot: false },
    { id: 'archive' as const, label: 'History', count: archiveCount, dot: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-urbanist text-2xl font-bold text-white mb-1">Investor Access</h1>
          <p className="font-inter text-nex-grey text-sm">
            Manage investor brief requests and data room access from one place.
          </p>
        </div>
        <button
          onClick={() => { setShowInvite(true); resetInviteForm(); }}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-nex-cyan text-nex-dark font-inter text-sm font-semibold rounded-xl hover:shadow-glow-cyan transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Invite Investor
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-nex-darker/60 border border-white/8 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-inter text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-nex-dark text-white shadow-sm'
                : 'text-nex-grey hover:text-nex-text'
            }`}
          >
            {tab.label}
            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full font-inter text-xs font-semibold ${
              activeTab === tab.id
                ? tab.dot ? 'bg-amber-400 text-nex-dark' : 'bg-white/12 text-nex-grey'
                : tab.dot ? 'bg-amber-400/80 text-nex-dark' : 'bg-white/6 text-nex-grey/50'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 text-nex-cyan animate-spin" />
        </div>
      ) : (
        <>
          {/* ── PIPELINE TAB ─────────────────────────────────────────────── */}
          {activeTab === 'pipeline' && (
            <div className="space-y-3">
              {pendingBriefs.length === 0 ? (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-10 text-center">
                  <Mail className="w-8 h-8 text-nex-grey/30 mx-auto mb-3" />
                  <p className="font-inter text-nex-grey/60 text-sm">No pending brief requests.</p>
                </div>
              ) : (
                <div className="bg-nex-darker/60 border border-amber-400/20 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-amber-400/5 border-b border-amber-400/15 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-inter text-amber-400 text-xs uppercase tracking-wider">Awaiting Response</span>
                    </div>
                    <span className="font-inter text-amber-400/60 text-xs">{pendingBriefs.length} pending</span>
                  </div>
                  {pendingBriefs.map((req) => (
                    <div key={req.id} className="px-5 py-4 border-t border-white/4 hover:bg-white/2 transition-colors first:border-t-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-urbanist text-amber-400 text-xs font-bold">
                            {(req.name || req.email).slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-sm text-nex-text font-medium truncate">{req.name}</p>
                          <p className="font-inter text-xs text-nex-grey/70 truncate">{req.email}</p>
                          {(req.organisation || req.phone) && (
                            <p className="font-inter text-xs text-nex-grey/50 truncate mt-0.5">
                              {[req.organisation, req.phone].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {req.referral_source && (
                            <p className="font-inter text-xs text-nex-cyan/50 truncate mt-0.5">via {req.referral_source}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="font-inter text-xs text-nex-grey/40 mr-1">{fmtDate(req.created_at)}</span>
                          <button
                            onClick={() => openInviteFromBrief(req)}
                            className="flex items-center gap-1.5 font-inter text-xs font-semibold px-3 py-1.5 bg-nex-cyan/10 border border-nex-cyan/40 text-nex-cyan rounded-lg hover:bg-nex-cyan/20 hover:border-nex-cyan transition-all"
                          >
                            <Send className="w-3 h-3" />
                            Send Invite
                          </button>
                          <button
                            onClick={() => handleDismissBrief(req.id)}
                            disabled={actionLoading[req.id]}
                            title="Dismiss (moves to History)"
                            className="p-1.5 text-nex-grey/40 hover:text-nex-grey transition-colors rounded-lg hover:bg-white/5 disabled:opacity-40"
                          >
                            {actionLoading[req.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ACTIVE INVESTORS TAB ─────────────────────────────────────── */}
          {activeTab === 'active' && (
            <div className="space-y-3">
              {approved.length === 0 ? (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-10 text-center">
                  <Users className="w-8 h-8 text-nex-grey/30 mx-auto mb-3" />
                  <p className="font-inter text-nex-grey/60 text-sm">No active investors yet. Use the Invite button to get started.</p>
                </div>
              ) : (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-white/3 border-b border-white/6 flex items-center justify-between">
                    <span className="font-inter text-nex-grey text-xs uppercase tracking-wider">Active Investors</span>
                    <span className="font-inter text-nex-grey/50 text-xs">{approved.length}</span>
                  </div>
                  {approved.map((inv) => (
                    <div key={inv.id} className="px-5 py-4 border-t border-white/4 hover:bg-white/2 transition-colors first:border-t-0">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-nex-cyan/15 border border-nex-cyan/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="font-urbanist text-nex-cyan text-xs font-bold">
                            {(inv.name || inv.email).slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-inter text-nex-text text-sm font-medium">{inv.name || 'N/A'}</span>
                            {inv.nda_signed && <span className="font-inter text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">NDA signed</span>}
                            {statusBadge(inv.status)}
                          </div>
                          <div className="flex items-center gap-1.5 text-nex-grey/60 text-xs font-inter">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{inv.email}</span>
                          </div>
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs font-inter text-nex-grey/50">
                            <span>Invited {fmtDate(inv.created_at)}</span>
                            <span className={inv.last_seen_at ? 'text-emerald-400/70' : ''}>Last seen: {fmtRelative(inv.last_seen_at)}</span>
                            {inv.notes && <span className="italic truncate max-w-xs">{inv.notes}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                          <button
                            onClick={() => handleCopyLink(inv.token, inv.id)}
                            title="Copy access link"
                            className="p-2 text-nex-grey/50 hover:text-nex-cyan transition-colors rounded-lg hover:bg-nex-cyan/10"
                          >
                            {copyFeedback[inv.id] ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            disabled={actionLoading[inv.id]}
                            title="Revoke access"
                            className="p-2 text-nex-grey/50 hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/10 disabled:opacity-40"
                          >
                            {actionLoading[inv.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(inv.id)}
                            disabled={actionLoading[inv.id]}
                            title="Delete permanently"
                            className="p-2 text-nex-grey/50 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ALL REQUESTORS TAB ──────────────────────────────────────── */}
          {activeTab === 'all' && (
            <div className="space-y-3">
              {investors.length === 0 ? (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-10 text-center">
                  <Users className="w-8 h-8 text-nex-grey/30 mx-auto mb-3" />
                  <p className="font-inter text-nex-grey/60 text-sm">No investors invited yet.</p>
                </div>
              ) : (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                  {/* Table header */}
                  <div className="px-5 py-3 bg-white/3 border-b border-white/6 grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center">
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Investor</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Invited</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Activated</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Status</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Actions</span>
                  </div>
                  {investors.map((inv) => {
                    const ds = investorDisplayStatus(inv);
                    const isActive = ds === 'active';
                    return (
                      <div key={inv.id} className="px-5 py-4 border-t border-white/4 hover:bg-white/2 transition-colors first:border-t-0 grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center">
                        {/* Investor info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-nex-cyan/15 border border-nex-cyan/25' : 'bg-white/6 border border-white/10'
                          }`}>
                            <span className={`font-urbanist text-xs font-bold ${isActive ? 'text-nex-cyan' : 'text-nex-grey'}`}>
                              {(inv.name || inv.email).slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-inter text-sm text-nex-text font-medium truncate">{inv.name || 'N/A'}</p>
                            <p className="font-inter text-xs text-nex-grey/60 truncate">{inv.email}</p>
                            {inv.last_seen_at && (
                              <p className="font-inter text-xs text-emerald-400/70 truncate">Last seen {fmtRelative(inv.last_seen_at)}</p>
                            )}
                          </div>
                        </div>
                        {/* Invited date */}
                        <span className="font-inter text-xs text-nex-grey/50 whitespace-nowrap">{fmtDate(inv.created_at)}</span>
                        {/* Activated date */}
                        <span className={`font-inter text-xs whitespace-nowrap ${inv.activated_at ? 'text-emerald-400/80' : 'text-nex-grey/30'}`}>
                          {inv.activated_at ? fmtDate(inv.activated_at) : 'N/A'}
                        </span>
                        {/* Status badge */}
                        <div>{displayStatusBadge(inv)}</div>
                        {/* Actions */}
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => handleCopyLink(inv.token, `all-${inv.id}`)}
                            title="Copy access link"
                            className="p-1.5 text-nex-grey/40 hover:text-nex-cyan transition-colors rounded-lg hover:bg-nex-cyan/10"
                          >
                            {copyFeedback[`all-${inv.id}`] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                          </button>
                          {isActive && (
                            <button
                              onClick={() => handleRevoke(inv.id)}
                              disabled={actionLoading[inv.id]}
                              title="Terminate access"
                              className="flex items-center gap-1 px-2.5 py-1 font-inter text-xs font-medium text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg hover:bg-red-400/15 hover:border-red-400/40 transition-all disabled:opacity-40"
                            >
                              {actionLoading[inv.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
                              Terminate
                            </button>
                          )}
                          {ds === 'revoked' && (
                            <button
                              onClick={() => handleApprove(inv.id)}
                              disabled={actionLoading[inv.id]}
                              title="Restore access"
                              className="flex items-center gap-1 px-2.5 py-1 font-inter text-xs font-medium text-sky-400 bg-sky-400/8 border border-sky-400/20 rounded-lg hover:bg-sky-400/15 transition-all disabled:opacity-40"
                            >
                              {actionLoading[inv.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                              Restore
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(inv.id)}
                            disabled={actionLoading[inv.id]}
                            title="Delete permanently"
                            className="p-1.5 text-nex-grey/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY / ARCHIVE TAB ────────────────────────────────────── */}
          {activeTab === 'archive' && (
            <div className="space-y-4">
              {/* Responded brief requests */}
              {respondedBriefs.length > 0 && (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-white/3 border-b border-white/6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Archive className="w-3.5 h-3.5 text-nex-grey" />
                      <span className="font-inter text-nex-grey text-xs uppercase tracking-wider">Brief Request Log</span>
                    </div>
                    <span className="font-inter text-nex-grey/50 text-xs">{respondedBriefs.length} records</span>
                  </div>
                  {/* Table header */}
                  <div className="px-5 py-2 border-b border-white/4 grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center">
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Contact</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Requested</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Invited</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Status</span>
                    <span className="font-inter text-nex-grey/50 text-xs uppercase tracking-wider">Link</span>
                    <span></span>
                  </div>
                  {respondedBriefs.map((req) => {
                    const matchedInvestor = req.investor_id ? investors.find((i) => i.id === req.investor_id) : investors.find((i) => i.email.toLowerCase() === req.email.toLowerCase());
                    const activated = matchedInvestor?.activated_at != null;
                    return (
                      <div key={req.id} className="px-5 py-3.5 border-t border-white/4 hover:bg-white/2 transition-colors first:border-t-0 grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center">
                        <div className="min-w-0">
                          <p className="font-inter text-sm text-nex-text font-medium truncate">{req.name}</p>
                          <p className="font-inter text-xs text-nex-grey/60 truncate">{req.email}</p>
                        </div>
                        <span className="font-inter text-xs text-nex-grey/50">{fmtDate(req.created_at)}</span>
                        <span className="font-inter text-xs text-nex-grey/50">{req.invited_at ? fmtDate(req.invited_at) : 'N/A'}</span>
                        <div>
                          {req.dismissed_at && !req.invited_at ? (
                            <span className="flex items-center gap-1 font-inter text-xs text-nex-grey/50 bg-white/5 px-2 py-0.5 rounded-full">
                              <Archive className="w-3 h-3" />Dismissed
                            </span>
                          ) : activated ? (
                            <span className="flex items-center gap-1 font-inter text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />Activated
                            </span>
                          ) : req.invited_at ? (
                            <span className="flex items-center gap-1 font-inter text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
                              <Send className="w-3 h-3" />Invited
                            </span>
                          ) : null}
                        </div>
                        <div>
                          {matchedInvestor ? (
                            <button
                              onClick={() => handleCopyLink(matchedInvestor.token, `brief-${req.id}`)}
                              title="Copy personal access link"
                              className="p-1.5 text-nex-grey/40 hover:text-nex-cyan transition-colors rounded-lg hover:bg-nex-cyan/10"
                            >
                              {copyFeedback[`brief-${req.id}`] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                            </button>
                          ) : <span className="w-6" />}
                        </div>
                        <button
                          onClick={() => handleDeleteBrief(req.id)}
                          disabled={actionLoading[req.id]}
                          title="Delete record"
                          className="p-1.5 text-nex-grey/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                        >
                          {actionLoading[req.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Revoked / pending investors */}
              {others.length > 0 && (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-white/3 border-b border-white/6 flex items-center justify-between">
                    <span className="font-inter text-nex-grey text-xs uppercase tracking-wider">Pending / Revoked Access</span>
                    <span className="font-inter text-nex-grey/50 text-xs">{others.length}</span>
                  </div>
                  {others.map((inv) => (
                    <div key={inv.id} className="px-5 py-4 border-t border-white/4 hover:bg-white/2 transition-colors first:border-t-0 opacity-70">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="font-urbanist text-nex-grey text-xs font-bold">
                            {(inv.name || inv.email).slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-inter text-nex-text text-sm font-medium">{inv.name || 'N/A'}</span>
                            {statusBadge(inv.status)}
                          </div>
                          <div className="flex items-center gap-1.5 text-nex-grey/60 text-xs font-inter">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{inv.email}</span>
                          </div>
                          <span className="font-inter text-nex-grey/40 text-xs">Added {fmtDate(inv.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                          {(inv.status === 'pending' || inv.status === 'revoked') && (
                            <button
                              onClick={() => handleApprove(inv.id)}
                              disabled={actionLoading[inv.id]}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-400/10 border border-sky-400/25 text-sky-400 text-xs font-inter rounded-lg hover:bg-sky-400/20 transition-colors disabled:opacity-40"
                            >
                              {actionLoading[inv.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                              Restore
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(inv.id)}
                            disabled={actionLoading[inv.id]}
                            title="Delete permanently"
                            className="p-2 text-nex-grey/50 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {respondedBriefs.length === 0 && others.length === 0 && (
                <div className="bg-nex-darker/60 border border-white/8 rounded-xl p-10 text-center">
                  <Archive className="w-8 h-8 text-nex-grey/30 mx-auto mb-3" />
                  <p className="font-inter text-nex-grey/60 text-sm">No history yet.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Refresh */}
      <button onClick={load} className="flex items-center gap-1.5 font-inter text-xs text-nex-grey/50 hover:text-nex-grey transition-colors">
        <RefreshCw className="w-3 h-3" />
        Refresh
      </button>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowInvite(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-nex-darker border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-urbanist text-white text-lg font-bold">Invite Investor</h2>
                  <p className="font-inter text-nex-grey text-xs mt-0.5">A personal access link will be emailed directly to them.</p>
                </div>
                <button onClick={() => setShowInvite(false)} className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Salim Ismail"
                    required
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="investor@fund.com"
                    required
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Organisation <span className="normal-case text-nex-grey/50">(optional)</span></label>
                  <input
                    type="text"
                    value={inviteOrg}
                    onChange={(e) => setInviteOrg(e.target.value)}
                    placeholder="Fund / Firm"
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Phone <span className="normal-case text-nex-grey/50">(optional)</span></label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+64 ..."
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">How Do You Know Us? <span className="normal-case text-nex-grey/50">(optional)</span></label>
                  <select
                    value={inviteReferral}
                    onChange={(e) => setInviteReferral(e.target.value)}
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text focus:border-nex-cyan focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Select a source…</option>
                    <option value="Word of Mouth">Word of Mouth</option>
                    <option value="Email from Us">Email from Us</option>
                    <option value="Social Media">Social Media</option>
                    <option value="News / Press / Interview">News / Press / Interview</option>
                    <option value="Events">Events</option>
                    <option value="Direct Outreach">Direct Outreach</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Internal Notes <span className="normal-case text-nex-grey/50">(optional)</span></label>
                  <input
                    type="text"
                    value={inviteNotes}
                    onChange={(e) => setInviteNotes(e.target.value)}
                    placeholder="e.g. Met at SaaStr, warm intro via John"
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>

                {inviteResult && (
                  <div className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-sm font-inter ${inviteResult.ok ? 'bg-emerald-400/10 border border-emerald-400/25 text-emerald-300' : 'bg-red-400/10 border border-red-400/25 text-red-300'}`}>
                    {inviteResult.ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    {inviteResult.msg}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowInvite(false)}
                    className="flex-1 font-inter text-sm px-4 py-2.5 border border-white/12 text-nex-grey rounded-xl hover:border-white/25 hover:text-nex-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 flex items-center justify-center gap-2 font-inter text-sm font-semibold px-4 py-2.5 bg-nex-cyan text-nex-dark rounded-xl hover:shadow-glow-cyan disabled:opacity-50 transition-all"
                  >
                    {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {inviting ? 'Sending…' : 'Send Invite'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ─── Admins Page ─────────────────────────────────────────────────────────────

function AdminsPage({ token }: { token: string }) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassphraseAdd, setNewPassphraseAdd] = useState('');
  const [confirmPassphraseAdd, setConfirmPassphraseAdd] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Set-passphrase modal
  const [passphraseTarget, setPassphraseTarget] = useState<AdminUser | null>(null);
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [settingPassphrase, setSettingPassphrase] = useState(false);
  const [passphraseError, setPassphraseError] = useState('');
  const [passphraseSuccess, setPassphraseSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${FN_BASE}/admin/admins`, {
      headers: { Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
    });
    if (res.ok) {
      const json = await res.json();
      setAdmins(json.admins ?? []);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    const email = newEmail.trim().toLowerCase();
    if (!name || !email) { setAddError('Name and email are required.'); return; }
    if (newPassphraseAdd.length < 10) { setAddError('Passphrase must be at least 10 characters.'); return; }
    if (newPassphraseAdd !== confirmPassphraseAdd) { setAddError('Passphrases do not match.'); return; }
    setAdding(true);
    setAddError('');
    const res = await fetch(`${FN_BASE}/admin/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ name, email, passphrase: newPassphraseAdd }),
    });
    const json = await res.json();
    setAdding(false);
    if (!res.ok) { setAddError(json.error ?? 'Something went wrong.'); return; }
    setNewName('');
    setNewEmail('');
    setNewPassphraseAdd('');
    setConfirmPassphraseAdd('');
    setShowAdd(false);
    load();
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Remove admin access for ${admin.name}? They will no longer be able to log in.`)) return;
    setDeletingId(admin.id);
    await fetch(`${FN_BASE}/admin/admins`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ id: admin.id }),
    });
    setDeletingId(null);
    load();
  };

  const handleSetPassphrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphraseTarget) return;
    if (newPassphrase.length < 10) { setPassphraseError('Passphrase must be at least 10 characters.'); return; }
    if (newPassphrase !== confirmPassphrase) { setPassphraseError('Passphrases do not match.'); return; }
    setSettingPassphrase(true);
    setPassphraseError('');
    const res = await fetch(`${FN_BASE}/admin/admins/set-passphrase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
      body: JSON.stringify({ admin_id: passphraseTarget.id, passphrase: newPassphrase }),
    });
    const json = await res.json();
    setSettingPassphrase(false);
    if (!res.ok) { setPassphraseError(json.error ?? 'Failed to set passphrase.'); return; }
    setPassphraseSuccess(true);
    setTimeout(() => {
      setPassphraseTarget(null);
      setNewPassphrase('');
      setConfirmPassphrase('');
      setPassphraseSuccess(false);
    }, 1500);
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-urbanist text-2xl font-bold text-white mb-1">Admin Access</h1>
          <p className="font-inter text-nex-grey text-sm">
            Manage admin accounts. Each admin requires an email and passphrase to log in.
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setAddError(''); setNewName(''); setNewEmail(''); setNewPassphraseAdd(''); setConfirmPassphraseAdd(''); }}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-nex-cyan text-nex-dark font-inter text-sm font-semibold rounded-xl hover:shadow-glow-cyan transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <div className="bg-sky-900/20 border border-sky-500/25 rounded-xl px-4 py-3 text-xs text-sky-300/80">
        <span className="font-semibold text-sky-200">How to log in as admin: </span>
        Navigate to the data room and append <span className="font-mono">?admin=true</span> to the URL, then enter your email and passphrase.
        <span className="ml-2 font-semibold text-sky-200">New admins</span> must have a passphrase set before they can log in. Use the key icon on their row.
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-nex-darker border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-urbanist text-white text-lg font-bold">Add Admin</h2>
                  <p className="font-inter text-nex-grey text-xs mt-0.5">They can log in immediately with the passphrase you set.</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jane Smith"
                    required
                    autoFocus
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Passphrase *</label>
                  <input
                    type="password"
                    value={newPassphraseAdd}
                    onChange={(e) => { setNewPassphraseAdd(e.target.value); setAddError(''); }}
                    placeholder="Minimum 10 characters"
                    autoComplete="new-password"
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Confirm Passphrase *</label>
                  <input
                    type="password"
                    value={confirmPassphraseAdd}
                    onChange={(e) => { setConfirmPassphraseAdd(e.target.value); setAddError(''); }}
                    placeholder="Repeat passphrase"
                    autoComplete="new-password"
                    className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                  />
                </div>

                {addError && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-sm font-inter bg-red-400/10 border border-red-400/25 text-red-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {addError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2.5 border border-white/12 text-nex-grey font-inter text-sm rounded-xl hover:border-white/25 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-nex-cyan text-nex-dark font-urbanist font-bold text-sm rounded-xl hover:shadow-glow-cyan transition-all disabled:opacity-60"
                  >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    {adding ? 'Adding…' : 'Add Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Set Passphrase Modal */}
      <AnimatePresence>
        {passphraseTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setPassphraseTarget(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-nex-darker border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-urbanist text-white text-lg font-bold">Set Passphrase</h2>
                  <p className="font-inter text-nex-grey text-xs mt-0.5">For <span className="text-white">{passphraseTarget.name}</span></p>
                </div>
                <button onClick={() => setPassphraseTarget(null)} className="p-1.5 text-nex-grey/50 hover:text-nex-grey rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passphraseSuccess ? (
                <div className="flex items-center gap-3 py-6 justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-inter text-sm font-medium">Passphrase updated successfully.</span>
                </div>
              ) : (
                <form onSubmit={handleSetPassphrase} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">New Passphrase *</label>
                    <input
                      type="password"
                      value={newPassphrase}
                      onChange={(e) => { setNewPassphrase(e.target.value); setPassphraseError(''); }}
                      placeholder="Minimum 10 characters"
                      autoFocus
                      autoComplete="new-password"
                      className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-inter text-xs text-nex-grey uppercase tracking-wider">Confirm Passphrase *</label>
                    <input
                      type="password"
                      value={confirmPassphrase}
                      onChange={(e) => { setConfirmPassphrase(e.target.value); setPassphraseError(''); }}
                      placeholder="Repeat passphrase"
                      autoComplete="new-password"
                      className="w-full bg-nex-dark border border-white/12 rounded-xl px-4 py-2.5 font-inter text-sm text-nex-text placeholder-nex-grey/40 focus:border-nex-cyan focus:outline-none transition-colors"
                    />
                  </div>

                  {passphraseError && (
                    <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-sm font-inter bg-red-400/10 border border-red-400/25 text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {passphraseError}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setPassphraseTarget(null)}
                      className="flex-1 py-2.5 border border-white/12 text-nex-grey font-inter text-sm rounded-xl hover:border-white/25 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={settingPassphrase}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-nex-cyan text-nex-dark font-urbanist font-bold text-sm rounded-xl hover:shadow-glow-cyan transition-all disabled:opacity-60"
                    >
                      {settingPassphrase ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      {settingPassphrase ? 'Saving…' : 'Save Passphrase'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin list */}
      <div className="bg-nex-darker/60 border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-nex-cyan animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldCheck className="w-8 h-8 text-nex-grey/30 mb-3" />
            <p className="font-inter text-nex-grey text-sm">No admins configured.</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1fr_140px_80px] gap-4 px-5 py-2.5 bg-white/3 text-xs font-inter text-nex-grey uppercase tracking-wider border-b border-white/6">
              <span>Name</span>
              <span>Email</span>
              <span>Added</span>
              <span />
            </div>
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex sm:grid sm:grid-cols-[1fr_1fr_140px_80px] gap-4 items-center px-5 py-4 border-t border-white/4 first:border-t-0 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-nex-cyan/15 border border-nex-cyan/25 flex items-center justify-center flex-shrink-0">
                    <span className="font-urbanist text-nex-cyan text-[10px] font-bold">
                      {admin.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <p className="font-inter text-nex-text text-sm font-medium truncate">{admin.name}</p>
                </div>
                <p className="hidden sm:block font-inter text-nex-grey text-sm truncate">{admin.email}</p>
                <p className="hidden sm:block font-inter text-nex-grey/60 text-xs">{fmtDate(admin.created_at)}</p>
                <div className="ml-auto sm:ml-0 flex justify-end gap-1">
                  <button
                    onClick={() => { setPassphraseTarget(admin); setNewPassphrase(''); setConfirmPassphrase(''); setPassphraseError(''); setPassphraseSuccess(false); }}
                    className="p-1.5 text-nex-grey/30 hover:text-nex-cyan transition-colors rounded-lg hover:bg-nex-cyan/10"
                    title="Set passphrase"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(admin)}
                    disabled={deletingId === admin.id}
                    className="p-1.5 text-nex-grey/30 hover:text-red-400 disabled:opacity-40 transition-colors rounded-lg hover:bg-red-400/10"
                    title="Remove admin"
                  >
                    {deletingId === admin.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <button onClick={load} className="flex items-center gap-1.5 font-inter text-xs text-nex-grey/50 hover:text-nex-grey transition-colors">
        <RefreshCw className="w-3 h-3" />
        Refresh list
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvestorDataRoom() {
  const [investor, setInvestor] = useState<InvestorRecord | null>(null);
  const [token, setToken] = useState('');
  const [docs, setDocs] = useState<InvestorDoc[]>([]);
  const [folderLabels, setFolderLabels] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(STATIC_FOLDER_META).map(([k, v]) => [k, v.label]))
  );
  const [allFolders, setAllFolders] = useState<Record<string, FolderMeta>>(STATIC_FOLDER_META);
  const [section, setSection] = useState<NavSection>('overview');
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sessionTracked = useRef(false);
  const sessionStart = useRef(Date.now());

  // Analytics state
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [topDocs, setTopDocs] = useState<TopDoc[]>([]);
  const [dailyViews, setDailyViews] = useState<{ date: string; views: number }[]>([]);
  const [investorStats, setInvestorStats] = useState<InvestorStat[]>([]);
  const [unopenedDocs, setUnopenedDocs] = useState<string[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [adminSettings, setAdminSettings] = useState<Record<string, Record<string, unknown>>>({});

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const [analyticsRes, settingsRes] = await Promise.all([
        fetch(`${FN_BASE}/admin/analytics?days=30`, {
          headers: { Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
        }),
        fetch(`${FN_BASE}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}`, Apikey: ANON_KEY },
        }),
      ]);
      if (analyticsRes.ok) {
        const json = await analyticsRes.json();
        setAnalyticsSummary(json.summary ?? null);
        setTopDocs(json.top_docs ?? []);
        setDailyViews(json.daily_views ?? []);
        setInvestorStats(json.investor_stats ?? []);
        setUnopenedDocs(json.unopened_docs ?? []);
      }
      if (settingsRes.ok) {
        const json = await settingsRes.json();
        setAdminSettings(json.settings ?? {});
      }
    } catch (_) {}
    setAnalyticsLoading(false);
  }, [token]);

  // Load document list, folder labels, and custom folders from DB
  useEffect(() => {
    supabase.from('investor_docs').select('*').then(({ data }) => {
      if (data) setDocs(data as InvestorDoc[]);
    });
    supabase.from('folder_labels').select('folder_key, label, color_class').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        for (const row of data) map[row.folder_key] = row.label;
        setFolderLabels((prev) => ({ ...prev, ...map }));
        setAllFolders((prev) => {
          const next = { ...prev };
          for (const row of data) {
            if (next[row.folder_key]) {
              next[row.folder_key] = {
                ...next[row.folder_key],
                label: row.label,
                ...(row.color_class ? { color: row.color_class } : {}),
              };
            }
          }
          return next;
        });
      }
    });
    supabase.from('custom_folders').select('*').order('sort_order').then(({ data }) => {
      if (data) {
        setAllFolders((prev) => {
          const next = { ...prev };
          for (const row of data as CustomFolder[]) {
            next[row.folder_key] = { label: row.label, color: row.color_class, isCustom: true };
          }
          return next;
        });
        setFolderLabels((prev) => {
          const next = { ...prev };
          for (const row of data as CustomFolder[]) next[row.folder_key] = row.label;
          return next;
        });
      }
    });
    loadAnalytics();
  }, [loadAnalytics]);

  // Track session start once per load; fire session_end on unload
  useEffect(() => {
    if (investor && token && !sessionTracked.current) {
      sessionTracked.current = true;
      track(token, 'session_start', { access_level: investor.access_level });
      sessionStart.current = Date.now();

      const handleUnload = () => {
        const duration = Math.round((Date.now() - sessionStart.current) / 1000);
        navigator.sendBeacon(
          `${FN_BASE}/track`,
          JSON.stringify({
            token,
            event_type: 'session_end',
            event_data: {},
            session_id: SESSION_ID,
            duration_seconds: duration,
            user_agent: navigator.userAgent,
          }),
        );
      };
      window.addEventListener('beforeunload', handleUnload);
      return () => window.removeEventListener('beforeunload', handleUnload);
    }
  }, [investor, token]);

  const handleAccess = useCallback((inv: InvestorRecord, tok: string) => {
    setInvestor(inv);
    setToken(tok);
  }, []);

  const handleNavSection = (s: NavSection) => {
    setSection(s);
    setSidebarOpen(false);
    if (token) track(token, 'nav_section_changed', { section: s });
    if (s === 'analytics') loadAnalytics();
  };

  const handleNdaSigned = async () => {
    setShowNdaModal(false);
    try {
      await fetch(`${FN_BASE}/nda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
        body: JSON.stringify({ token }),
      });
    } catch (_) {}
    track(token, 'nda_signed');
    setInvestor((prev) => prev ? { ...prev, nda_signed: true, access_level: 2 } : prev);
  };

  const handleScheduleCall = () => {
    if (token) track(token, 'schedule_call_clicked');
    window.location.href = 'mailto:sukesh@nexfrontierlogic.nz?subject=Schedule a Call – NexFrontier Investor';
  };

  const handleContactUs = () => {
    if (token) track(token, 'contact_clicked');
    window.location.href = 'mailto:sukesh@nexfrontierlogic.nz?subject=Data Room Enquiry – NexFrontier';
  };

  if (!investor) return <AccessGate onAccess={handleAccess} />;

  const isAdmin = token.startsWith('admin-bypass-');
  const ndaApproved = investor.access_level === 2;

  return (
    <div className="min-h-screen bg-nex-dark flex flex-col">
      <AnimatePresence>
        {showNdaModal && (
          <NdaGateModal investorEmail={investor.email} onSign={handleNdaSigned} onClose={() => setShowNdaModal(false)} />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-nex-darker border-b border-white/8 z-40 relative">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg text-nex-grey hover:text-white hover:bg-white/8 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => { window.location.hash = '#investor-brief'; }} className="flex items-center gap-1.5 font-inter text-nex-grey text-sm hover:text-nex-cyan transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-white/20 hidden sm:block">|</span>
          <span className="font-urbanist text-white font-bold text-base">Nex<span className="text-nex-cyan">Frontier</span></span>
          <span className="hidden sm:block font-inter text-nex-grey text-xs">/ Investor Data Room</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-nex-cyan" />
          <span className="font-inter text-xs text-nex-grey hidden sm:inline truncate max-w-[140px]">{investor.email}</span>
          {ndaApproved ? (
            <span className="font-inter text-xs px-3 py-1.5 rounded-full border border-emerald-400/40 text-emerald-400 bg-emerald-400/10">NDA Signed</span>
          ) : (
            <button onClick={() => setShowNdaModal(true)} className="font-inter text-xs px-3 py-1.5 rounded-full border border-amber-400/40 text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition-all duration-200">
              Sign NDA
            </button>
          )}
        </div>
      </div>

      <MetricsBar
        ndaApproved={ndaApproved}
        onSignNda={() => setShowNdaModal(true)}
        totalViews={analyticsSummary?.total_doc_views ?? null}
        avgSessionSeconds={analyticsSummary?.avg_session_seconds ?? null}
        uniqueInvestors={analyticsSummary?.unique_investors ?? null}
        isAdmin={isAdmin}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden" />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`fixed lg:static top-0 left-0 h-full z-40 w-64 bg-nex-darker border-r border-white/8 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-white/8">
            <span className="font-urbanist text-white font-semibold text-sm">Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-nex-grey hover:text-white transition-colors"><X className="w-4 h-4" /></button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest px-3 mb-3 pt-2 lg:pt-0">Navigation</p>
            {NAV_ITEMS.filter((item) => isAdmin || (item.id !== 'analytics' && item.id !== 'team' && item.id !== 'admins')).map((item) => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => handleNavSection(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter transition-all duration-200 ${active ? 'bg-nex-cyan/15 text-nex-cyan border border-nex-cyan/25' : 'text-nex-grey hover:text-white hover:bg-white/6 border border-transparent'}`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/8 space-y-3">
            <div className="bg-white/4 rounded-lg p-3">
              <p className="font-inter text-nex-text text-xs font-semibold truncate">{investor.name || investor.email}</p>
              <p className="font-inter text-nex-grey/60 text-xs truncate">{investor.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${ndaApproved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className={`font-inter text-xs ${ndaApproved ? 'text-emerald-400' : 'text-amber-400'}`}>Level {investor.access_level} Access</span>
              </div>
            </div>
            <div className="bg-nex-cyan/8 border border-nex-cyan/20 rounded-lg p-3">
              <p className="font-inter text-nex-text text-xs font-semibold mb-1">Need assistance?</p>
              <p className="font-inter text-nex-grey text-xs mb-2.5">Our team responds within 2 business hours.</p>
              <button onClick={handleContactUs} className="font-inter text-xs text-nex-cyan hover:underline flex items-center gap-1">
                Contact us <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {section === 'overview' && (
                  <OverviewPage
                    docs={docs}
                    investor={investor}
                    setSection={handleNavSection}
                    onScheduleCall={handleScheduleCall}
                    totalViews={analyticsSummary?.total_doc_views ?? null}
                    avgSessionSeconds={analyticsSummary?.avg_session_seconds ?? null}
                    uniqueInvestors={analyticsSummary?.unique_investors ?? null}
                    topDocs={topDocs}
                    isAdmin={isAdmin}
                    folderLabels={folderLabels}
                    allFolders={allFolders}
                  />
                )}
                {section === 'documents' && (
                  <DocumentsPage
                    investor={investor}
                    token={token}
                    docs={docs}
                    onRequestNda={() => setShowNdaModal(true)}
                    folderLabels={folderLabels}
                    onFolderLabelChange={(key, label) => setFolderLabels((prev) => ({ ...prev, [key]: label }))}
                    allFolders={allFolders}
                    onFoldersChange={setAllFolders}
                  />
                )}
                {section === 'analytics' && isAdmin && (
                  <AnalyticsPage
                    token={token}
                    summary={analyticsSummary}
                    topDocs={topDocs}
                    dailyViews={dailyViews}
                    investorStats={investorStats}
                    unopenedDocs={unopenedDocs}
                    settings={adminSettings}
                    loading={analyticsLoading}
                    onRefresh={loadAnalytics}
                  />
                )}
                {section === 'team' && isAdmin && <TeamPage token={token} />}
                {section === 'admins' && isAdmin && <AdminsPage token={token} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}