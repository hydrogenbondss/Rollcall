import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Camera, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function SubmissionForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    brand: '',
    productName: '',
    country: '',
    city: '',
    ply: '',
    scent: '',
    material: '',
    priceLocal: '',
    currency: '',
    retailer: '',
    notes: '',
    contributorName: '',
    contributorEmail: '',
  })

  const createSubmission = trpc.submission.create.useMutation({
    onSuccess: () => {
      setStatus('success')
      setForm({
        brand: '', productName: '', country: '', city: '', ply: '',
        scent: '', material: '', priceLocal: '', currency: '', retailer: '',
        notes: '', contributorName: '', contributorEmail: '',
      })
    },
    onError: (err) => {
      setStatus('error')
      setErrorMsg(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    createSubmission.mutate({
      brand: form.brand,
      productName: form.productName,
      country: form.country,
      city: form.city || undefined,
      ply: form.ply ? parseInt(form.ply) : undefined,
      scent: form.scent || undefined,
      material: form.material || undefined,
      priceLocal: form.priceLocal || undefined,
      currency: form.currency || undefined,
      retailer: form.retailer || undefined,
      notes: form.notes || undefined,
      contributorName: form.contributorName || undefined,
      contributorEmail: form.contributorEmail || undefined,
    })
  }

  const inputClass = "w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-3 font-body text-[13px] text-[#f0ece8] placeholder:text-[#555] focus:outline-none focus:border-[#c28223]/40 focus:ring-1 focus:ring-[#c28223]/20 transition-all"
  const labelClass = "block font-mono text-[9px] uppercase tracking-[0.25em] text-[#888] mb-2"

  if (status === 'success') {
    return (
      <div className="bg-[#141414] border border-[#228b68]/20 rounded-2xl p-10 text-center">
        <CheckCircle className="w-12 h-12 text-[#228b68] mx-auto mb-4" />
        <h3 className="font-display text-2xl text-[#f0ece8] mb-2">Specimen Received</h3>
        <p className="font-body text-sm text-[#999] mb-6 max-w-md mx-auto">
          Your submission has been catalogued and assigned for verification. 
          The archive team will review and contact you if further documentation is needed.
        </p>
        <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider">
          Status: Pending Verification
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 font-body text-[12px] text-[#c28223] hover:text-[#f0ece8] transition-colors"
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
        {/* Required fields */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Brand *</label>
          <input
            type="text"
            required
            placeholder="e.g., Nepia, Tempo, Vinda"
            className={inputClass}
            value={form.brand}
            onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g., Oshiri Celeb Premium 4-Ply"
            className={inputClass}
            value={form.productName}
            onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Country *</label>
          <input
            type="text"
            required
            placeholder="e.g., Japan, Hong Kong"
            className={inputClass}
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            placeholder="e.g., Tokyo, Singapore"
            className={inputClass}
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Ply Count</label>
          <input
            type="number"
            min={1}
            max={10}
            placeholder="e.g., 3"
            className={inputClass}
            value={form.ply}
            onChange={e => setForm(f => ({ ...f, ply: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Scent</label>
          <input
            type="text"
            placeholder="e.g., Unscented, Applewood"
            className={inputClass}
            value={form.scent}
            onChange={e => setForm(f => ({ ...f, scent: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Material</label>
          <input
            type="text"
            placeholder="e.g., Virgin Pulp, Bamboo"
            className={inputClass}
            value={form.material}
            onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Price (Local)</label>
          <input
            type="text"
            placeholder="e.g., 35"
            className={inputClass}
            value={form.priceLocal}
            onChange={e => setForm(f => ({ ...f, priceLocal: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <input
            type="text"
            placeholder="e.g., HKD, JPY"
            className={inputClass}
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Retailer</label>
          <input
            type="text"
            placeholder="e.g., Watsons, Don Quijote"
            className={inputClass}
            value={form.retailer}
            onChange={e => setForm(f => ({ ...f, retailer: e.target.value }))}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Collector Notes</label>
          <textarea
            rows={3}
            placeholder="Where did you find it? Any observations about packaging, texture, or local context?"
            className={`${inputClass} resize-none`}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
        </div>

        {/* Contributor info */}
        <div className="sm:col-span-2 pt-4 border-t border-white/5">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#888] mb-4">Contributor (Optional)</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Your Name</label>
              <input
                type="text"
                placeholder="Field correspondent"
                className={inputClass}
                value={form.contributorName}
                onChange={e => setForm(f => ({ ...f, contributorName: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Your Email</label>
              <input
                type="email"
                placeholder="For follow-up questions"
                className={inputClass}
                value={form.contributorEmail}
                onChange={e => setForm(f => ({ ...f, contributorEmail: e.target.value }))}
              />
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
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Cataloguing...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Specimen
          </>
        )}
      </button>
    </form>
  )
}
