import React from 'react'
import { Link } from 'wouter'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user } = useAuth()

  return (
    <div className='flex justify-between'>
      <h2>
        <Link href="/">
          RideNITT
        </Link>
      </h2>

      <div>
        {user ? (
          <Link href="/profile">
            Profile ({user.name})
          </Link>
        ) : (
          <Link href="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  )
}
