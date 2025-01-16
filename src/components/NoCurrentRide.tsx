import React from 'react'
import { FaCarCrash } from 'react-icons/fa'
import { Link } from 'wouter'

export default function NoCurrentRide() {
  return (
    <div className='p-4 grid place-items-center gap-4'>
      <FaCarCrash size={100} className='text-neutral-500' />

      <p className='text-neutral-500'>
        Create a new Ride to look for Ride mates.
      </p>

      <Link to="/new" className="btn btn-ghost rounded-3xl bg-neutral-200 hover:bg-neutral-300">
        Create Ride
      </Link>
    </div>
  )
}
