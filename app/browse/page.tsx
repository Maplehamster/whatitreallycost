'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const REGIONS = [
  'All regions', 'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
  "Hawke's Bay", 'Taranaki', 'Manawatū-Whanganui', 'Wellington',
  'Tasman', 'Nelson', 'Marlborough', 'West Coast', 'Canterbury',
  'Otago', 'Southland'
]

const COST_RANGES = [
  'All costs', 'Under $200k', '$200k–$300k', '$300k–$400k', '$400k–$500k',
  '$500k–$600k', '$600k–$700k', '$700k–$800k', '$800k–$900k',
  '$900k–$1m', '$1m–$1.25m', '$1.25m–$1.5m', '$1.5m–$2m', 'Over $2m'
]

const YEARS = ['All years', ...Array.from({ length: 15 }, (_, i) => (2025 - i).toString())]

export default function BrowsePage() {
  const [listings, setListings] = useState<any[]>([])
  const [coverPhotos, setCoverPhotos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('All regions')
  const [costRange, setCostRange] = useState('All costs')
  const [year, setYear] = useState('All years')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchListings()
  }, [region, costRange, year])

  const fetchListings = async () => {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (region !== 'All regions') query = query.eq('region', region)
    if (costRange !== 'All costs') query = query.eq('cost_range', costRange)
    if (year !== 'All years') query = query.eq('year', year)

    const { data, error } = await query
    if (!error && data) {
      setListings(data)
      // Fetch cover photo for each listing
      const extensions = ['jpg', 'jpeg', 'png', 'apng', 'webp', 'heic']
      const photos: Record<string, string> = {}
      for (const listing of data) {
        for (const ext of extensions) {
          const { data: urlData } = supabase.storage
            .from('listing-photos')
            .getPublicUrl(`${listing.id}/0.${ext}`)
          try {
            const res = await fetch(urlData.publicUrl, { method: 'HEAD' })
            if (res.ok) {
              photos[listing.id] = urlData.publicUrl
              break
            }
          } catch {}
        }
      }
      setCoverPhotos(photos)
    }
    setLoading(false)
  }

  const filtered = listings.filter(l =>
    search === '' ||
    l.house_type?.toLowerCase().includes(search.toLowerCase()) ||
    l.region?.toLowerCase().includes(search.toLowerCase()) ||
    l.builder_name?.toLowerCase().includes(search.toLowerCase())
  )

  const selectClass = "bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"

  return (
    <main className="bg-gray-100 min-h-screen font-sans">

      {/* NAV */}
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-white font-bold text-xl tracking-tight no-underline">
            What It Really Cost
          </a>
          <div className="hidden md:flex items-center gap-3">
            <a href="/browse" className="text-teal-400 text-sm px-3 py-2 font-bold">Browse builds</a>
            <a href="/submit" className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">Share my build</a>
            <a href="/login" className="text-gray-400 text-sm px-5 py-2 rounded-lg border border-white/20 hover:text-white transition-colors">Sign in</a>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <a href="/submit" className="bg-teal-600 text-white text-sm font-bold px-4 py-2 rounded-lg">Share</a>
            <a href="/login" className="text-gray-400 text-sm px-3 py-2 rounded-lg border border-white/20">Sign in</a>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="bg-gray-900 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white font-bold text-3xl tracking-tight mb-2">Browse builds</h1>
          <p className="text-gray-400 text-sm">Real costs from real New Zealanders. Sign in to see builder names and exact costs.</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search region, builder..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 flex-1 min-w-48"
          />
          <select className={selectClass} value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className={selectClass} value={costRange} onChange={e => setCostRange(e.target.value)}>
            {COST_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className={selectClass} value={year} onChange={e => setYear(e.target.value)}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(region !== 'All regions' || costRange !== 'All costs' || year !== 'All years' || search) && (
            <button
              onClick={() => { setRegion('All regions'); setCostRange('All costs'); setYear('All years'); setSearch('') }}
              className="text-sm text-gray-400 hover:text-gray-600 font-bold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6 font-bold">
          {loading ? 'Loading...' : `${filtered.length} build${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-52" />
                <div className="p-4">
                  <div className="bg-gray-200 h-4 rounded mb-2 w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No builds found</h2>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or be the first to share a build in this area.</p>
            <a href="/submit" className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-lg text-sm no-underline transition-colors">
              Share my build →
            </a>
          </div>
        )}

        {/* Listings grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((l, i) => (
              <a key={i} href={`/listing?id=${l.id}`} className="no-underline group">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Photo */}
                  {coverPhotos[l.id] ? (
                    <img
                      src={coverPhotos[l.id]}
                      alt={l.house_type}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-gray-200 to-gray-100 h-52 flex items-center justify-center text-5xl text-gray-300">
                      🏠
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <div className="font-bold text-sm text-gray-800">
                          {l.house_type} {l.floor_area ? `(${l.floor_area}m²)` : ''}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{l.region} · {l.year}</div>
                      </div>
                      <span className="bg-teal-100 text-teal-700 rounded-lg px-3 py-1 text-xs font-bold whitespace-nowrap">
                        {l.cost_range}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
                      🔒 Sign in to see builder & exact costs
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>

      {/* CTA */}
      <div className="bg-gray-900 py-16 px-6 text-center mt-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-white font-bold text-2xl mb-3">Built a house in NZ?</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">Pay it forward and share your story. It takes 10 minutes.</p>
          <a href="/submit" className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-lg text-sm transition-colors no-underline">
            Share my build →
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-950 py-6 px-6 text-center">
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

