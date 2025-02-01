import React, { useEffect } from 'react'
import LocationInput from './components/locationInput'
import axios from 'axios'
import { useCurrentRide } from '../../hooks/useCurrentRide'
import { Redirect } from 'wouter'

export default function NewRide() {
  const { currentRide, refresh: refreshCurrentRide } = useCurrentRide()
  const [pickup, setPickup] = React.useState<GeocodingLocation | null>(null)
  const [drop, setDrop] = React.useState<GeocodingLocation | null>(null)
  const [peopleCnt, setPeopleCnt] = React.useState('')
  const [femaleCnt, setFemaleCnt] = React.useState('')
  const [earliestDeparture, setEarliestDeparture] = React.useState('')
  const [latestDeparture, setLatestDeparture] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleFindRide = () => {
    const n_peopleCnt = parseInt(peopleCnt)
    const n_femaleCnt = parseInt(femaleCnt)

    if (
      !pickup
      || !drop
      || isNaN(n_peopleCnt)
      || isNaN(n_femaleCnt)
      || !earliestDeparture
      || !latestDeparture
    ) {
      setLoading(false)
      alert('Invalid input')
      return
    }

    setLoading(true)

    axios.post('/api/rides', {
      stops: [pickup, drop].map(stop => ({
        address: `${stop.name}${stop.street ? `, ${stop.street}` : ''}${stop.city ? `, ${stop.city}` : ''}${stop.osm_value ?? ''}}`,
        lat: stop.point.lat,
        lng: stop.point.lng
      })),
      peopleCnt: n_peopleCnt,
      femaleCnt: n_femaleCnt,
      earliestDeparture: new Date(earliestDeparture).toISOString(),
      latestDeparture: new Date(latestDeparture).toISOString()
    })
      .then(() => {
        refreshCurrentRide()
      })
      .catch(e => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (currentRide) {
    return <Redirect to="/" />
  }

  return (
    <div>
      <h1>
        Find your Ride
      </h1>

      <LocationInput
        label="Pickup"
        onChange={setPickup}
      />

      <LocationInput
        label="Drop"
        onChange={setDrop}
      />

      <div>
        <label>
          People count
        </label>
        <input
          type="number"
          value={peopleCnt}
          onChange={(e) => setPeopleCnt(e.target.value)}
        />
      </div>

      <div>
        <label>
          Female count
        </label>
        <input
          type="number"
          value={femaleCnt}
          onChange={(e) => setFemaleCnt(e.target.value)}
        />
      </div>

      <div>
        <label>
          Earliest departure
        </label>
        <input
          type="datetime-local"
          value={earliestDeparture}
          onChange={(e) => setEarliestDeparture(e.target.value)}
        />
      </div>

      <div>
        <label>
          Latest departure
        </label>
        <input
          type="datetime-local"
          value={latestDeparture}
          onChange={(e) => setLatestDeparture(e.target.value)}
        />
      </div>

      <button disabled={loading} onClick={handleFindRide}>
        Find Ride
      </button>
    </div>
  )
}
