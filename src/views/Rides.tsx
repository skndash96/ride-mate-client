import React, { useEffect, useState } from 'react'
import { Ride, useRide } from '../hooks/useRide';
import { Redirect, useLocation } from 'wouter';
import { FaFilter, FaLocationDot } from 'react-icons/fa6';
import { apiFetch } from '../utils/fetch';
import RideComponent from '../components/Ride';
import { useNotifs } from '../hooks/useNotifs';

export default function Rides() {
  const { currentRide, refreshRide } = useRide();
  const { addNotification } = useNotifs();
  const [suggestedRides, setSuggestedRides] = useState<Ride[]>([]);
  const [path, setPath] = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRide === null) {
      setPath("/new");
      return;
    };

    apiFetch<Ride[]>("/api/rides/suggestions", {
      addNotification
    })
      .then(rides => {
        setSuggestedRides(rides ?? []);
      });
  }, [currentRide]);

  const handleCancel = () => {
    if (window.confirm && !window.confirm("Are you sure you want to cancel this ride?")) return;

    setLoading(true);

    apiFetch("/api/rides/current", {
      fetchOptions: {
        method: "DELETE"
      }
    })
      .then(() => {
        refreshRide();
        setLoading(false);
      });
  };

  return (
    <div className='p-4'>
      {currentRide && (
        <div className='collapse collapse-arrow'>
          <input className='min-h-0 peer' type="checkbox" name="current-ride" />

          <p className='min-h-0 p-0 pl-4 py-1 collapse-title after:top-[16px_!important] bg-neutral-200 peer-checked:rounded-none rounded-xl'>
            Current Ride
          </p>

          <div className='peer-checked:p-2 collapse-content bg-neutral-200'>
            <RideComponent ride={currentRide} />

            <button onClick={handleCancel} className='mt-4 btn btn-sm btn-error text-white'>
              {loading && (
                <div className='loading loading-spinner loading-sm' />
              )}
              Cancel Ride
            </button>
          </div>
        </div>
      )}

      <button className='mt-4 btn btn-sm'>
        <FaFilter />
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
