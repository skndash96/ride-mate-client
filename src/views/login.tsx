import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'wouter'

export default function Login() {
  const { user } = useAuth()

  if (user) return (
    <div>
      <p>You are already logged in as {user.name}</p>
      <Link href="/">
        Home
      </Link>
    </div>
  )

  return (
    <div>
      <a href="/auth/google">Login with Google</a>
    </div>
  )
}
