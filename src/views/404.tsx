import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className='grow flex flex-col items-center justify-center'>
      <FaExclamationTriangle size={72} color="orange" />
      
      <h1 className='mt-8 text-xl font-semibold'>
        404 - Page Not Found
      </h1>

      <p className='mt-4'>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  )
}
