import { useState, useRef } from 'react'
import { Camera, Send, CheckCircle, AlertCircle, Loader2, ImagePlus } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'mailto'

// --- Submissions config (static-site friendly, no backend needed) -----------
// Get a free key at https://web3forms.com (enter hello@spectorlabs.io as the
// destination), then paste it below. Until then the form falls back to opening
// the visitor's email app pre-filled (photo attached manually).
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'
const CONTACT_EMAIL = 'hello@spectorlabs.io'
const keyReady = WEB3FORMS_ACCESS_KEY && !WEB3FORMS_ACCESS_KEY.startsWith('YOUR_')

export default function SubmissionForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const empty = {
    brand: '', productName: '', country: '', city: '', ply: '',
    scent: '', material: '', priceLocal: '', currency: '', retailer: '',
    notes: '', contributorName: '', contributorEmail: '',
  }
  const [form, setForm] = useState(empty)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Fallback: no key configured yet → open the visitor's email client.
    if (!keyReady) {
      const lines = [
        `Brand: ${form.brand}`,
        `Product: ${form.productName}`,
        `Country: ${form.country}${form.city ? ', ' + form.city : ''}`,
        form.ply && `Ply: ${form.ply}`,
        form.scent && `Scent: ${form.scent}`,
        form.material && `Material: ${form.material}`,
        (form.priceLocal || form.currency) && `Price: ${form.priceLocal} ${form.currency}`,
        form.retailer && `Retailer: ${form.retailer}`,
        form.notes && `Notes: ${form.notes}`,
        form.contributorName && `From: ${form.contributorName}`,
        '',
        '— Please attach your specimen photo to this email before sending. —',
      ].filter(Boolean).join('\n')
      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Roll Call specimen: ${form.brand} ${form.productName}`)}&body=${encodeURIComponent(lines)}`
      setStatus('mailto')
      return
    }

    setStatus('submitting')
    try {
      const fd = new FormData()
      fd.append('access_key', WEB3FORMS_ACCESS_KEY)
      fd.append('subject', `Roll Call specimen submission: ${form.brand} ${form.productName}`)
      fd.append('from_name', form.contributorName || 'Roll Call contributor')
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      const file = fileRef.current?.files?.[0]
      if (file) fd.append('Specimen photo', file)

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) {
        setStatus('success')
        setForm(empty)
        setFileName('')
        if (fileRef.current) fileRef.current.value = ''
      } else {
        setStatus('error')
        setErrorMsg(json.message || 'Submission failed. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Network error. Please try again.')
    }
  }

  const inputClass = "w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-3 font-body text-[13px] text-[#f0ece8] placeholder:text-[#555] focus:outline-none focus:border-[#c28223]/40 focus:ring-1 focus:ring-[#c28223]/20 transition-all"
  const labelClass = "block font-mono text-[9px] uppercase tracking-[0.25em] text-[#b6b0a6] mb-2"

  if (status === 'success' || status === 'mailto') {
    return (
      <div className="bg-[#141414] border border-[#228b68]/20 rounded-2xl p-10 text-center">
        <CheckCircle className="w-12 h-12 text-[#228b68] mx-auto mb-4" />
        <h3 className="font-display text-2xl text-[#f0ece8] mb-2">
          {status === 'mailto' ? 'Almost there' : 'Specimen Received'}
        </h3>
        <p className="font-body text-sm text-[#b6b0a6] mb-6 max-w-md mx-auto">
          {status === 'mailto'
            ? 'Your email app should have opened with the details filled in — attach your specimen photo and hit send. Thank you for contributing.'
            : 'Your submission has been received for verification. The archive team will review it and follow up if further documentation is needed.'}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 font-body text-[12px] text-[#c28223] hover:text-[#f0ece8] transition-colors"
        >
          Submit another specimen
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/5 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Camera className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
        <h3 className="font-display text-xl text-[#f0ece8]">Submit a Specimen</h3>
      </div>

      {status === 'error' && (
        <div className="mb-6 bg-[#8b2500]/10 border border-[#8b2500]/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#c85a32] mt-0.5 flex-shrink-0" />
          <p className="font-body text-[12px] text-[#c85a32]">{errorMsg || 'Something went wrong. Please try again.'}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Brand *</label>
          <input type="text" required aria-label="Brand" placeholder="e.g., Nepia, Tempo, Vinda" className={inputClass}
            value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input type="text" required aria-label="Product name" placeholder="e.g., Oshiri Celeb Premium 2-Ply" className={inputClass}
            value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Country *</label>
          <input type="text" required aria-label="Country" placeholder="e.g., Japan, Hong Kong" className={inputClass}
            value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input type="text" aria-label="City" placeholder="e.g., Tokyo, Singapore" className={inputClass}
            value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Ply Count</label>
          <input type="number" min={1} max={10} aria-label="Ply count" placeholder="e.g., 3" className={inputClass}
            value={form.ply} onChange={e => setForm(f => ({ ...f, ply: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Scent</label>
          <input type="text" aria-label="Scent" placeholder="e.g., Unscented, Floral" className={inputClass}
            value={form.scent} onChange={e => setForm(f => ({ ...f, scent: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Material</label>
          <input type="text" aria-label="Material" placeholder="e.g., Virgin Pulp, Bamboo" className={inputClass}
            value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Price (Local)</label>
          <input type="text" aria-label="Local price" placeholder="e.g., 35" className={inputClass}
            value={form.priceLocal} onChange={e => setForm(f => ({ ...f, priceLocal: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <input type="text" aria-label="Currency" placeholder="e.g., HKD, JPY" className={inputClass}
            value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} />
        </div>

        <div>
          <label className={labelClass}>Retailer</label>
          <input type="text" aria-label="Retailer" placeholder="e.g., Watsons, Don Quijote" className={inputClass}
            value={form.retailer} onChange={e => setForm(f => ({ ...f, retailer: e.target.value }))} />
        </div>

        {/* Specimen photo — the upload control only appears when a form
            backend is configured; otherwise we simply ask for an email
            attachment instead of exposing a disabled internal state. */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Specimen Photo{keyReady ? '' : ' — attach to your email'}</label>
          {keyReady ? (
            <label className={`${inputClass} flex items-center gap-3 cursor-pointer`}>
              <ImagePlus className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              <span className="text-[#b6b0a6] truncate">{fileName || 'Upload a photo of the packaging…'}</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                aria-label="Specimen photo"
                className="hidden"
                onChange={e => setFileName(e.target.files?.[0]?.name || '')}
              />
            </label>
          ) : (
            <p className={`${inputClass} flex items-center gap-3 text-[#b6b0a6]`}>
              <ImagePlus className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              Include a clear photo of the packaging with your email submission.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Collector Notes</label>
          <textarea rows={3} aria-label="Collector notes" placeholder="Where did you find it? Any observations about packaging, texture, or local context?"
            className={`${inputClass} resize-none`} value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-white/5">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#b6b0a6] mb-4">Contributor (Optional)</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Your Name</label>
              <input type="text" aria-label="Your name" placeholder="Field correspondent" className={inputClass}
                value={form.contributorName} onChange={e => setForm(f => ({ ...f, contributorName: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Your Email</label>
              <input type="email" aria-label="Your email" placeholder="For follow-up questions" className={inputClass}
                value={form.contributorEmail} onChange={e => setForm(f => ({ ...f, contributorEmail: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="magnetic-btn mt-8 w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f0ece8] text-[#0d0d0d] font-body text-sm px-8 py-4 rounded-full hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {status === 'submitting' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="w-4 h-4" /> Submit Specimen</>
        )}
      </button>
      <p className="font-body text-[11px] text-[#b6b0a6] mt-4">Submissions are sent to {CONTACT_EMAIL}.</p>
    </form>
  )
}
