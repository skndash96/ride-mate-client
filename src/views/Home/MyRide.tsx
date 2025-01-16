import React, { useState } from 'react'
import { useRide } from '../../hooks/useRide';
import NoCurrentRide from '../../components/NoCurrentRide';
import RideComponent from '../../components/Ride';
import { apiFetch } from '../../utils/fetch';

export default function MyRide() {
  const { currentRide, refreshRide } = useRide();
  const [loading, setLoading] = useState(false);

  if (!currentRide) {
    return (
      <NoCurrentRide />
    );
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
      <RideComponent ride={currentRide} />

      <button onClick={handleCancel} className='mt-4 btn btn-sm btn-error text-white block ml-auto'>
        {loading && (
          <div className='loading loading-spinner loading-sm' />
        )}
        Cancel Ride
      </button>
    </div>
  );
}
