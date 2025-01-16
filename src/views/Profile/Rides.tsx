import React, { useEffect, useState } from 'react'
import { Ride } from '../../hooks/useRide';
import { apiFetch } from '../../utils/fetch';
import { useNotifs } from '../../hooks/useNotifs';
import RideComponent from '../../components/Ride';

export default function UserRides({
  rides
}: {
  rides: Ride[]
}) {
  return (
    <div className='p-4'>
      <h1 className='font-semibold text-lg' >
        Ride History
      </h1>

      <ul className='mt-2 flex flex-col gap-4'>
        {rides.map(ride => (
          <li key={ride.id}>
            <RideComponent ride={ride} />
          </li>
        ))}
      </ul>
    </div>
  )
}
