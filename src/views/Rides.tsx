import React, { useEffect, useState } from 'react'
import { useRide } from '../hooks/useRide';
import { useLocation } from 'wouter';
import { FaLocationDot } from 'react-icons/fa6';
import { apiFetch } from '../utils/fetch';

export default function Rides() {
  const { currentRide, refreshRide } = useRide();
  const [href, setHref] = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRide === null) {
      setHref("/new");
    };
  }, [currentRide]);

  if (currentRide === null) {
    return null;
  }

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
      <div className='collapse collapse-arrow'>
        <input type="checkbox" name="current-ride" />
        <p className='collapse-title bg-neutral-200 border-b border-solid border-neutral-400'>
          Current Ride
        </p>
        <div className='p-2 collapse-content bg-neutral-200'>
          <div className='text-sm grid grid-cols-[5rem_1fr] gap-2'>
            <strong className='mr-2'>Pickup:</strong>
            <span>
              <FaLocationDot className='opacity-75 mr-2 inline' />
              {currentRide.stops[0].name}
            </span>
            <strong className='mr-2'>Drop:</strong>
            <span>
              <FaLocationDot className='opacity-75 mr-2 inline' />
              {currentRide.stops[1].name}
            </span>
            <strong className='mr-2'>People:</strong>
            <span>
              {currentRide.peopleCnt} ({currentRide.peopleCnt - currentRide.femaleCnt} M, {currentRide.femaleCnt} F)
            </span>
            <strong className='mr-2'>Time:</strong>
            <span>
              {new Date(currentRide.depTime).toDateString()}, {new Date(currentRide.depTime).toLocaleTimeString()}
            </span>
          </div>

          <button onClick={handleCancel} className='mt-4 btn btn-sm btn-error text-white'>
            {loading && (
              <div className='loading loading-spinner loading-sm' />
            )}
            Cancel Ride
          </button>
        </div>
      </div>
    </div>
  )
}
