import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { FaEllipsisVertical, FaGripVertical } from 'react-icons/fa6';
import { Link, Redirect, Route, Switch, useLocation } from 'wouter';
import Details from './Details';
import UserRides from './Rides';
import { apiFetch } from '../../utils/fetch';
import { Ride } from '../../hooks/useRide';
import { useNotifs } from '../../hooks/useNotifs';

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
        Please login to view your profile.
      </div>
    )
  }

  return (
    <div className='p-4 w-full max-w-2xl mx-auto' >
      <div className='mb-4 text-center' >
        <h1 className='text-xl text-center font-semibold' >
          Profile
        </h1>

        <div className='flex flex-col items-start' >
          <code className='mt-2 ml-2' >
            {user.email}
          </code>

          <div className='flex items-center justify-center gap-2' >
            {[["/profile/details", "Details"], ["/profile/rides", "Rides"]].map(([href, name]) => (
              <Link href={href} className={`btn btn-sm border-0 ${path === href ? 'bg-neutral-200' : 'bg-transparent'}`} >
                {name}
              </Link>
            ))}

            <div className='dropdown dropdown-end' >
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
        </div>
      </div>

      {
        path === "/profile/details" ? (
          <Details user={user} />
        ) : path === "/profile/rides" ? (
          <UserRides rides={rides} />
        ) : (
          <Redirect to="/profile/details" />
        )
      }
    </div>
  )
}
