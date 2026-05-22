'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a confirmation link!')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/'
      }
    }
    setLoading(false)
  }

  return (
    <main className="bg-gray-100 min-h-screen font-sans">

      {/* NAV */}
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="text-white font-bold text-xl tracking-tight no-underline">
            What It Really Cost
          </a>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="bg-gray-900 px-8 py-6">
            <h1 className="text-white font-bold text-2xl mb-1">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isSignUp
                ? 'Sign up to see builder names, exact costs and lessons learnt'
                : 'Sign in to unlock full listing details'}
            </p>
          </div>

          <div className="px-8 py-8">

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {/* Error / success messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-teal-50 border border-teal-200 text-teal-700 text-sm rounded-lg px-4 py-3 mb-4">
                {message}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${
                loading || !email || !password
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>

            {/* Toggle sign up / sign in */}
            <p className="text-center text-sm text-gray-500 mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
                className="text-teal-600 font-bold hover:text-teal-500"
              >
                {isSignUp ? 'Sign in' : 'Sign up for free'}
              </button>
            </p>

          </div>
        </div>
      </div>

    </main>
  )
}
