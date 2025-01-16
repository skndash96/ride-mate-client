import React, { useEffect, useState } from 'react'
import { Ride, useRide } from '../../hooks/useRide';
import { FaFilter, FaLocationDot } from 'react-icons/fa6';
import { apiFetch } from '../../utils/fetch';
import RideComponent from '../../components/Ride';
import { useNotifs } from '../../hooks/useNotifs';
import NoCurrentRide from '../../components/NoCurrentRide';

export default function Suggestions() {
  const { addNotification } = useNotifs();
  const { currentRide, refreshRide } = useRide();
  const [suggestedRides, setSuggestedRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (currentRide === null) {
      setSuggestedRides([]);
      return;
    };

    apiFetch<Ride[]>("/api/rides/suggestions", {
      addNotification
    })
      .then(rides => {
        setSuggestedRides(rides ?? []);
      });
  }, [currentRide]);

  if (currentRide === null) {
    return (
      <NoCurrentRide />
    );
  }
  
  return (
    <div className='p-4'>
      <button className='btn btn-sm'>
        <FaFilter />
        Filter
      </button>

      <ul className='mt-4 flex flex-col gap-4'>
        {suggestedRides.length === 0 && (
          <div className='w-fit mx-auto grid place-items-center gap-4'>
            <FaLocationDot size={50} className='text-2xl text-neutral-500' />
            <p className='text-neutral-500'>No suggested rides available</p>
          </div>
        )}
        
        {suggestedRides.map(ride => (
          <li key={ride.id}>
            <RideComponent ride={ride} />
          </li>
        ))}
      </ul>
    </div>
  )
}
