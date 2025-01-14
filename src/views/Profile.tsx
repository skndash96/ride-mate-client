import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, loading } = useAuth();

  return (
    <div>
      <h1>
        Profile
      </h1>

      <span>
        {user?.email ?? "Login"}
      </span>
    </div>
  )
}
