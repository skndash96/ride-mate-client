import React, { useEffect, useState } from 'react'
import { Ride } from '../../hooks/useRide';
import { apiFetch } from '../../utils/fetch';
import { useNotifs } from '../../hooks/useNotifs';
import RideComponent from '../../components/Ride';
import { useAuth } from '../../hooks/useAuth';
import { FaCarCrash } from 'react-icons/fa';

export default function UserRides() {
  const { user, loading: authLoading } = useAuth();
  const { addNotification } = useNotifs();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (user === null) {
      setRides([]);
      return;
    }

    apiFetch<Ride[]>('/api/rides', {
      addNotification
    })
      .then(rides => {
        setRides(rides ?? []);
        setLoading(false);
      });
  }, [authLoading]);

  return (
    <div className='p-4'>
      {loading && (
        <div className='loading loading-lg loading-spinner' />
      )}
      
      <ul className='mt-2 flex flex-col gap-4'>
        {rides.length === 0 && !loading && (
          <li className='text-center'>
            <span className='text-neutral-500' >
              <FaCarCrash className='mr-2 inline' size={32} />
              No rides found
            </span>
          </li>
        )}

        {rides.map(ride => (
          <li key={ride.id}>
            <RideComponent ride={ride} />
          </li>
        ))}
      </ul>
    </div>
  )
}
