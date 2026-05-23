'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ListingPage() {

  const [listing, setListing] = useState<any>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('estimator')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (!id) { setLoading(false); return }

    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setListing(data)

        // Try to load photos by checking each possible filename
        const extensions = ['jpg', 'jpeg', 'png', 'apng', 'webp', 'heic']
        const foundUrls: string[] = []
        for (let i = 0; i < 10; i++) {
          for (const ext of extensions) {
            const { data: urlData } = supabase.storage
              .from('listing-photos')
              .getPublicUrl(`${data.id}/${i}.${ext}`)
            try {
              const res = await fetch(urlData.publicUrl, { method: 'HEAD' })
              if (res.ok) {
                foundUrls.push(urlData.publicUrl)
                break
              }
            } catch {}
          }
        }
        setPhotos(foundUrls)
      }
      setLoading(false)
    }
    fetchListing()
  }, [])

  if (loading) return (
    <main className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  if (!listing) return (
    <main className="bg-gray-100 min-h-screen font-sans flex items-center justify-center">
      <p className="text-gray-400">Listing not found.</p>
    </main>
  )

  const overrun = (listing.actual_amount || 0) - (listing.quote_amount || 0)
  const overrunPct = listing.quote_amount ? Math.round((overrun / listing.quote_amount) * 100) : 0
  const currentYear = 2025
  const buildYear = parseInt(listing.year)
  const yearsAgo = currentYear - buildYear
  const annualInflation = 0.06
  const estimatedToday = Math.round((listing.actual_amount || 0) * Math.pow(1 + annualInflation, yearsAgo) / 1000) * 1000

  const tabs = [
    { id: 'estimator',  label: 'Cost today'       },
    { id: 'variance',   label: 'Variance'         },
    { id: 'lessons',    label: 'Lessons learnt'   },
    { id: 'experience', label: 'Experience'       },
    { id: 'builder',    label: 'Builder response' },
  ]

  return (
    <main className="bg-gray-100 min-h-screen font-sans">

      {/* NAV */}
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-white font-bold text-xl tracking-tight no-underline">What It Really Cost</a>
          <div className="hidden md:flex items-center gap-3">
            <a href="/browse" className="text-gray-400 text-sm px-3 py-2 hover:text-white transition-colors">Browse builds</a>
            <a href="/submit" className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">Share my build</a>
            <a href="/login" className="text-gray-400 text-sm px-5 py-2 rounded-lg border border-white/20 hover:text-white transition-colors">Sign in</a>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <a href="/submit" className="bg-teal-600 text-white text-sm font-bold px-4 py-2 rounded-lg">Share</a>
            <a href="/login" className="text-gray-400 text-sm px-3 py-2 rounded-lg border border-white/20">Sign in</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        <a href="/browse" className="text-teal-600 text-sm font-bold no-underline hover:text-teal-500 mb-6 inline-block">
          ← Back to builds
        </a>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-1">
              {listing.house_type} {listing.floor_area && <span className="text-lg font-normal text-gray-500">({listing.floor_area}m²)</span>} · {listing.region}
            </h1>
            <p className="text-gray-500 text-sm">Completed {listing.year}</p>
          </div>
          <span className="bg-teal-100 text-teal-700 font-bold px-4 py-2 rounded-lg text-sm self-start md:self-auto">
            {listing.cost_range}
          </span>
        </div>

        {/* Photo grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8 rounded-xl overflow-hidden">
            {photos.map((url, i) => (
              <div
                key={i}
                className={`overflow-hidden bg-gray-200 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ height: i === 0 ? '400px' : '195px' }}
              >
                <img
                  src={url}
                  alt={`Build photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl h-64 flex items-center justify-center text-6xl text-gray-300 mb-8">
            🏠
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Cost breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h2 className="font-bold text-lg text-white">Cost breakdown</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Original quote</div>
                    <div className="text-xl font-bold text-gray-800">
                      {listing.quote_amount ? `$${listing.quote_amount.toLocaleString()}` : 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Final build cost</div>
                    <div className="text-xl font-bold text-gray-800">
                      {listing.actual_amount ? `$${listing.actual_amount.toLocaleString()}` : 'Not provided'}
                    </div>
                  </div>
                </div>

                {overrun > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-amber-800 text-sm font-bold">Over original quote</span>
                      <span className="text-amber-800 font-bold">${overrun.toLocaleString()} ({overrunPct}%)</span>
                    </div>
                    <div className="bg-amber-200 rounded-full h-2">
                      <div className="bg-amber-500 rounded-full h-2" style={{ width: `${Math.min(overrunPct * 2, 100)}%` }} />
                    </div>
                  </div>
                )}

                {listing.landscaping_amount > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-gray-700">Landscaping & external works</div>
                        <div className="text-xs text-gray-400 mt-0.5">Not included in build cost above</div>
                      </div>
                      <div className="text-sm font-bold text-gray-700">${listing.landscaping_amount.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TABS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <div className="flex overflow-x-auto gap-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-bold whitespace-nowrap rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                {activeTab === 'estimator' && (
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 mb-1">What would this cost today?</h2>
                    <p className="text-gray-500 text-sm mb-4">Based on NZ construction cost inflation of ~6% per year since {listing.year}.</p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-teal-600">${estimatedToday.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm">estimated in 2025</span>
                    </div>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                      <p className="text-xs text-teal-700">Estimate based on construction cost indices only — not land value, spec changes or regional variation.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'variance' && (
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 mb-3">Reason for variance</h2>
                    {listing.variance_reason
                      ? <p className="text-gray-600 text-sm leading-relaxed">{listing.variance_reason}</p>
                      : <p className="text-gray-400 text-sm italic">No reason for variance provided.</p>}
                  </div>
                )}
                {activeTab === 'lessons' && (
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 mb-3">Lessons learnt</h2>
                    {listing.lessons_learnt
                      ? <p className="text-gray-600 text-sm leading-relaxed">{listing.lessons_learnt}</p>
                      : <p className="text-gray-400 text-sm italic">No lessons learnt provided.</p>}
                  </div>
                )}
                {activeTab === 'experience' && (
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 mb-3">Overall experience</h2>
                    {listing.overall_experience
                      ? <p className="text-gray-600 text-sm leading-relaxed">{listing.overall_experience}</p>
                      : <p className="text-gray-400 text-sm italic">No overall experience provided.</p>}
                  </div>
                )}
                {activeTab === 'builder' && (
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 mb-3">Builder response</h2>
                    <p className="text-gray-400 text-sm italic">No response from builder yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col gap-4">

            {/* Builder card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Builder</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                  {listing.builder_name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{listing.builder_name}</div>
                  <div className="text-gray-500 text-sm">{listing.builder_city}</div>
                </div>
              </div>
            </div>

            {/* Contact */}
            {listing.happy_to_be_contacted && (
              <div className="bg-teal-600 rounded-xl p-6 text-center shadow-sm">
                <div className="text-white font-bold mb-2">Have a question?</div>
                <p className="text-teal-100 text-sm mb-4">This person is happy to be contacted about their build.</p>
                <a href="/login" className="block bg-white text-teal-700 font-bold text-sm py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors no-underline">
                  Sign in to send a message
                </a>
              </div>
            )}

            {/* Build details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Build details</h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-bold text-gray-700">{listing.house_type}</span>
                </div>
                {listing.floor_area && (
                  <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Floor area</span>
                    <span className="font-bold text-gray-700">{listing.floor_area}m²</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Region</span>
                  <span className="font-bold text-gray-700">{listing.region}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-bold text-gray-700">{listing.year}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Cost range</span>
                  <span className="font-bold text-gray-700">{listing.cost_range}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
                🚩 Report this listing
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-950 py-6 px-6 text-center mt-16">
        <p className="text-gray-600 text-xs">
          2025 What It Really Cost · All costs in NZD ·{' '}
          <a href="/privacy" className="text-gray-600 hover:text-gray-400">Privacy</a>
          {' · '}
          <a href="/terms" className="text-gray-600 hover:text-gray-400">Terms</a>
        </p>
      </div>

    </main>
  )
}
