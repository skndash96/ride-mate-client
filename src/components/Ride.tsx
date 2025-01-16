import React from 'react'
import { Ride } from '../hooks/useRide'
import { FaLocationDot } from 'react-icons/fa6'

export default function RideComponent({
  ride
}: {
  ride: Ride
}) {
  return (
    <div className='p-2 bg-neutral-100 rounded-lg shadow-md text-sm grid grid-cols-[5rem_1fr] gap-2'>
      <strong className='mr-2'>Pickup:</strong>
      <span>
        <FaLocationDot className='opacity-75 mr-2 inline' />
        {ride.stops[0].name}
      </span>
      <strong className='mr-2'>Drop:</strong>
      <span>
        <FaLocationDot className='opacity-75 mr-2 inline' />
        {ride.stops[1].name}
      </span>
      <strong className='mr-2'>People:</strong>
      <span>
        {ride.peopleCnt} ({ride.peopleCnt - ride.femaleCnt} M, {ride.femaleCnt} F)
      </span>
      <span>
        Looking for {ride.reqCnt - ride.peopleCnt} more people
      </span>
      <strong className='mr-2'>Time:</strong>
      <span>
        {new Date(ride.depTime).toDateString()}, {new Date(ride.depTime).toLocaleTimeString()}
      </span>
      <strong className='mr-2'>Status:</strong>
      <span>{ride.status}</span>
    </div>
  )
}
