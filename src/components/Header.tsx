import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'wouter';
import { FaRegUser } from 'react-icons/fa';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className='flex justify-between items-stretch bg-neutral-50'>
      <h1 className='px-2 py-1 text-lg font-semibold'>
        <Link to="/">
          Taximate
        </Link>
      </h1>

      <Link
        to={user ? "/profile" : "/login"}
        className="px-2 py-1 flex flex-row items-center gap-1 hover:bg-neutral-200"
      >
        <FaRegUser />
        {user ? 'Profile' : 'Login'}
      </Link>
    </header>
  )
}
