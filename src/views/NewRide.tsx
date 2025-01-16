import React, { useEffect, useMemo, useState } from 'react'
import MapComponent from '../components/Map'
import LocationInput from '../components/LocationInput';
import { Geocoding } from '../utils/fetch';
import { FaLocationDot, FaTableList } from 'react-icons/fa6';
import { apiFetch } from '../utils/fetch';
import { useNotifs } from '../hooks/useNotifs';
import { useRide } from '../hooks/useRide';
import { useLocation } from 'wouter';

export default function NewRide() {
  const { addNotification } = useNotifs();
  const { currentRide, refreshRide } = useRide();
  const [path, setPath] = useLocation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pickup, setPickup] = useState<Geocoding | null>(null);
  const [drop, setDrop] = useState<Geocoding | null>(null);
  const [defaultSuggestions, setDefaultSuggestions] = useState<Geocoding[] | null>(null);
  const markers = useMemo(() => {
    const newMarkers = [];
    if (pickup) {
      newMarkers.push({
        label: 'pickup',
        lat: pickup.point.lat,
        lng: pickup.point.lng
      });
    }

    if (drop) {
      newMarkers.push({
        label: 'drop',
        lat: drop.point.lat,
        lng: drop.point.lng
      });
    }

    return newMarkers;
  }, [pickup, drop]);

  const [peopleCnt, setPeopleCnt] = useState('');
  const [femaleCnt, setFemaleCnt] = useState('');
  const [reqCnt, setReqCnt] = useState('');
  const [departureTime, setDepartureTime] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRide === null) return;

    setPath("/suggestions");
  }, [currentRide]);

  useEffect(() => {
    if (userLocation === null) return;

    const q = new URLSearchParams();

    q.set('q', 'bus');
    q.set('point', `${userLocation[0]},${userLocation[1]}`);
    q.set('osm_tag', 'amenity');

    apiFetch<Geocoding[]>("/api/geocoding/autocomplete?" + q.toString(), {
      addNotification
    })
      .then((data) => setDefaultSuggestions(data));
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

  const handleAdd = () => {
    setLoading(false);

    const _peopleCnt = parseInt(peopleCnt);
    const _femaleCnt = parseInt(femaleCnt);
    const _reqCnt = parseInt(reqCnt);

    if (
      pickup === null ||
      drop === null
    ) {
      addNotification('Please provide pickup and drop locations.', 'error');
    } else if (
      isNaN(_peopleCnt) ||
      isNaN(_femaleCnt)
    ) {
      addNotification('Please provide valid number of peopleCnt and femaleCnt.', 'error');
    } else if (
      _peopleCnt < 1
      || _femaleCnt < 0
      || _femaleCnt > _peopleCnt
    ) {
      addNotification('Invalid number of peopleCnt and femaleCnt.', 'error');
    } else if (
      isNaN(_reqCnt)
      || _reqCnt < 0
      || _reqCnt <= _peopleCnt
    ) {
      addNotification('Invalid number of people requested.', 'error');
    } else if (departureTime === null || new Date(departureTime).getTime() < Date.now()) {
      addNotification('Please provide valid departure time.', 'error');
    } else {
      setLoading(true);

      apiFetch('/api/rides', {
        fetchOptions: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stops: [pickup, drop].map(loc => ({
              name: `${loc.name} ${loc.street && ', ' + loc.street} ${loc.city && ', ' + loc.city}`,
              point: loc.point,
            })),
            peopleCnt: _peopleCnt,
            femaleCnt: _femaleCnt,
            reqCnt: _reqCnt,
            departureTime: new Date(departureTime).toISOString()
          })
        },
        addNotification
      })
        .then(() => {
          setLoading(false);
          refreshRide();
        });
    }
  };

  return (
    <div className='grow h-screen flex flex-col'>
      {page === 1 && (
        <div className='p-4 mb-8 w-full max-w-sm mx-auto flex flex-col gap-2'>
          <h1 className='text-lg font-semibold'>
            Ride Details
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

          <button
            className='btn btn-sm w-fit ml-auto text-white bg-neutral-900 hover:bg-neutral-700'
            onClick={() => setPage(2)}
            disabled={pickup === null || drop === null}
          >
            Next
          </button>
        </div>
      )}

      {page === 2 && (
        <div className='p-4 w-full max-w-sm mx-auto flex flex-col gap-8'>
          <h1 className='text-lg font-semibold'>
            Ride Details
          </h1>

          <div className='w-full flex flex-col gap-2'>
            <label className='text-sm'>
              How many of you are riding?
            </label>

            <div className='grid grid-cols-2 gap-2'>
              <input
                type='text'
                value={peopleCnt}
                onChange={(e) => setPeopleCnt(e.target.value)}
                className='inline input input-sm input-bordered'
                placeholder='total'
              />
              <input
                type='text'
                value={femaleCnt}
                onChange={(e) => setFemaleCnt(e.target.value)}
                className='inline input input-sm input-bordered'
                placeholder='females'
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm'>
              How many people are you looking for? <i>Include yourself</i>
            </label>

            <input
              value={reqCnt}
              onChange={(e) => setReqCnt(e.target.value)}
              type='text'
              className='input input-bordered input-sm'
              placeholder='people required'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm'>
              Departure Date and Time:
            </label>

            <input
              onChange={(e) => setDepartureTime(e.target.value)}
              type='datetime-local'
              className='input input-bordered input-sm'
              placeholder='Departure Date and Time'
            />
          </div>

          <div className='mt-2 w-fit ml-auto flex gap-2'>
            <button
              onClick={() => setPage(1)}
              className='btn btn-sm btn-ghost w-fit'
            >
              Back
            </button>
            <button
              disabled={isNaN(parseInt(peopleCnt)) || isNaN(parseInt(femaleCnt)) || departureTime === null}
              onClick={() => setPage(3)}
              className='btn btn-sm w-fit ml-auto text-white bg-neutral-900 hover:bg-neutral-700'
            >
              Next
            </button>
          </div>
        </div>
      )}

      {page === 3 && (
        <div className='p-4 w-full max-w-sm mx-auto flex flex-col gap-4'>
          <h1 className='text-lg font-semibold'>
            Confirm your details
          </h1>

          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='font-semibold'>
                <FaLocationDot className='mr-1 inline' />
                Pickup:
              </h2>
              <p className='mt-2'>
                {pickup?.name} {pickup?.street && ', ' + pickup.street} {pickup?.city && ', ' + pickup.city}
              </p>
            </div>

            <div>
              <h2 className='font-semibold'>
                <FaLocationDot className='mr-1 inline' />
                Drop:
              </h2>
              <p className='mt-2'>
                {drop?.name} {drop?.street && ', ' + drop.street} {drop?.city && ', ' + drop.city}
              </p>
            </div>

            <div>
              <h2 className='font-semibold'>
                <FaTableList className='mr-1 inline' />
                Ride Details:
              </h2>

              <p className='mt-2 text-sm'>
                {peopleCnt} {peopleCnt === "1" ? "person" : "people"}, ({parseInt(peopleCnt) - parseInt(femaleCnt)} M, {femaleCnt} F)
              </p>

              <p className='mt-2 text-sm'>
                Looking for {parseInt(reqCnt) - parseInt(peopleCnt)} more people
              </p>

              <p className='mt-2 text-sm'>
                Departure Time: {departureTime}
              </p>
            </div>
          </div>

          <div className='w-fit ml-auto flex gap-2'>
            <button
              onClick={() => setPage(2)}
              className='btn btn-sm btn-ghost w-fit'
            >
              Back
            </button>
            <button
              onClick={handleAdd}
              className='btn btn-sm w-fit ml-auto text-white bg-neutral-900 hover:bg-neutral-700'
            >
              {loading && (
                <div className='loading loading-spinner loading-sm' />
              )}
              Confirm
            </button>
          </div>
        </div>
      )}
      {page === 1 && (
        <div className='relative grow w-full h-full'>
          {userLocation === null ? (
            <div className='absolute inset-0 skeleton' />
          ) : (
            <MapComponent
              userLocation={userLocation}
              markers={markers}
            />
          )}
        </div>
      )}
    </div>
  );
}
