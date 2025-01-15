import React, { use, useEffect, useState } from 'react'
import MapComponent from '../components/Map'
import LocationInput from '../components/LocationInput';
import { autoComplete, Geocoding } from '../utils/autoComplete';

export default function NewRide() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pickup, setPickup] = useState<Geocoding | null>(null);
  const [drop, setDrop] = useState<Geocoding | null>(null);
  const [defaultSuggestions, setDefaultSuggestions] = useState<Geocoding[] | null>(null);

  useEffect(() => {
    if (userLocation === null) return;

    autoComplete('bus', userLocation, "amenity")
      .then((data) => setDefaultSuggestions(data))
      .catch((err) => {
        console.error(err)
        setDefaultSuggestions([]);
      });
  }, [userLocation]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([
        position.coords.latitude,
        position.coords.longitude,
      ]);

      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          alert('Please enable location services for easy usage.');
        }
      });
    });
  }, []);

  return (
    <div className='grow h-screen flex flex-col'>
      <div className='p-4 mb-8 w-full max-w-sm mx-auto flex flex-col gap-2'>
        <h1 className='text-lg font-semibold'>
          Find your Ride mates
        </h1>

        <div>
          <LocationInput
            label='Pickup'
            userLocation={userLocation}
            location={pickup}
            setLocation={setPickup}
            defaultSuggestions={defaultSuggestions}
          />
        </div>

        <div>
          <LocationInput
            label='Drop'
            userLocation={userLocation}
            location={drop}
            setLocation={setDrop}
            defaultSuggestions={defaultSuggestions}
          />
        </div>
      </div>

      <div className='relative grow w-full h-full'>
        {userLocation === null ? (
          <div className='absolute inset-0 skeleton' />
        ) : (
          <MapComponent
            userLocation={userLocation}
            pickup={pickup}
            drop={drop}
          />
        )}
      </div>

    </div>
  )
}
