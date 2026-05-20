export default function Home() {

  const listings = [
    { type: '4-bedroom home', region: 'Waikato',       year: '2023', range: '$500k–$600k' },
    { type: '3-bedroom home', region: 'Canterbury',    year: '2024', range: '$400k–$500k' },
    { type: '5-bedroom home', region: 'Auckland',      year: '2022', range: '$900k–$1m'   },
    { type: '3-bedroom home', region: 'Wellington',    year: '2023', range: '$600k–$700k' },
    { type: '4-bedroom home', region: 'Otago',         year: '2024', range: '$500k–$600k' },
    { type: '2-bedroom home', region: 'Bay of Plenty', year: '2022', range: '$300k–$400k' },
  ]

  const howItWorks = [
    { image: '/browse.jpg',  title: 'Browse freely',       desc: 'See builds by region, year and cost range — no sign-up needed.'                              },
    { image: '/Signin.jpg',  title: 'Sign in for details', desc: 'Free account unlocks builder names, exact costs and lessons learnt.'                         },
    { image: '/ask.jpg',     title: 'Ask real people',     desc: 'Contact submitters directly if they have opted in — answers from people who have been there.' },
    { image: '/share.jpg',   title: 'Share your build',    desc: 'Built in NZ? Share your costs and help the next person avoid the surprises you had.'         },
  ]

  return (
    <main className="font-sans bg-gray-100 min-h-screen">

      {/* NAV */}
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="text-white font-bold text-xl tracking-tight">
            What It Really Cost
          </span>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/browse" className="text-gray-400 text-sm px-3 py-2 hover:text-white transition-colors">
              Browse builds
            </a>
            <a href="/submit" className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors shadow-lg">
              Share my build
            </a>
            <a href="/login" className="text-gray-400 text-sm px-5 py-2 rounded-lg border border-white/20 hover:text-white transition-colors">
              Sign in
            </a>
          </div>
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            <a href="/submit" className="bg-teal-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
              Share
            </a>
            <a href="/login" className="text-gray-400 text-sm px-3 py-2 rounded-lg border border-white/20">
              Sign in
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative h-[420px] md:h-[580px] overflow-hidden">
        <img
          src="/WDIRC Homepage.png"
          alt="New Zealand home construction"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/20" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-6xl w-full mx-auto">
            <div className="max-w-xl">

              <div className="inline-block bg-teal-600/25 border border-teal-500 text-teal-200 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                New Zealand's only real build cost database
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                What does it <em className="italic text-teal-300 not-italic">really</em><br className="hidden md:block" /> cost to build?
              </h1>

              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                Actual costs. Real builders. Real experiences shared by New Zealanders who have been through it. No spin, no sales pitch.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/browse" className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-4 rounded-lg text-base text-center shadow-lg transition-colors">
                  Browse real builds →
                </a>
                <a href="/submit" className="bg-white/10 border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-base text-center transition-colors">
                  Share my build
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* TAGLINE STRIP */}
      <div className="bg-teal-600 border-t border-b border-white py-3 px-6">
        <p className="text-white text-sm md:text-base text-center max-w-2xl mx-auto leading-relaxed">
          A community driven site helping New Zealanders understand what it really costs to build — hear from people who have done it.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {howItWorks.map((item, i) => (
          <div key={i} className="overflow-hidden flex flex-col">
            <div className="h-36 md:h-48 overflow-hidden bg-gray-200">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-white text-center flex-1">
              <div className="font-bold text-sm text-gray-800 mb-1">{item.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT BUILDS */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-7 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Recent builds</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to unlock builder names and exact costs</p>
            </div>
            <a href="/browse" className="text-teal-600 font-bold text-sm hover:text-teal-500">View all builds →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((l, i) => (
              <a key={i} href="/listing" className="no-underline group">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-100 h-52 flex items-center justify-center text-5xl text-gray-400">
                    🏠
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-gray-800">{l.type}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{l.region} · {l.year}</div>
                    </div>
                    <span className="bg-teal-100 text-teal-700 rounded-lg px-3 py-1 text-xs font-bold whitespace-nowrap">
                      {l.range}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="bg-gray-900 py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Built a house in NZ?
          </h2>
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
            Pay it forward and share your story. It takes 10 minutes.
          </p>
          <a href="/submit" className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-bold px-10 py-4 rounded-lg text-base shadow-lg transition-colors">
            Share my build — it takes 10 minutes
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