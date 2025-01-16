import React, { useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { useRide } from '../hooks/useRide';

export default function Home() {
  const { currentRide } = useRide();
  const [path, setPath] = useLocation();

  useEffect(() => {
    if (currentRide) {
      setPath("/rides");
    }
  }, [currentRide]);

  return (
    <div className='p-4 grow w-fit mx-auto flex flex-col items-center gap-4'>
      <h1 className='text-lg font-semibold'>
        Looking for Ride mates?
      </h1>
      <Link to="/new" className="btn bg-neutral-900 hover:bg-neutral-700 text-white">
        Find Ride mates
      </Link>
    </div>
  )
}
