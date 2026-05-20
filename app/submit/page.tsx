'use client'

import { useState } from 'react'

const REGIONS = [
  'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
  'Hawke\'s Bay', 'Taranaki', 'Manawatū-Whanganui', 'Wellington',
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

const colors = {
  charcoal: '#1f2937',
  teal: '#0d9488',
  tealLight: '#ccfbf1',
  tealMid: '#14b8a6',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray700: '#374151',
  white: '#ffffff',
}

const styles = {
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 8,
    border: `1.5px solid ${colors.gray200}`,
    fontSize: 15,
    boxSizing: 'border-box' as const,
    marginTop: 6,
    background: colors.white,
    color: colors.charcoal,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  label: {
    fontSize: 14,
    fontWeight: 600 as const,
    color: colors.gray700,
    display: 'block' as const,
    marginTop: 20,
  },
  hint: {
    fontSize: 13,
    color: colors.gray400,
    marginTop: 4,
    marginBottom: 0,
  },
  card: {
    background: colors.white,
    border: `1.5px solid ${colors.gray200}`,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  infoBox: {
    background: colors.tealLight,
    border: `1.5px solid #99f6e4`,
    borderRadius: 10,
    padding: '12px 16px',
    marginTop: 8,
    fontSize: 13,
    color: '#0f766e',
    lineHeight: 1.5,
  },
}

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    region: '', year: '', houseType: '',
    builderName: '', builderCity: '',
    quoteAmount: '', actualAmount: '', landscapingAmount: '', costRange: '',
    lessonsLearnt: '', overallExperience: '',
    happyToBeContacted: false, confirmAccurate: false,
    photos: [] as File[]
  })

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

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px' }}>

      {/* Top bar */}
      <div style={{ background: colors.charcoal, padding: '0 24px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <a href="/" style={{ color: colors.white, fontWeight: 700, fontSize: 18, textDecoration: 'none', letterSpacing: '-0.3px' }}>
            What It Really Cost
          </a>
          <a href="/" style={{ color: colors.gray400, fontSize: 13, textDecoration: 'none' }}>← Back</a>
        </div>
      </div>

      {/* Progress strip */}
      <div style={{ background: colors.white, borderBottom: `1px solid ${colors.gray200}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.charcoal }}>
              Step {step} of 5 — {STEP_TITLES[step - 1]}
            </span>
            <span style={{ fontSize: 13, color: colors.teal, fontWeight: 600 }}>
              {Math.round((step / 5) * 100)}% complete
            </span>
          </div>
          <div style={{ background: colors.gray200, borderRadius: 99, height: 5 }}>
            <div style={{
              background: `linear-gradient(90deg, ${colors.teal}, ${colors.tealMid})`,
              borderRadius: 99, height: 5,
              width: `${(step / 5) * 100}%`,
              transition: 'width 0.4s ease'
            }} />
          </div>
          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {STEP_TITLES.map((title, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: i + 1 <= step ? colors.teal : colors.gray200,
                  color: i + 1 <= step ? colors.white : colors.gray400,
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s'
                }}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, color: i + 1 === step ? colors.teal : colors.gray400, fontWeight: i + 1 === step ? 600 : 400, whiteSpace: 'nowrap' as const }}>
                  {title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div style={{ maxWidth: 660, margin: '32px auto', padding: '0 24px' }}>
        <div style={{ background: colors.white, borderRadius: 16, border: `1.5px solid ${colors.gray200}`, padding: '32px 36px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

          {/* Step 1 — About your build */}
          {step === 1 && (
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: colors.charcoal }}>About your build</h2>
              <p style={{ margin: '0 0 24px', color: colors.gray600, fontSize: 15 }}>Tell us the basics about where and when you built.</p>

              <label style={styles.label}>Region</label>
              <select style={styles.input} value={form.region} onChange={e => update('region', e.target.value)}>
                <option value="">Select a region...</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <label style={styles.label}>Year completed</label>
              <select style={styles.input} value={form.year} onChange={e => update('year', e.target.value)}>
                <option value="">Select a year...</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              <label style={styles.label}>House type</label>
              <select style={styles.input} value={form.houseType} onChange={e => update('houseType', e.target.value)}>
                <option value="">Select...</option>
                {HOUSE_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          )}

          {/* Step 2 — Your builder */}
          {step === 2 && (
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: colors.charcoal }}>Your builder</h2>
              <p style={{ margin: '0 0 16px', color: colors.gray600, fontSize: 15 }}>Who built your home?</p>

              <div style={styles.infoBox}>
                🔒 Builder details are only visible to signed-in users — not the general public.
              </div>

              <label style={styles.label}>Builder name</label>
              <input style={styles.input} type="text" placeholder="e.g. Fowler Homes" value={form.builderName} onChange={e => update('builderName', e.target.value)} />

              <label style={styles.label}>Builder's city or town</label>
              <input style={styles.input} type="text" placeholder="e.g. Hamilton" value={form.builderCity} onChange={e => update('builderCity', e.target.value)} />
            </div>
          )}

          {/* Step 3 — The costs */}
          {step === 3 && (
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: colors.charcoal }}>The costs</h2>
              <p style={{ margin: '0 0 16px', color: colors.gray600, fontSize: 15 }}>All figures in NZD. Exact amounts are only visible to signed-in users.</p>

              {/* Build costs section */}
              <div style={{ ...styles.card, borderColor: '#99f6e4', background: '#f0fdf9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.teal, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4 }}>
                  Build Costs
                </div>
                <p style={{ ...styles.hint, marginBottom: 12 }}>
                  Include the house construction only — not land purchase, land remediation, or landscaping.
                </p>

                <label style={{ ...styles.label, marginTop: 8 }}>Original quote (NZD)</label>
                <input style={styles.input} type="number" placeholder="e.g. 550000" value={form.quoteAmount} onChange={e => update('quoteAmount', e.target.value)} />

                <label style={styles.label}>Final build cost (NZD)</label>
                <input style={styles.input} type="number" placeholder="e.g. 620000" value={form.actualAmount} onChange={e => update('actualAmount', e.target.value)} />

                {form.quoteAmount && form.actualAmount && Number(form.actualAmount) > Number(form.quoteAmount) && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: '#fef3c7', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
                    ⚠ That's ${(Number(form.actualAmount) - Number(form.quoteAmount)).toLocaleString()} over the original quote ({Math.round(((Number(form.actualAmount) - Number(form.quoteAmount)) / Number(form.quoteAmount)) * 100)}% overrun)
                  </div>
                )}
              </div>

              {/* Landscaping section */}
              <div style={{ ...styles.card, marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.gray600, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4 }}>
                  Landscaping & External Works
                </div>
                <p style={{ ...styles.hint, marginBottom: 12 }}>
                  Optional. This is kept separate from build costs so comparisons stay accurate. Include driveway, fencing, garden, deck etc.
                </p>
                <label style={{ ...styles.label, marginTop: 8 }}>Landscaping cost (NZD)</label>
                <input style={styles.input} type="number" placeholder="e.g. 25000" value={form.landscapingAmount} onChange={e => update('landscapingAmount', e.target.value)} />
              </div>

              {/* Cost range */}
              <div style={{ marginTop: 20 }}>
                <label style={styles.label}>Build cost range — for public display <span style={{ color: 'red' }}>*</span></label>
                <p style={styles.hint}>This is what visitors see before signing in. Based on final build cost only, excluding land and landscaping.</p>
                <select style={styles.input} value={form.costRange} onChange={e => update('costRange', e.target.value)}>
                  <option value="">Select a range...</option>
                  {COST_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 4 — Experience */}
          {step === 4 && (
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: colors.charcoal }}>Your experience</h2>
              <p style={{ margin: '0 0 8px', color: colors.gray600, fontSize: 15 }}>Both fields are optional — but this is often the most valuable part for people researching a build.</p>

              <div style={styles.infoBox}>
                💡 Be honest — the good and the bad. This is what makes the site genuinely useful.
              </div>

              <label style={styles.label}>Lessons learnt <span style={{ fontWeight: 400, color: colors.gray400 }}>(optional)</span></label>
              <p style={styles.hint}>What would you do differently? What surprised you?</p>
              <textarea
                style={{ ...styles.input, height: 130, resize: 'vertical' as const }}
                placeholder="e.g. We wish we'd locked in our contract price earlier. The cost of timber went up significantly mid-build..."
                value={form.lessonsLearnt}
                onChange={e => update('lessonsLearnt', e.target.value)}
              />

              <label style={styles.label}>Overall experience <span style={{ fontWeight: 400, color: colors.gray400 }}>(optional)</span></label>
              <p style={styles.hint}>How was the process? Would you recommend your builder?</p>
              <textarea
                style={{ ...styles.input, height: 130, resize: 'vertical' as const }}
                placeholder="e.g. Our builder was excellent to deal with — responsive and honest about delays..."
                value={form.overallExperience}
                onChange={e => update('overallExperience', e.target.value)}
              />
            </div>
          )}

          {/* Step 5 — Photos & final details */}
          {step === 5 && (
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: colors.charcoal }}>Photos & final details</h2>
              <p style={{ margin: '0 0 16px', color: colors.gray600, fontSize: 15 }}>Almost done — add some photos and confirm your submission.</p>

              <label style={styles.label}>Photos <span style={{ fontWeight: 400, color: colors.gray400 }}>(up to 10)</span></label>
              <div style={{ ...styles.infoBox, marginBottom: 10 }}>
                📸 <strong>Tips for great photos:</strong> shoot in daylight · landscape orientation · tidy the space first · stand in corners to show the whole room · include 1 street front shot
              </div>
              <input
                style={{ ...styles.input, padding: 10 }}
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files || []).slice(0, 10)
                  update('photos', files)
                }}
              />
              {form.photos.length > 0 && (
                <p style={{ fontSize: 13, color: colors.teal, marginTop: 8, fontWeight: 600 }}>
                  ✓ {form.photos.length} photo{form.photos.length > 1 ? 's' : ''} selected
                </p>
              )}

              <div style={{ marginTop: 24, padding: '16px 20px', background: colors.gray100, borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <input
                  type="checkbox"
                  id="contact"
                  checked={form.happyToBeContacted}
                  onChange={e => update('happyToBeContacted', e.target.checked)}
                  style={{ marginTop: 3, accentColor: colors.teal, width: 16, height: 16 }}
                />
                <label htmlFor="contact" style={{ fontSize: 14, color: colors.gray700, cursor: 'pointer', lineHeight: 1.5 }}>
                  I'm happy for other signed-in users to contact me privately with questions about my build
                </label>
              </div>

              <div style={{ marginTop: 12, padding: '16px 20px', background: colors.gray100, borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <input
                  type="checkbox"
                  id="confirm"
                  checked={form.confirmAccurate}
                  onChange={e => update('confirmAccurate', e.target.checked)}
                  style={{ marginTop: 3, accentColor: colors.teal, width: 16, height: 16 }}
                />
                <label htmlFor="confirm" style={{ fontSize: 14, color: colors.gray700, cursor: 'pointer', lineHeight: 1.5 }}>
                  <strong>I confirm</strong> this information is accurate and reflects my genuine personal experience of this build
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: `1px solid ${colors.gray200}` }}>
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ background: colors.gray100, border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 15, cursor: 'pointer', fontWeight: 600, color: colors.gray700 }}
              >
                ← Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                style={{
                  background: canProceed() ? `linear-gradient(135deg, ${colors.charcoal}, #374151)` : colors.gray200,
                  color: canProceed() ? colors.white : colors.gray400,
                  border: 'none', borderRadius: 8, padding: '12px 28px',
                  fontSize: 15, cursor: canProceed() ? 'pointer' : 'not-allowed',
                  fontWeight: 600, boxShadow: canProceed() ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                disabled={!canProceed()}
                style={{
                  background: canProceed() ? `linear-gradient(135deg, ${colors.teal}, ${colors.tealMid})` : colors.gray200,
                  color: canProceed() ? colors.white : colors.gray400,
                  border: 'none', borderRadius: 8, padding: '12px 28px',
                  fontSize: 15, cursor: canProceed() ? 'pointer' : 'not-allowed',
                  fontWeight: 600, boxShadow: canProceed() ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
                }}
              >
                Submit my build →
              </button>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}