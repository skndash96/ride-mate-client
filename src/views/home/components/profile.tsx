import React from 'react'
import { useAuth } from '../../../hooks/useAuth'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h1>Profile</h1>
      <p>{user?.email}</p>
      <p>{user?.name}</p>
      <a href="/auth/signout">
        sign out
      </a>
    </div>
  )
}
