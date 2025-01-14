import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link } from 'wouter'

export default function Login() {
  return (
    <div className='p-4 grow w-fit mx-auto flex flex-col items-center'>
      <h1 className='text-xl font-semibold'>
        Login
      </h1>

      {/* DONT use Link to force refresh page */}
      <a
        href="/auth/google"
        className='mt-4 btn bg-neutral-900 hover:bg-neutral-700 text-white shadow-sm'
      >
        <FaGoogle />
        Continue with google
      </a>
    </div>
  )
}
