import React from 'react'
import { Link } from 'wouter'

export default function Home() {
  return (
    <div className='p-4 grow w-fit mx-auto flex flex-col items-center gap-4'>
      <h1 className='text-lg font-semibold'>
        Looking for Ride mates?
      </h1>
      <Link to="/new" className="btn bg-neutral-900 hover:bg-neutral-700 text-white">
        Find Ride mates
      </Link>
    </div>
  )
}
