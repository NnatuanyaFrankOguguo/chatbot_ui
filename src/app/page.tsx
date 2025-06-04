// src/app/page.tsx
'use client'

import React from 'react'

export default function HomePage() {
  const handleSignIn = () => {
    window.location.href = 'http://localhost:8000/oauth/login' // Your FastAPI OAuth2 login endpoint
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to <span className="text-blue-400">AI Event Scheduler</span>
      </h1>
      <p className="mb-10 text-lg text-gray-300 text-center">
        Use AI to effortlessly manage your calendar events.
      </p>
      <button
        onClick={handleSignIn}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300"
      >
        Sign in with Google
      </button>
    </main>
  )
}
