import React from 'react'
import { Link } from 'wouter'

export default function Tab({
  isUngrouped,
  isGroupOwner
}: {
  isUngrouped: boolean
  isGroupOwner: boolean
}) {
  return (
    <div className='sticky bottom-0 flex justify-around w-full items-center bg-white'>
      <Link className="block" href="/my-ride">
        My Ride
      </Link>

      {(isUngrouped || isGroupOwner) && (
        <Link className="block" href="/invites">
          Invites
        </Link>
      )}
      {isUngrouped && (
        <Link className="block" href="/suggestions">
          Suggestions
        </Link>
      )}
    </div>
  )
}
