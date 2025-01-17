import React, { useEffect, useState } from 'react'
import { useRide } from '../../hooks/useRide';
import { FaFilter, FaLocationDot } from 'react-icons/fa6';
import { apiFetch } from '../../utils/fetch';
import { useNotifs } from '../../hooks/useNotifs';
import { Ride } from '../../types';
import Suggestion from '../../components/Suggestion';

export default function Suggestions() {
  const { addNotification } = useNotifs();
  const { currentRide, refreshRide } = useRide();
  const [suggestedRides, setSuggestedRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const getSuggestions = () => {
    setLoading(true);

    apiFetch<Ride[]>("/api/rides/suggestions", {
      addNotification
    })
      .then(rides => {
        setLoading(false);
        setSuggestedRides(rides || []);
      });
  };

  useEffect(() => {
    if (currentRide === null) {
      setSuggestedRides([]);
      return;
    };

    getSuggestions();
  }, [currentRide]);

  return (
    <div className='p-4'>
      <button className='btn btn-sm'>
        <FaFilter />
        Filter
      </button>

      <ul className='mt-4 flex flex-col gap-4'>
        {loading && (
          <div className='loading loading-spinner loading-lg' />
        )}
        {suggestedRides.length === 0 && (
          <div className='w-fit mx-auto grid place-items-center gap-4'>
            <FaLocationDot size={50} className='text-2xl text-neutral-500' />
            <p className='text-neutral-500'>No suggested rides available</p>
          </div>
        )}
        
        {suggestedRides.map(ride => (
          <li key={ride.id}>
            <Suggestion ride={ride} refresh={getSuggestions} />
          </li>
        ))}
      </ul>
    </div>
  )
}
