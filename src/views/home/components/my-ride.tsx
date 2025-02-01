import React from 'react'
import { useCurrentRide } from '../../../hooks/useCurrentRide'
import ReactJson from 'react-json-view'

export default function MyRide() {
  const { currentRide } = useCurrentRide()

  if (!currentRide) {
    return (
      <div>
        <h1>Ride</h1>
        <p>No ride found</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Ride</h1>

      <div className='bg-neutral-300'>
        <ReactJson name="My Ride" src={currentRide ?? {}} collapsed={1} />
      </div>

      <button disabled>
        Cancel Ride
      </button>

      {currentRide.group?.ownerRideId === currentRide.id && (
        <>
          <button disabled>
            Mark Group as Full
          </button>
          <button disabled>
            End Group
          </button>
        </>
      )}
    </div>
  )
}
