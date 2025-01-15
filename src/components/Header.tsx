import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link, useLocation } from 'wouter';
import { FaRegUser } from 'react-icons/fa';

export default function Header() {
  const auth = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.user && location !== '/login') setLocation("/login");
      
  }, [auth, location]);
  
  return (
    <header className='p-1 flex justify-between items-stretch'>
      <h1 className=''>
        <Link to="/" className="btn btn-ghost btn-sm text-base">
          RideMate
        </Link>
      </h1>

      <Link
        to={auth.user ? "/profile" : "/login"}
        className="btn btn-sm shadow-sm"
      >
        <FaRegUser />
        {auth.user ? 'Profile' : 'Login'}
      </Link>
    </header>
  )
}
