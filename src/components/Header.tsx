import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'wouter';
import { FaRegUser } from 'react-icons/fa';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className='p-1 flex justify-between items-stretch'>
      <h1 className=''>
        <Link to="/" className="btn btn-ghost btn-sm text-base">
          Taximate
        </Link>
      </h1>

      <Link
        to={user ? "/profile" : "/login"}
        className="btn btn-sm shadow-sm"
      >
        <FaRegUser />
        {user ? 'Profile' : 'Login'}
      </Link>
    </header>
  )
}
