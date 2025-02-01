import axios from 'axios'
import React, { useState } from 'react'
import { useCurrentRide } from '../../../hooks/useCurrentRide'

export default function CreateGroup() {
  const { refresh } = useCurrentRide()
  const [modelOpen, setModelOpen] = useState(false)
  const [capacity, setCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState<'CAR' | 'TAXI' | 'AUTO'>('TAXI')
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    setModelOpen(true)
  }

  const handleSubmit = () => {
    setLoading(true)

    const n_capacity = parseInt(capacity)
    if (isNaN(n_capacity)) {
      setLoading(false)
      alert('Invalid capacity')
      return
    }

    axios.post("/api/groups", {
      capacity: n_capacity,
      vehicleType
    })
      .then(() => {
        refresh()
        setModelOpen(false)
      })
      .catch(e => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <button onClick={handleOpen}>
        Offer ride?
      </button>

      <div className={`modal ${modelOpen ? 'modal-open' : ''}`}>
        <div className='p-4 modal-content bg-neutral-200'>
          <button className='w-fit ml-auto' onClick={() => setModelOpen(false)}>
            close
          </button>
          <div>
            <label> Capacity </label>
            <input type='number' onChange={e => setCapacity(e.currentTarget.value)} />
          </div>

          <div>
            <label> Vehicle Type </label>
            <select onChange={e => setVehicleType(e.currentTarget.value as any)}>
              <option value='CAR'>Car</option>
              <option value='TAXI'>Taxi</option>
              <option value='AUTO'>Auto</option>
            </select>
          </div>

          <button disabled={loading} onClick={handleSubmit}>
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
}
