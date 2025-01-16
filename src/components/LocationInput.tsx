import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaSearchLocation } from 'react-icons/fa';
import { Geocoding } from '../utils/fetch';
import { FaXmark } from 'react-icons/fa6';
import { apiFetch } from '../utils/fetch';
import { useNotifs } from '../hooks/useNotifs';

export default function LocationInput({
  label,
  location,
  setLocation,
  userLocation,
  defaultSuggestions
}: {
  label: string,
  location: Geocoding | null,
  setLocation: (location: Geocoding | null) => void,
  defaultSuggestions: Geocoding[] | null,
  userLocation: [number, number] | null //lat, lng
}) {
  const { addNotification } = useNotifs();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [suggestions, setSuggestions] = useState<Geocoding[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputTimeout = useRef<number | null>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) {
      setSuggestions(null);
      return;
    }

    if (inputTimeout) clearTimeout(inputTimeout.current!);

    setLoading(true);

    inputTimeout.current = setTimeout(() => {
      const q = new URLSearchParams();

      q.set("q", e.target.value);
      if (userLocation) q.set("point", `${userLocation[0]},${userLocation[1]}`);

      apiFetch<Geocoding[]>("/api/geocoding/autocomplete?" + q.toString(), {
        addNotification
      })
        .then((data) => {
          setSuggestions(data);
          setLoading(false);
        })
    }, 500);
  };

  const handleClick = (suggestion: Geocoding) => {
    inputRef.current?.blur();
    setLocation(suggestion);
  };

  return (
    <div className='flex flex-col'>
      <h1 className='mb-1 text-sm'>
        {label}:
      </h1>

      {location ? (
        <div className='h-auto gap-2 padding-1 border border-[#1f293733] border-solid rounded-lg'>
          <button
            className='mx-1 translate-y-[2px] btn btn-xs btn-ghost btn-square'
            onClick={() => setLocation(null)}
          >
            <FaXmark size={16} />
          </button>

          <span className='text-sm leading-5'>
            {location.name} {location.street && ', ' + location.street} {location.city && ', ' + location.city}
          </span>
        </div>
      ) : (
        <div className='dropdown has-[input:focus]:dropdown-open'>
          <label className='input input-bordered input-sm h-auto flex items-center gap-2'>
            <FaSearchLocation className='opacity-75' />
            <input
              ref={inputRef}
              onChange={handleInput}
              type="text"
              className='p-1'
              placeholder="Type to Search"
            />
          </label>

          <ul
            tabIndex={0}
            className='p-2 w-full menu dropdown-content dropdown-bottom bg-neutral-300 rounded-md shadow z-[1001]'
          >
            {loading || defaultSuggestions === null ? (
              <div className='loading loading-spinner loading-xs' />
            ) :
              (suggestions ?? defaultSuggestions).map((suggestion: any) => (
                <li key={suggestion.osm_id}>
                  <button className='py-1 h-auto btn btn-sm btn-ghost font-medium justify-start hover:bg-neutral-400 text-left' onClick={() => handleClick(suggestion)}>
                    {suggestion.name} {suggestion.street && ', ' + suggestion.street} {suggestion.city && ', ' + suggestion.city}
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  )
}
