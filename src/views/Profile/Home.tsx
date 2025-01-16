import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { FaEllipsisVertical, FaGripVertical, FaUser } from 'react-icons/fa6';
import { Link, Redirect, Route, Switch, useLocation } from 'wouter';
import Details from './Details';
import UserRides from './Rides';
import { apiFetch } from '../../utils/fetch';
import { Ride } from '../../hooks/useRide';
import { useNotifs } from '../../hooks/useNotifs';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { addNotification } = useNotifs();

  const [rides, setRides] = useState<Ride[]>([]);
  const [path] = useLocation();

  useEffect(() => {
    if (user) {
      apiFetch<Ride[]>('/api/rides', {
        addNotification
      })
        .then(rides => setRides(rides ?? []))
    } else {
      setRides([]);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className='grow p-4' >
        <div className='mx-auto loading loading-spinner loading-lg' />
      </div>
    )
  }

  if (!user) {
    return (
      <div className='grow p-4 text-center' >
        <Redirect to="/login" />
      </div>
    )
  }

  return (
    <div className='p-4 w-full max-w-2xl mx-auto' >
      <div className='flex items-center gap-2' >
        <code className='flex items-center gap-2'>
          <FaUserCircle size={20} />
          {user.email}
        </code>

        <div className='dropdown dropdown-start' >
          <button className='btn btn-sm btn-square bg-transparent border-0 rounded-full' role="button" >
            <FaEllipsisVertical />
          </button>

          <div className='p-0 w-24 menu dropdown-content bg-neutral-200 shadow rounded-lg' >
            <a href="/auth/signout" className='btn btn-sm btn-ghost hover:text-red-600' >
              Sign Out
            </a>
          </div>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2' >
        {[["/profile/details", "Details"], ["/profile/rides", "Rides"]].map(([href, name]) => (
          <Link key={href} href={href} className={`btn btn-sm border-0 ${path === href ? 'bg-neutral-300' : 'bg-transparent'} shadow-none`} >
            {name}
          </Link>
        ))}
      </div>

      <Switch>
        <Route path="/profile/details" component={Details} />
        <Route path="/profile/rides" component={UserRides} />
        <Route component={() => <Redirect to="/profile/details" />} />
      </Switch>
    </div>
  )
}
