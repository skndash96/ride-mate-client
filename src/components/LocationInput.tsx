import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaSearchLocation } from 'react-icons/fa';
import { autoComplete, Geocoding } from '../utils/autoComplete';
import { FaXmark } from 'react-icons/fa6';

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
      autoComplete(e.target.value, userLocation)
        .then((data) => {
          setSuggestions(data);
        }).catch((err) => {
          setSuggestions(null);
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });

    }, 500);
  };

  const handleClick = (suggestion: Geocoding) => {
    inputRef.current?.blur();
    console.log(suggestion);
    setLocation(suggestion);
  };

  return (
    <div className='flex flex-col'>
      <h1 className='mb-1 text-sm'>
        {label}:
      </h1>

      {location ? (
        <div className='h-auto gap-2 padding-1 border border-[#1f293733] border-solid'>
          <button
            className='mx-1 translate-y-1 btn btn-xs btn-ghost btn-square'
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
                  <button className='py-1 h-auto btn btn-sm btn-ghost font-medium justify-start hover:bg-neutral-400' onClick={() => handleClick(suggestion)}>
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
