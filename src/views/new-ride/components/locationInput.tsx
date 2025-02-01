import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useLocation } from '../../../hooks/useLocation'

export default function LocationInput({
  label,
  onChange
}: {
  label: string,
  onChange: (value: GeocodingLocation | null) => void
}) {
  const [value, setValue] = useState<GeocodingLocation | null>(null)
  const { location } = useLocation()
  const tm = useRef<number | null>(null)
  const [suggestions, setSuggestions] = useState<GeocodingLocation[]>([])
  const [loading, setLoading] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tm.current) {
      clearTimeout(tm.current)
    }

    tm.current = setTimeout(() => {
      if (!e.target.value || e.target.value.length < 3) {
        setSuggestions([])
        return
      }

      setLoading(true)

      axios.get(`/api/geocoding/autocomplete?q=${e.target.value}&point=${location.lat},${location.lon}`)
        .then((res) => {
          setSuggestions(res.data.data)
        })
        .catch(e => {
          console.error(e)
          setSuggestions([])
        })
        .finally(() => {
          setLoading(false)
        })
    }, 500)
  }

  return (
    <div className='relative dropdown'>
      <div className='dropdown has-[input:focus]:dropdown-open'>
        <label>
          {label}
        </label>

        {value ? (
          <div className='inline-block bg-white'>
            {value.name}
            <button className='ml-2' onClick={() => {
              setValue(null)
              onChange(null)
            }}>
              edit
            </button>
          </div>
        ) : (
          <input
            tabIndex={1}
            className='ml-2 peer'
            onChange={handleInput}
            type="text"
            placeholder='type to search'
          />
        )}
      </div>

      <ul tabIndex={0} className="p-4 dropdown-content bg-white w-60">
        {loading ? (
          <li>
            loading...
          </li>
        ) : suggestions.length === 0 ? (
          <li>
            no results
          </li>
        ) : (
          <>
            {suggestions.map((suggestion) => (
              <li key={suggestion.osm_id}>
                <button tabIndex={2} className='z-[1]' onClick={() => {
                  setValue(suggestion)
                  onChange(suggestion)
                }}>
                  {suggestion.name}{suggestion.street && `, ${suggestion.street}`} ({suggestion.osm_value})
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}
