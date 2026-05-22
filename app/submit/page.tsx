'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const REGIONS = [
  'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
  "Hawke's Bay", 'Taranaki', 'Manawatū-Whanganui', 'Wellington',
  'Tasman', 'Nelson', 'Marlborough', 'West Coast', 'Canterbury',
  'Otago', 'Southland'
]

const COST_RANGES = [
  'Under $200k', '$200k–$300k', '$300k–$400k', '$400k–$500k',
  '$500k–$600k', '$600k–$700k', '$700k–$800k', '$800k–$900k',
  '$900k–$1m', '$1m–$1.25m', '$1.25m–$1.5m', '$1.5m–$2m', 'Over $2m'
]

const YEARS = Array.from({ length: 15 }, (_, i) => (2025 - i).toString())
const HOUSE_TYPES = ['1 bedroom', '2 bedroom', '3 bedroom', '4 bedroom', '5+ bedroom']
const STEP_TITLES = ['About Your Build', 'Your Builder', 'The Costs', 'Your Experience', 'Photos & Final Details']

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const [form, setForm] = useState({
    region: '', year: '', houseType: '', floorArea: '',
    builderName: '', builderCity: '',
    quoteAmount: '', actualAmount: '', landscapingAmount: '', costRange: '',
    varianceReason: '', lessonsLearnt: '', overallExperience: '',
    happyToBeContacted: false, confirmAccurate: false,
    photos: [] as File[]
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const update = (field: string, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const canProceed = () => {
    if (step === 1) return form.region && form.year && form.houseType
    if (step === 2) return form.builderName && form.builderCity
    if (step === 3) return form.costRange
    if (step === 4) return true
    if (step === 5) return form.confirmAccurate
    return false
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You need to be signed in to submit a listing.')
      return
    }
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase
      .from('listings')
      .insert({
        user_id: user.id,
        house_type: form.houseType,
        floor_area: form.floorArea ? parseInt(form.floorArea) : null,
        region: form.region,
        year: form.year,
        builder_name: form.builderName,
        builder_city: form.builderCity,
        quote_amount: form.quoteAmount ? parseInt(form.quoteAmount) : null,
        actual_amount: form.actualAmount ? parseInt(form.actualAmount) : null,
        landscaping_amount: form.landscapingAmount ? parseInt(form.landscapingAmount) : null,
        cost_range: form.costRange,
        variance_reason: form.varianceReason || null,
        lessons_learnt: form.lessonsLearnt || null,
        overall_experience: form.overallExperience || null,
        happy_to_be_contacted: form.happyToBeContacted,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
  const labelClass = "block text-sm font-bold text-gray-700 mt-5 mb-1"
  const hintClass = "text-xs text-gray-400 mt-1 mb-1"

  if (submitted) {
    return (
      <main className="bg-gray-100 min-h-screen font-sans">
        <nav className="bg-gray-900 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
            <a href="/" className="text-white font-bold text-xl tracking-tight no-underline">What It Really Cost</a>
          </div>
        </nav>
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">🏠</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Build shared — thank you!</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Your submission helps the next person building in NZ. We really appreciate you paying it forward.
          </p>
          <a href="/" className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-lg text-sm transition-colors no-underline">
            Back to homepage
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-gray-100 min-h-screen font-sans">

      {/* NAV */}
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-white font-bold text-xl tracking-tight no-underline">What It Really Cost</a>
          <a href="/" className="text-gray-400 text-sm hover:text-white">← Back</a>
        </div>
      </nav>

      {/* PROGRESS */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">Step {step} of 5 — {STEP_TITLES[step - 1]}</span>
            <span className="text-sm font-bold text-teal-600">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-teal-600 rounded-full h-1.5 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEP_TITLES.map((title, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i + 1 < step ? 'bg-teal-600 text-white' :
                  i + 1 === step ? 'bg-gray-900 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-teal-600 font-bold' : 'text-gray-400'}`}>
                  {title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-900 px-8 py-5">
            <h1 className="text-white font-bold text-xl">{STEP_TITLES[step - 1]}</h1>
          </div>
          <div className="px-8 py-6">

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <p className="text-gray-500 text-sm mb-4">Tell us the basics about where and when you built.</p>

                <label className={labelClass}>Region</label>
                <select className={inputClass} value={form.region} onChange={e => update('region', e.target.value)}>
                  <option value="">Select a region...</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label className={labelClass}>Year completed</label>
                <select className={inputClass} value={form.year} onChange={e => update('year', e.target.value)}>
                  <option value="">Select a year...</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <label className={labelClass}>House type</label>
                <select className={inputClass} value={form.houseType} onChange={e => update('houseType', e.target.value)}>
                  <option value="">Select...</option>
                  {HOUSE_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>

                <label className={labelClass}>Floor area (m²) <span className="font-normal text-gray-400">— optional</span></label>
                <input className={inputClass} type="number" placeholder="e.g. 220" value={form.floorArea} onChange={e => update('floorArea', e.target.value)} />
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-4 text-sm text-teal-700">
                  🔒 Builder details are only visible to signed-in users.
                </div>
                <label className={labelClass}>Builder name</label>
                <input className={inputClass} type="text" placeholder="e.g. Fowler Homes" value={form.builderName} onChange={e => update('builderName', e.target.value)} />

                <label className={labelClass}>Builder city or town</label>
                <input className={inputClass} type="text" placeholder="e.g. Hamilton" value={form.builderCity} onChange={e => update('builderCity', e.target.value)} />
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <p className="text-gray-500 text-sm mb-4">All figures in NZD. Exact amounts only visible to signed-in users.</p>

                <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-2">
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">Build Costs</div>
                  <p className="text-xs text-teal-600">House construction only — not land, land remediation or landscaping.</p>
                </div>

                <label className={labelClass}>Original quote (NZD)</label>
                <input className={inputClass} type="number" placeholder="e.g. 550000" value={form.quoteAmount} onChange={e => update('quoteAmount', e.target.value)} />

                <label className={labelClass}>Final build cost (NZD)</label>
                <input className={inputClass} type="number" placeholder="e.g. 620000" value={form.actualAmount} onChange={e => update('actualAmount', e.target.value)} />

                {form.quoteAmount && form.actualAmount && Number(form.actualAmount) > Number(form.quoteAmount) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-2 text-sm text-amber-800">
                    ⚠ ${(Number(form.actualAmount) - Number(form.quoteAmount)).toLocaleString()} over quote ({Math.round(((Number(form.actualAmount) - Number(form.quoteAmount)) / Number(form.quoteAmount)) * 100)}% overrun)
                  </div>
                )}

                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-2">
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Landscaping & External Works</div>
                  <p className="text-xs text-gray-500">Optional. Kept separate so build cost comparisons stay accurate.</p>
                </div>

                <label className={labelClass}>Landscaping cost (NZD) <span className="font-normal text-gray-400">— optional</span></label>
                <input className={inputClass} type="number" placeholder="e.g. 25000" value={form.landscapingAmount} onChange={e => update('landscapingAmount', e.target.value)} />

                <label className={labelClass}>Build cost range — for public display <span className="text-red-400">*</span></label>
                <p className={hintClass}>What non-logged-in visitors see. Based on final build cost, excluding land and landscaping.</p>
                <select className={inputClass} value={form.costRange} onChange={e => update('costRange', e.target.value)}>
                  <option value="">Select a range...</option>
                  {COST_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label className={labelClass}>Reason for variance <span className="font-normal text-gray-400">— optional</span></label>
                <p className={hintClass}>Why did the final cost differ from the quote?</p>
                <textarea
                  className={`${inputClass} h-24 resize-y`}
                  placeholder="e.g. Timber prices increased mid-build, we also upgraded the kitchen..."
                  value={form.varianceReason}
                  onChange={e => update('varianceReason', e.target.value)}
                />
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-4 text-sm text-teal-700">
                  💡 Both fields are optional — but this is often the most valuable part for people researching a build.
                </div>

                <label className={labelClass}>Lessons learnt <span className="font-normal text-gray-400">— optional</span></label>
                <p className={hintClass}>What would you do differently? What surprised you?</p>
                <textarea
                  className={`${inputClass} h-32 resize-y`}
                  placeholder="e.g. We wish we had locked in our contract price earlier..."
                  value={form.lessonsLearnt}
                  onChange={e => update('lessonsLearnt', e.target.value)}
                />

                <label className={labelClass}>Overall experience <span className="font-normal text-gray-400">— optional</span></label>
                <p className={hintClass}>How was the process? Would you recommend your builder?</p>
                <textarea
                  className={`${inputClass} h-32 resize-y`}
                  placeholder="e.g. Our builder was excellent to deal with..."
                  value={form.overallExperience}
                  onChange={e => update('overallExperience', e.target.value)}
                />
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div>
                <label className={labelClass}>Photos <span className="font-normal text-gray-400">— up to 10</span></label>
                <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-3 text-xs text-teal-700">
                  📸 Tips: shoot in daylight · landscape orientation · tidy the space first · include 1 street front shot
                </div>
                <input
                  className={`${inputClass} py-2`}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    const files = Array.from(e.target.files || []).slice(0, 10)
                    update('photos', files)
                  }}
                />
                {form.photos.length > 0 && (
                  <p className="text-xs text-teal-600 font-bold mt-2">✓ {form.photos.length} photo{form.photos.length > 1 ? 's' : ''} selected</p>
                )}

                {!user && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-4 text-sm text-amber-800">
                    ⚠ You need to <a href="/login" className="font-bold underline">sign in</a> before you can submit a listing.
                  </div>
                )}

                <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="contact"
                    checked={form.happyToBeContacted}
                    onChange={e => update('happyToBeContacted', e.target.checked)}
                    className="mt-0.5 accent-teal-600 w-4 h-4"
                  />
                  <label htmlFor="contact" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                    I am happy for other signed-in users to contact me privately with questions about my build
                  </label>
                </div>

                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm"
                    checked={form.confirmAccurate}
                    onChange={e => update('confirmAccurate', e.target.checked)}
                    className="mt-0.5 accent-teal-600 w-4 h-4"
                  />
                  <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                    <strong>I confirm</strong> this information is accurate and reflects my genuine personal experience of this build
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mt-4">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  ← Back
                </button>
              ) : <div />}

              {step < 5 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className={`font-bold px-8 py-3 rounded-lg text-sm transition-colors ${
                    canProceed()
                      ? 'bg-gray-900 hover:bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className={`font-bold px-8 py-3 rounded-lg text-sm transition-colors ${
                    canProceed() && !loading
                      ? 'bg-teal-600 hover:bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit my build →'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
