import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className='grow flex flex-col items-center justify-center'>
      <FaExclamationTriangle size={50} color="red" />
      <h1>
        404 - Page Not Found
      </h1>
      <p>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  )
}
