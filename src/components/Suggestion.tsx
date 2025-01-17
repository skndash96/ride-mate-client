import React from 'react'
import RideComponent from './Ride'
import { Ride } from '../types'
import { apiFetch } from '../utils/fetch';
import { useNotifs } from '../hooks/useNotifs';

export default function Suggestion({
  ride,
  refresh
}: {
  ride: Ride,
  refresh: () => void
}) {
  const { addNotification } = useNotifs();

  const handleRequestJoin = () => {
    apiFetch(`/api/invites`, {
      addNotification,
      fetchOptions: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toRideId: ride.id
        })
      }
    }).then(res => {
      if (res !== false) {
        addNotification("Request Sent", "success");
        refresh();
      }
    });
  };

  return (
    <div className='p-2 bg-neutral-100 rounded-lg shadow-md '>
      <RideComponent ride={ride} />

      <span>
        TODO: Show Useful data like recalculated distance, time
      </span>
      
      <button
        onClick={handleRequestJoin}
        className='mt-2 block btn btn-sm btn-neutral shadow'
        disabled={ride.recvInvs?.length ? ride.recvInvs?.[0].status === 'PENDING' : false}
      >
        {ride.recvInvs?.[0]?.status === "PENDING"
          ? 'Invite Pending'
          : 'Ask to Join'
        }
      </button>
    </div>
  )
}
