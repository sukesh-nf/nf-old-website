import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Upload, CheckCircle, AlertCircle, Copy, Film, FileText, Briefcase,
  Plus, Trash2, Star, Users, ShieldCheck, ShieldOff, Eye, Clock,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, RefreshCw, Link, Save,
  BarChart2, TrendingUp, Activity, Monitor,
} from 'lucide-react';

const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/investor-access`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Admin key is stored in .env — never committed to version control
const ADMIN_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY ?? '';

const REPORTS = [
  {
    id: 'data-readiness',
    filename: 'the-data-readiness-index-understanding-the-foundations-for-successful-ai.pdf',
    title: 'Data Readiness Index PDF',
    subtitle: 'Cloudera · 2026',
  },
  {
    id: 'agentic-ai-cx',
    filename: 'the-agentic-ai-cx-frontline-report.pdf',
    title: 'Agentic AI CX Frontline Report',
    subtitle: 'NiCE · 2026',
  },
  {
    id: 'gartner-bq-q2-2026',
    filename: 'gartner-business-quarterly-q2-2026-monetising-ai-autonomous-business.pdf',
    title: 'Gartner Business Quarterly Q2-2026',
    subtitle: 'Monetising AI with Autonomous Business',
  },
];

function UploadZone({
  accept,
  hint,
  file,
  onFile,
  id,
}: {
  accept: string;
  hint: string;
  file: File | null;
  onFile: (f: File) => void;
  id: string;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <label
      htmlFor={id}
      className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
        dragging
          ? 'border-cyan-400 bg-cyan-500/10'
          : file
          ? 'border-cyan-500/60 bg-cyan-500/5'
          : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
      <Upload className="mx-auto mb-3 text-gray-500" size={32} />
      {file ? (
        <div>
          <p className="text-white font-medium">{file.name}</p>
          <p className="text-gray-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-300">Drop file here or <span className="text-cyan-400 underline">click to browse</span></p>
          <p className="text-gray-500 text-sm mt-1">{hint}</p>
        </div>
      )}
    </label>
  );
}

function PdfUpload({ filename, title, subtitle, inputId }: {
  filename: string;
  title: string;
  subtitle: string;
  inputId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const { error: uploadError } = await supabase.storage
      .from('reports')
      .upload(filename, file, { contentType: 'application/pdf', upsert: true });
    setUploading(false);
    if (uploadError) { setError(uploadError.message); return; }
    setDone(true);
  };

  const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/reports/${filename}`;

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-cyan-400" size={24} />
        <div>
          <h2 className="text-white text-xl font-semibold">{title}</h2>
          <p className="text-gray-400 text-sm">reports bucket · {subtitle} · will overwrite existing file</p>
        </div>
      </div>

      <UploadZone
        id={inputId}
        accept="application/pdf"
        hint="PDF files only"
        file={file}
        onFile={(f) => { setFile(f); setDone(false); setError(null); }}
      />

      {error && (
        <div className="mt-4 flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {done && (
        <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Uploaded - download link is now live</span>
          </div>
          <p className="text-gray-300 text-xs break-all font-mono bg-gray-900 rounded p-2">{publicUrl}</p>
        </div>
      )}

      <button
        onClick={upload}
        disabled={!file || uploading}
        className="mt-6 w-full py-3 rounded-xl font-medium transition-all bg-cyan-500 text-gray-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
    </div>
  );
}

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { error: uploadError } = await supabase.storage
      .from('exemplar-videos')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { setError(uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from('exemplar-videos').getPublicUrl(path);
    setPublicUrl(data.publicUrl);
    setUploading(false);
  };

  const copy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Film className="text-cyan-400" size={24} />
        <div>
          <h2 className="text-white text-xl font-semibold">Video Upload</h2>
          <p className="text-gray-400 text-sm">exemplar-videos bucket</p>
        </div>
      </div>

      <UploadZone
        id="video-input"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        hint="MP4, WebM, MOV  - up to 100 MB"
        file={file}
        onFile={(f) => { setFile(f); setPublicUrl(null); setError(null); }}
      />

      {error && (
        <div className="mt-4 flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {publicUrl && (
        <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Uploaded successfully</span>
          </div>
          <p className="text-gray-300 text-xs break-all font-mono bg-gray-900 rounded p-2">{publicUrl}</p>
          <button onClick={copy} className="mt-2 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            <Copy size={14} />{copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
      )}

      <button
        onClick={upload}
        disabled={!file || uploading}
        className="mt-6 w-full py-3 rounded-xl font-medium transition-all bg-cyan-500 text-gray-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
}

interface JobListing {
  id: string;
  title: string;
  team: string;
  location: string;
  country: string;
  job_type: string;
  description: string;
  linkedin_url: string;
  jobstreet_url: string;
  seek_url: string;
  indeed_url: string;
  is_featured: boolean;
  expires_at: string;
  no_expiry: boolean;
}

const EMPTY_JOB: Omit<JobListing, 'id'> = {
  title: '',
  team: '',
  location: '',
  country: '',
  job_type: 'Full-time',
  description: '',
  linkedin_url: '',
  jobstreet_url: '',
  seek_url: '',
  indeed_url: '',
  is_featured: false,
  expires_at: '',
  no_expiry: true,
};

function JobForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<JobListing, 'id'>;
  onSave: (data: Omit<JobListing, 'id'>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const labelCls = 'block text-gray-400 text-xs mb-1 font-medium';
  const inputCls = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors';

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Job Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Senior AI Engineer" />
        </div>
        <div>
          <label className={labelCls}>Team / Department</label>
          <input className={inputCls} value={form.team} onChange={(e) => set('team', e.target.value)} placeholder="e.g. Engineering" />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Kuala Lumpur / Remote" />
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <input className={inputCls} value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="e.g. Malaysia" />
        </div>
        <div>
          <label className={labelCls}>Job Type</label>
          <select className={inputCls} value={form.job_type} onChange={(e) => set('job_type', e.target.value)}>
            {['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="accent-cyan-400 w-4 h-4" />
            <span className="text-gray-300 text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.no_expiry} onChange={(e) => set('no_expiry', e.target.checked)} className="accent-cyan-400 w-4 h-4" />
            <span className="text-gray-300 text-sm">No expiry</span>
          </label>
        </div>
      </div>

      {!form.no_expiry && (
        <div>
          <label className={labelCls}>Expires at</label>
          <input type="datetime-local" className={inputCls} value={form.expires_at} onChange={(e) => set('expires_at', e.target.value)} />
        </div>
      )}

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={`${inputCls} h-32 resize-y`}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Role overview, responsibilities, what we offer..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['linkedin_url', 'jobstreet_url', 'seek_url', 'indeed_url'] as const).map((k) => (
          <div key={k}>
            <label className={labelCls}>{k.replace('_url', '').replace('linkedin', 'LinkedIn').replace('jobstreet', 'JobStreet').replace('seek', 'SEEK').replace('indeed', 'Indeed')} URL</label>
            <input className={inputCls} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder="https://" />
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-cyan-500 text-gray-950 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Job'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-gray-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function JobsAdmin() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('job_listings')
      .select('*')
      .order('created_at', { ascending: false });
    setJobs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = async (data: Omit<JobListing, 'id'>) => {
    const payload = {
      ...data,
      expires_at: data.no_expiry || !data.expires_at ? null : data.expires_at,
    };
    const { error: err } = await supabase.from('job_listings').insert(payload);
    if (err) throw new Error(err.message);
    setShowForm(false);
    fetchJobs();
  };

  const handleUpdate = async (id: string, data: Omit<JobListing, 'id'>) => {
    const payload = {
      ...data,
      expires_at: data.no_expiry || !data.expires_at ? null : data.expires_at,
      updated_at: new Date().toISOString(),
    };
    const { error: err } = await supabase.from('job_listings').update(payload).eq('id', id);
    if (err) throw new Error(err.message);
    setEditingId(null);
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job listing?')) return;
    const { error: err } = await supabase.from('job_listings').delete().eq('id', id);
    if (err) { setError(err.message); return; }
    fetchJobs();
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-white text-xl font-semibold">Job Listings</h2>
            <p className="text-gray-400 text-sm">Manage careers page openings</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-gray-950 font-semibold text-sm hover:bg-cyan-400 transition-colors"
          >
            <Plus size={15} />
            Add Role
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <JobForm
            initial={EMPTY_JOB}
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-sm">No job listings yet.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id}>
              {editingId === job.id ? (
                <JobForm
                  initial={{
                    title: job.title,
                    team: job.team,
                    location: job.location,
                    country: job.country,
                    job_type: job.job_type,
                    description: job.description,
                    linkedin_url: job.linkedin_url ?? '',
                    jobstreet_url: job.jobstreet_url ?? '',
                    seek_url: job.seek_url ?? '',
                    indeed_url: job.indeed_url ?? '',
                    is_featured: job.is_featured,
                    expires_at: job.expires_at ?? '',
                    no_expiry: job.no_expiry,
                  }}
                  onSave={(data) => handleUpdate(job.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start justify-between gap-3 bg-gray-900/50 border border-gray-700 rounded-xl px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium text-sm truncate">{job.title}</p>
                      {job.is_featured && <Star size={12} className="text-cyan-400 fill-cyan-400 flex-shrink-0" />}
                    </div>
                    <p className="text-gray-400 text-xs">
                      {[job.team, job.location, job.country, job.job_type].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingId(job.id); setShowForm(false); }}
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-xs border border-gray-700 hover:border-cyan-500/50 rounded-lg px-3 py-1.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Investor Docs Admin ──────────────────────────────────────────────────────

interface InvestorDocRow {
  doc_key: string;
  folder: string;
  name: string;
  drive_url: string;
  embed_url: string;
  locked: boolean;
}

/** Convert any Google Drive share URL to its preview embed URL */
function toEmbedUrl(url: string): string {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return url;
}

const FOLDER_LABELS: Record<string, string> = {
  legal: 'Legal',
  financials: 'Financials',
  tech: 'Technology',
  traction: 'Traction',
};
const FOLDER_ORDER = ['traction', 'financials', 'tech', 'legal'];

function InvestorDocsAdmin() {
  const [docs, setDocs] = useState<InvestorDocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase.from('investor_docs').select('*').order('folder').order('name');
    setDocs((data as InvestorDocRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUrlChange = (docKey: string, value: string) => {
    setEdits((p) => ({ ...p, [docKey]: value }));
    setSaved((p) => ({ ...p, [docKey]: false }));
    setErrors((p) => ({ ...p, [docKey]: '' }));
  };

  const docPut = (body: Record<string, unknown>) =>
    fetch(`${FN_BASE}/admin/docs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}`, Apikey: ANON_KEY },
      body: JSON.stringify(body),
    });

  const handleSave = async (doc: InvestorDocRow) => {
    const rawUrl = (edits[doc.doc_key] ?? doc.drive_url).trim();
    if (!rawUrl) {
      setErrors((p) => ({ ...p, [doc.doc_key]: 'Paste a Google Drive share link.' }));
      return;
    }
    const embedUrl = toEmbedUrl(rawUrl);
    setSaving((p) => ({ ...p, [doc.doc_key]: true }));
    const res = await docPut({ doc_key: doc.doc_key, drive_url: rawUrl, embed_url: embedUrl });
    setSaving((p) => ({ ...p, [doc.doc_key]: false }));
    if (!res.ok) {
      const j = await res.json();
      setErrors((p) => ({ ...p, [doc.doc_key]: j.error ?? 'Save failed.' }));
      return;
    }
    setSaved((p) => ({ ...p, [doc.doc_key]: true }));
    setDocs((prev) => prev.map((d) => d.doc_key === doc.doc_key ? { ...d, drive_url: rawUrl, embed_url: embedUrl } : d));
    setTimeout(() => setSaved((p) => ({ ...p, [doc.doc_key]: false })), 2500);
  };

  const handleClear = async (docKey: string) => {
    if (!confirm('Remove the Google Drive link for this document?')) return;
    await docPut({ doc_key: docKey, drive_url: '', embed_url: '' });
    setEdits((p) => ({ ...p, [docKey]: '' }));
    setDocs((prev) => prev.map((d) => d.doc_key === docKey ? { ...d, drive_url: '', embed_url: '' } : d));
  };

  const handleToggleLocked = async (doc: InvestorDocRow) => {
    const newLocked = !doc.locked;
    setSaving((p) => ({ ...p, [doc.doc_key]: true }));
    const res = await docPut({ doc_key: doc.doc_key, locked: newLocked });
    setSaving((p) => ({ ...p, [doc.doc_key]: false }));
    if (!res.ok) { const j = await res.json(); setErrors((p) => ({ ...p, [doc.doc_key]: j.error ?? 'Save failed.' })); return; }
    setDocs((prev) => prev.map((d) => d.doc_key === doc.doc_key ? { ...d, locked: newLocked } : d));
  };

  const byFolder = FOLDER_ORDER.reduce<Record<string, InvestorDocRow[]>>((acc, f) => {
    acc[f] = docs.filter((d) => d.folder === f);
    return acc;
  }, {});

  const inputCls = 'flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600';

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-white text-xl font-semibold">Data Room Documents</h2>
            <p className="text-gray-400 text-sm">Paste Google Drive "anyone with link" URLs for each document</p>
          </div>
        </div>
        <button onClick={fetchDocs} className="p-2 text-gray-500 hover:text-cyan-400 transition-colors" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="mb-5 bg-sky-900/20 border border-sky-500/25 rounded-xl p-4 text-xs text-sky-300 font-inter space-y-1.5">
        <p className="font-semibold text-sky-200">How to add a document:</p>
        <ol className="list-decimal list-inside space-y-1 text-sky-300/80">
          <li>Open the file in Google Drive</li>
          <li>Click Share → set to <strong className="text-sky-200">"Anyone with the link"</strong> → Copy link</li>
          <li>Paste it below next to the matching document slot and click Save</li>
        </ol>
        <p className="text-sky-400/60 pt-1">Documents are embedded in an iframe viewer. Investors can also download the PDF directly.</p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : (
        <div className="space-y-6">
          {FOLDER_ORDER.map((folder) => (
            <div key={folder}>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">{FOLDER_LABELS[folder]}</p>
              <div className="space-y-2">
                {byFolder[folder].map((doc) => {
                  const currentUrl = edits[doc.doc_key] ?? doc.drive_url;
                  const hasUrl = doc.embed_url.length > 0;
                  const isSaving = saving[doc.doc_key];
                  const isSaved = saved[doc.doc_key];
                  const err = errors[doc.doc_key];

                  return (
                    <div key={doc.doc_key} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-medium flex-1">{doc.name}</span>
                        {/* Security level toggle */}
                        <button
                          onClick={() => handleToggleLocked(doc)}
                          disabled={saving[doc.doc_key]}
                          title={doc.locked ? 'Click to make public (no NDA required)' : 'Click to require NDA'}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 ${
                            doc.locked
                              ? 'text-amber-400 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20'
                              : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20'
                          }`}
                        >
                          {doc.locked ? <ShieldCheck size={10} /> : <Eye size={10} />}
                          {doc.locked ? 'NDA required' : 'Public'}
                        </button>
                        {hasUrl
                          ? <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">Live</span>
                          : <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">No URL</span>
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className={inputCls}
                          value={currentUrl}
                          onChange={(e) => handleUrlChange(doc.doc_key, e.target.value)}
                          placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                          onKeyDown={(e) => e.key === 'Enter' && handleSave(doc)}
                        />
                        <button
                          onClick={() => handleSave(doc)}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 text-gray-950 text-xs font-semibold hover:bg-cyan-400 disabled:opacity-50 transition-colors flex-shrink-0"
                        >
                          {isSaving ? <RefreshCw size={12} className="animate-spin" /> : isSaved ? <CheckCircle size={12} /> : <Save size={12} />}
                          {isSaving ? 'Saving…' : isSaved ? 'Saved!' : 'Save'}
                        </button>
                        {hasUrl && (
                          <button onClick={() => handleClear(doc.doc_key)} className="p-2 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0" title="Remove URL">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {err && (
                        <p className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle size={11} /> {err}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Investor Access Admin ────────────────────────────────────────────────────

interface InvestorRecord {
  id: string;
  email: string;
  name: string;
  token: string;
  status: 'pending' | 'approved' | 'revoked';
  nda_signed: boolean;
  nda_signed_at: string | null;
  access_level: 1 | 2;
  notes: string;
  last_seen_at: string | null;
  created_at: string;
}

interface ActivityEvent {
  id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

async function adminFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${FN_BASE}/${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
      Apikey: ANON_KEY,
      'X-Admin-Key': ADMIN_KEY,
      ...(opts.headers ?? {}),
    },
  });
  return res.json();
}

function StatusBadge({ status }: { status: InvestorRecord['status'] }) {
  if (status === 'approved') return (
    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={10} /> Approved
    </span>
  );
  if (status === 'revoked') return (
    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
      <XCircle size={10} /> Revoked
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
      <AlertCircle size={10} /> Pending
    </span>
  );
}

function ActivityDrawer({ investor }: { investor: InvestorRecord }) {
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`admin/activity?investor_id=${investor.id}`).then((json) => {
      setActivity(json.activity ?? []);
      setLoading(false);
    });
  }, [investor.id]);

  const eventLabel: Record<string, string> = {
    session_start: 'Session started',
    doc_viewed: 'Document viewed',
    doc_downloaded: 'Document downloaded',
    nda_signed: 'NDA signed',
    schedule_call_clicked: 'Schedule call clicked',
    contact_clicked: 'Contact clicked',
    nav_section_changed: 'Navigated to section',
    folder_opened: 'Folder opened',
  };

  const eventColor: Record<string, string> = {
    session_start: 'text-nex-cyan',
    doc_viewed: 'text-sky-400',
    doc_downloaded: 'text-emerald-400',
    nda_signed: 'text-amber-400',
    schedule_call_clicked: 'text-nex-cyan',
    contact_clicked: 'text-nex-cyan',
    nav_section_changed: 'text-gray-400',
    folder_opened: 'text-gray-400',
  };

  if (loading) return <p className="text-gray-500 text-xs px-4 pb-3">Loading activity...</p>;
  if (!activity.length) return <p className="text-gray-500 text-xs px-4 pb-3">No activity recorded yet.</p>;

  return (
    <div className="px-4 pb-4 space-y-1 max-h-48 overflow-y-auto">
      {activity.map((ev) => {
        const detail = ev.event_data?.doc
          ? String(ev.event_data.doc)
          : ev.event_data?.section
          ? String(ev.event_data.section)
          : ev.event_data?.folder
          ? String(ev.event_data.folder)
          : '';
        return (
          <div key={ev.id} className="flex items-start gap-2 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-medium ${eventColor[ev.event_type] ?? 'text-gray-400'}`}>
                {eventLabel[ev.event_type] ?? ev.event_type}
              </span>
              {detail && <span className="text-gray-500 text-xs ml-1 truncate">- {detail}</span>}
            </div>
            <span className="text-gray-600 text-xs flex-shrink-0">
              {new Date(ev.created_at).toLocaleString('en-NZ', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function InvestorRow({
  investor,
  onApprove,
  onRevoke,
  onDelete,
  onCopyLink,
  onUpdate,
}: {
  investor: InvestorRecord;
  onApprove: (id: string) => void;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
  onCopyLink: (token: string) => void;
  onUpdate: (id: string, patch: { access_level?: 1 | 2; nda_signed?: boolean }) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPriv, setShowPriv] = useState(false);
  const [privSaving, setPrivSaving] = useState(false);
  const [privError, setPrivError] = useState('');
  const [localLevel, setLocalLevel] = useState<1 | 2>(investor.access_level);
  const [localNda, setLocalNda] = useState(investor.nda_signed);
  const dataRoomUrl = `${window.location.origin}${window.location.pathname}#/investor-data-room?token=${investor.token}`;

  const handlePrivSave = async () => {
    setPrivSaving(true);
    setPrivError('');
    try {
      await onUpdate(investor.id, { access_level: localLevel, nda_signed: localNda });
      setShowPriv(false);
    } catch (e: unknown) {
      setPrivError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setPrivSaving(false);
    }
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 bg-gray-900/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-medium text-sm">{investor.name || 'N/A'}</p>
            <StatusBadge status={investor.status} />
            {investor.nda_signed && (
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> NDA
              </span>
            )}
            <span className="text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
              L{investor.access_level}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">{investor.email}</p>
          {investor.last_seen_at && (
            <p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1">
              <Clock size={10} />
              Last seen {new Date(investor.last_seen_at).toLocaleString('en-NZ', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {investor.status === 'pending' && (
            <button
              onClick={() => onApprove(investor.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-colors"
            >
              <CheckCircle2 size={12} /> Approve
            </button>
          )}
          {investor.status === 'approved' && (
            <>
              <button
                onClick={() => onCopyLink(investor.token)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs hover:bg-cyan-500/25 transition-colors"
              >
                <Copy size={12} /> Copy Link
              </button>
              <button
                onClick={() => onRevoke(investor.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/25 transition-colors"
              >
                <ShieldOff size={12} /> Revoke
              </button>
            </>
          )}
          {investor.status === 'revoked' && (
            <button
              onClick={() => onApprove(investor.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-300 text-xs hover:bg-gray-700 transition-colors"
            >
              <CheckCircle2 size={12} /> Re-approve
            </button>
          )}
          <button
            onClick={() => { setShowPriv(!showPriv); setExpanded(false); setPrivError(''); setLocalLevel(investor.access_level); setLocalNda(investor.nda_signed); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${showPriv ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
          >
            <ShieldCheck size={12} /> Privileges
          </button>
          <button
            onClick={() => { setExpanded(!expanded); setShowPriv(false); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 hover:text-white transition-colors"
          >
            <Eye size={12} />
            Activity
            {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
          <button
            onClick={() => onDelete(investor.id)}
            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Privilege editor */}
      {showPriv && (
        <div className="border-t border-gray-800 bg-gray-950/70 px-5 py-4 space-y-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Access Privileges</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Access level */}
            <div>
              <p className="text-gray-400 text-xs mb-2">Document access level</p>
              <div className="flex gap-2">
                {([1, 2] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLocalLevel(lvl)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${localLevel === lvl ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'}`}
                  >
                    Level {lvl}
                    <span className="block font-normal text-gray-600 mt-0.5">
                      {lvl === 1 ? 'Standard docs' : 'All docs (NDA)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* NDA toggle */}
            <div>
              <p className="text-gray-400 text-xs mb-2">NDA status</p>
              <div className="flex gap-2">
                {[true, false].map((signed) => (
                  <button
                    key={String(signed)}
                    onClick={() => setLocalNda(signed)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${localNda === signed ? (signed ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/15 border-red-500/40 text-red-400') : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'}`}
                  >
                    {signed ? 'Signed' : 'Not signed'}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-1.5">
                {localNda ? 'Investor has signed the NDA. Level 2 access granted.' : 'No NDA on file. Restricted to Level 1 docs.'}
              </p>
            </div>
          </div>

          {privError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-lg px-3 py-2 text-xs">
              <AlertCircle size={12} /> {privError}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handlePrivSave}
              disabled={privSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-gray-950 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-50 transition-colors"
            >
              <Save size={13} />
              {privSaving ? 'Saving…' : 'Save Privileges'}
            </button>
            <button
              onClick={() => setShowPriv(false)}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {expanded && (
        <div className="border-t border-gray-800 bg-gray-950/60">
          <div className="px-4 pt-3 pb-1">
            <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wider">Activity Log</p>
          </div>
          <ActivityDrawer investor={investor} />
          {investor.status === 'approved' && (
            <div className="px-4 pb-3">
              <p className="text-gray-600 text-xs mb-1 font-medium">Access Link</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-gray-500 text-xs truncate flex-1 bg-gray-900 rounded px-2 py-1">
                  {dataRoomUrl}
                </p>
                <button
                  onClick={() => onCopyLink(investor.token)}
                  className="text-cyan-400 hover:text-cyan-300 flex-shrink-0"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InvestorAccessAdmin() {
  const [investors, setInvestors] = useState<InvestorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const fetchInvestors = async () => {
    setLoading(true);
    const json = await adminFetch('admin/list');
    setInvestors(json.investors ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchInvestors(); }, []);

  const handleAdd = async () => {
    if (!newEmail.trim()) { setAddError('Email is required.'); return; }
    setAdding(true);
    setAddError('');
    const json = await adminFetch('admin/create', {
      method: 'POST',
      body: JSON.stringify({ email: newEmail.trim(), name: newName.trim(), notes: newNotes.trim() }),
    });
    setAdding(false);
    if (json.error) { setAddError(json.error); return; }
    setNewEmail(''); setNewName(''); setNewNotes('');
    setShowAdd(false);
    fetchInvestors();
  };

  const handleApprove = async (id: string) => {
    const json = await adminFetch('admin/approve', { method: 'POST', body: JSON.stringify({ id }) });
    if (json.error) { setError(json.error); return; }
    fetchInvestors();
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke access for this investor?')) return;
    const json = await adminFetch('admin/revoke', { method: 'POST', body: JSON.stringify({ id }) });
    if (json.error) { setError(json.error); return; }
    fetchInvestors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this investor record and all their activity?')) return;
    const json = await adminFetch('admin/delete', { method: 'DELETE', body: JSON.stringify({ id }) });
    if (json.error) { setError(json.error); return; }
    fetchInvestors();
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/investor-data-room?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleUpdate = async (id: string, patch: { access_level?: 1 | 2; nda_signed?: boolean }) => {
    const json = await adminFetch('admin/update', { method: 'POST', body: JSON.stringify({ id, ...patch }) });
    if (json.error) throw new Error(json.error);
    fetchInvestors();
  };

  const pending = investors.filter((i) => i.status === 'pending');
  const approved = investors.filter((i) => i.status === 'approved');
  const revoked = investors.filter((i) => i.status === 'revoked');

  const inputCls = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors';

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-white text-xl font-semibold">Investor Access</h2>
            <p className="text-gray-400 text-sm">Manage data room access tokens and activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchInvestors}
            className="p-2 text-gray-500 hover:text-cyan-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-gray-950 font-semibold text-sm hover:bg-cyan-400 transition-colors"
            >
              <Plus size={15} /> Add Investor
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Pending', count: pending.length, color: 'text-amber-400' },
          { label: 'Approved', count: approved.length, color: 'text-emerald-400' },
          { label: 'Revoked', count: revoked.length, color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="text-white font-medium text-sm">Add Investor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Email *</label>
              <input className={inputCls} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="investor@fund.com" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Name</label>
              <input className={inputCls} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Notes (internal)</label>
            <input className={inputCls} value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="e.g. Referred by X, Fund name" />
          </div>
          {addError && (
            <div className="flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-2 text-xs">
              <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />{addError}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-950 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-50 transition-colors"
            >
              {adding ? 'Adding…' : 'Add & Generate Token'}
            </button>
            <button
              onClick={() => { setShowAdd(false); setAddError(''); }}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="text-gray-600 text-xs">
            A unique access token is generated automatically. Approve the investor then copy their link to email them.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-3">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {copied && (
        <div className="mb-4 flex items-center gap-2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-3">
          <CheckCircle size={14} />
          <p className="text-sm">Access link copied to clipboard.</p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : investors.length === 0 ? (
        <p className="text-gray-500 text-sm">No investors added yet.</p>
      ) : (
        <div className="space-y-3">
          {investors.map((inv) => (
            <InvestorRow
              key={inv.id}
              investor={inv}
              onApprove={handleApprove}
              onRevoke={handleRevoke}
              onDelete={handleDelete}
              onCopyLink={handleCopyLink}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Analytics Dashboard ──────────────────────────────────────────────────────

interface AnalyticsSummary {
  total_doc_views: number;
  total_sessions: number;
  unique_investors: number;
  avg_session_seconds: number | null;
  days: number;
}

interface TopDoc {
  name: string;
  views: number;
  avg_duration_seconds: number | null;
}

interface DailyView {
  date: string;
  views: number;
}

interface InvestorStat {
  id: string;
  email: string;
  name: string;
  nda_signed: boolean;
  access_level: number;
  last_seen_at: string | null;
  session_count: number;
  total_duration_seconds: number;
  doc_views: number;
}

interface InvestorTimelineEvent {
  id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  session_id: string | null;
  duration_seconds: number | null;
  user_agent: string;
  created_at: string;
}

function fmtDuration(secs: number | null): string {
  if (secs === null || secs === 0) return 'N/A';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-NZ', { dateStyle: 'short', timeStyle: 'short' });
}

const EVENT_LABELS: Record<string, string> = {
  session_start: 'Session started',
  session_end: 'Session ended',
  doc_viewed: 'Document viewed',
  doc_exit: 'Document closed',
  nda_signed: 'NDA signed',
  schedule_call_clicked: 'Schedule call clicked',
  contact_clicked: 'Contact clicked',
  nav_section_changed: 'Navigated to section',
  folder_opened: 'Folder opened',
};

const EVENT_COLORS: Record<string, string> = {
  session_start: 'text-cyan-400',
  session_end: 'text-gray-500',
  doc_viewed: 'text-sky-400',
  doc_exit: 'text-gray-500',
  nda_signed: 'text-emerald-400',
  schedule_call_clicked: 'text-cyan-400',
  contact_clicked: 'text-cyan-400',
  nav_section_changed: 'text-gray-500',
  folder_opened: 'text-gray-400',
};

function InvestorTimeline({ investorId, investorName }: { investorId: string; investorName: string }) {
  const [events, setEvents] = useState<InvestorTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSession, setFilterSession] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminFetch(`admin/investor-timeline?investor_id=${investorId}`).then((json) => {
      setEvents(json.events ?? []);
      setLoading(false);
    });
  }, [investorId]);

  const sessions = Array.from(new Set(events.map((e) => e.session_id).filter(Boolean))) as string[];
  const filtered = filterSession ? events.filter((e) => e.session_id === filterSession) : events;

  const getDetail = (ev: InvestorTimelineEvent) => {
    const d = ev.event_data;
    if (d?.doc) return String(d.doc);
    if (d?.folder) return String(d.folder);
    if (d?.section) return String(d.section);
    return '';
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Full Timeline: {investorName}</p>
        {sessions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              onClick={() => setFilterSession(null)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${!filterSession ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
            >
              All sessions
            </button>
            {sessions.map((sid, i) => (
              <button
                key={sid}
                onClick={() => setFilterSession(sid)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${filterSession === sid ? 'bg-sky-500/20 border-sky-500/40 text-sky-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
              >
                Session {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-xs">Loading timeline...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-xs">No events recorded.</p>
      ) : (
        <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1">
          {filtered.map((ev) => {
            const detail = getDetail(ev);
            return (
              <div key={ev.id} className="flex items-start gap-3 py-1.5 px-3 rounded-lg hover:bg-white/3 transition-colors group">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-medium ${EVENT_COLORS[ev.event_type] ?? 'text-gray-400'}`}>
                    {EVENT_LABELS[ev.event_type] ?? ev.event_type}
                  </span>
                  {detail && <span className="text-gray-500 text-xs ml-1.5 truncate">- {detail}</span>}
                  {ev.duration_seconds !== null && (
                    <span className="text-gray-600 text-xs ml-1.5">({fmtDuration(ev.duration_seconds)})</span>
                  )}
                </div>
                <span className="text-gray-600 text-xs flex-shrink-0">{fmtDate(ev.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topDocs, setTopDocs] = useState<TopDoc[]>([]);
  const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
  const [investorStats, setInvestorStats] = useState<InvestorStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [expandedInvestor, setExpandedInvestor] = useState<string | null>(null);

  const load = async (d: number) => {
    setLoading(true);
    const json = await adminFetch(`admin/analytics?days=${d}`);
    setSummary(json.summary ?? null);
    setTopDocs(json.top_docs ?? []);
    setDailyViews(json.daily_views ?? []);
    setInvestorStats(json.investor_stats ?? []);
    setLoading(false);
  };

  useEffect(() => { load(days); }, [days]);

  const last14 = dailyViews.slice(-14);
  const maxViews = Math.max(...last14.map((d) => d.views), 1);
  const maxDocViews = topDocs[0]?.views ?? 1;

  const dayLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' });
  };

  const parseDevice = (ua: string) => {
    if (!ua) return 'N/A';
    if (/iPhone|iPad/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Mac/i.test(ua)) return 'macOS';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Unknown';
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart2 className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-white text-xl font-semibold">Analytics Dashboard</h2>
            <p className="text-gray-400 text-sm">Real-time engagement data from the investor data room</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button onClick={() => load(days)} disabled={loading} className="p-2 text-gray-500 hover:text-cyan-400 transition-colors disabled:opacity-40">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Doc Views', value: summary?.total_doc_views ?? 'N/A', icon: Eye, color: 'text-cyan-400' },
          { label: 'Sessions', value: summary?.total_sessions ?? 'N/A', icon: Activity, color: 'text-sky-400' },
          { label: 'Investors', value: summary?.unique_investors ?? 'N/A', icon: Users, color: 'text-emerald-400' },
          { label: 'Avg Session', value: fmtDuration(summary?.avg_session_seconds ?? null), icon: Clock, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <s.icon className={`${s.color} mb-2`} size={16} />
            <p className={`text-xl font-bold ${s.color}`}>{String(s.value)}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daily views chart */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-300 text-sm font-semibold mb-5">
          Document Views <span className="text-gray-500 font-normal">(last {Math.min(14, days)} days)</span>
        </p>
        {last14.every((d) => d.views === 0) ? (
          <p className="text-gray-500 text-sm text-center py-6">No document views in this period.</p>
        ) : (
          <div className="flex items-end gap-1.5 h-28">
            {last14.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-cyan-500/30 rounded-t hover:bg-cyan-500/60 transition-colors relative cursor-default"
                  style={{ height: `${Math.max((d.views / maxViews) * 100, d.views > 0 ? 4 : 0)}%`, minHeight: d.views > 0 ? 4 : 0 }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">{d.views}</span>
                </div>
                <span className="text-gray-600 text-xs truncate w-full text-center leading-tight"
                  style={{ fontSize: '9px' }}>
                  {dayLabel(d.date).split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top docs */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-300 text-sm font-semibold mb-5">Top Documents by Views</p>
        {topDocs.length === 0 ? (
          <p className="text-gray-500 text-sm">No document views tracked yet.</p>
        ) : (
          <div className="space-y-3">
            {topDocs.slice(0, 8).map((doc) => (
              <div key={doc.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-200 text-sm truncate mr-4">{doc.name}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {doc.avg_duration_seconds !== null && (
                      <span className="text-gray-500 text-xs hidden sm:block">avg {fmtDuration(doc.avg_duration_seconds)}</span>
                    )}
                    <span className="text-gray-400 text-xs font-medium">{doc.views} views</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400/60 rounded-full transition-all duration-700"
                    style={{ width: `${(doc.views / maxDocViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-investor engagement table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <p className="text-gray-300 text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={15} className="text-cyan-400" />
            Investor Engagement
          </p>
          <span className="text-gray-600 text-xs">{investorStats.length} investors</span>
        </div>

        {investorStats.length === 0 ? (
          <p className="text-gray-500 text-sm px-5 py-6">No approved investor activity yet.</p>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {investorStats.map((inv) => (
              <div key={inv.id}>
                <button
                  onClick={() => setExpandedInvestor(expandedInvestor === inv.id ? null : inv.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors text-left"
                >
                  {/* Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-medium">{inv.name || 'N/A'}</span>
                      {inv.nda_signed && (
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck size={9} /> NDA
                        </span>
                      )}
                      <span className="text-xs text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded-full">L{inv.access_level}</span>
                    </div>
                    <p className="text-gray-500 text-xs truncate">{inv.email}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-5 flex-shrink-0 text-xs">
                    <div className="text-center">
                      <p className="text-white font-semibold">{inv.doc_views}</p>
                      <p className="text-gray-600">views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{inv.session_count}</p>
                      <p className="text-gray-600">sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{fmtDuration(inv.total_duration_seconds || null)}</p>
                      <p className="text-gray-600">total time</p>
                    </div>
                  </div>

                  {/* Last seen */}
                  <div className="hidden lg:block text-right flex-shrink-0 ml-4">
                    <p className="text-gray-500 text-xs">{inv.last_seen_at ? fmtDate(inv.last_seen_at) : 'Never'}</p>
                    <p className="text-gray-700 text-xs">last seen</p>
                  </div>

                  {/* Expand icon */}
                  {expandedInvestor === inv.id ? (
                    <ChevronUp size={14} className="text-gray-500 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-500 flex-shrink-0 ml-2" />
                  )}
                </button>

                {/* Mobile stats row */}
                <div className="sm:hidden flex items-center gap-4 px-5 pb-3 -mt-1">
                  {[
                    { label: 'views', val: inv.doc_views },
                    { label: 'sessions', val: inv.session_count },
                    { label: 'total time', val: fmtDuration(inv.total_duration_seconds || null) },
                  ].map((s) => (
                    <div key={s.label} className="text-xs">
                      <span className="text-white font-semibold">{String(s.val)}</span>
                      <span className="text-gray-600 ml-1">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Expanded timeline */}
                {expandedInvestor === inv.id && (
                  <div className="border-t border-gray-800/60 bg-gray-950/60 px-5 py-4">
                    <InvestorTimeline investorId={inv.id} investorName={inv.name || inv.email} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device/browser breakdown from per-investor stats (derived) */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-300 text-sm font-semibold mb-4 flex items-center gap-2">
          <Monitor size={15} className="text-cyan-400" />
          Engagement Summary
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <p className="text-gray-500 uppercase tracking-wider mb-2">Most Active</p>
            {investorStats.length > 0 ? (
              <div>
                <p className="text-white font-medium truncate">{investorStats[0].name || investorStats[0].email}</p>
                <p className="text-cyan-400 mt-0.5">{investorStats[0].doc_views} doc views</p>
              </div>
            ) : <p className="text-gray-600">No data</p>}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <p className="text-gray-500 uppercase tracking-wider mb-2">NDA Signed</p>
            <p className="text-white font-medium">
              {investorStats.filter((i) => i.nda_signed).length}
              <span className="text-gray-600 font-normal"> / {investorStats.length}</span>
            </p>
            <p className="text-emerald-400 mt-0.5">
              {investorStats.length > 0
                ? Math.round((investorStats.filter((i) => i.nda_signed).length / investorStats.length) * 100)
                : 0}% conversion
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <p className="text-gray-500 uppercase tracking-wider mb-2">Total Engagement</p>
            <p className="text-white font-medium">
              {fmtDuration(investorStats.reduce((acc, i) => acc + i.total_duration_seconds, 0) || null)}
            </p>
            <p className="text-sky-400 mt-0.5">combined session time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUpload() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center gap-16 py-16 px-6">
      {REPORTS.map((report, i) => (
        <>
          <PdfUpload
            key={report.id}
            filename={report.filename}
            title={report.title}
            subtitle={report.subtitle}
            inputId={`pdf-input-${report.id}`}
          />
          {i < REPORTS.length - 1 && (
            <div key={`divider-${report.id}`} className="w-full max-w-lg border-t border-gray-800" />
          )}
        </>
      ))}
      <div className="w-full max-w-lg border-t border-gray-800" />
      <VideoUpload />
      <div className="w-full max-w-2xl border-t border-gray-800" />
      <JobsAdmin />
      <div className="w-full max-w-2xl border-t border-gray-800" />
      <InvestorDocsAdmin />
      <div className="w-full max-w-2xl border-t border-gray-800" />
      <InvestorAccessAdmin />
      <div className="w-full max-w-3xl border-t border-gray-800" />
      <AnalyticsDashboard />
      <p className="text-center text-gray-600 text-xs pb-8">
        This page is for internal use only - do not share the URL.
      </p>
    </div>
  );
}
