import React, { useEffect, useState } from 'react'
import { useRide } from '../../hooks/useRide';
import RideComponent from '../../components/Ride';
import { apiFetch } from '../../utils/fetch';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Message } from '../../types';
import { useNotifs } from '../../hooks/useNotifs';
import MapComponent from '../../components/Map';
import { useUserLocation } from '../../hooks/useUserLocation';

export default function MyRide() {
  const { addNotification } = useNotifs();
  const { currentRide, refreshRide } = useRide();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const userLocation = useUserLocation();

  useEffect(() => {
    if (currentRide === null || currentRide.group === null) {
      setMessages([]);
      return;
    }

    apiFetch<Message[]>(`/api/groups/messages`, {
      addNotification
    })
      .then(data => {
        setMessages(data || []);
      });
  }, []);

  const handleCancel = () => {
    if (window.confirm && !window.confirm("Are you sure you want to cancel this ride?")) return;

    setLoading(true);

    apiFetch("/api/rides/current", {
      fetchOptions: {
        method: "DELETE"
      }
    })
      .then(res => {
        if (res === false) return;

        refreshRide();
        setLoading(false);
      });
  };

  const handleLeave = () => {
    if (window.confirm && !window.confirm("Are you sure you want to leave this group?")) return;

    setLoading(true);

    apiFetch("/api/groups/leave", {
      fetchOptions: {
        method: "DELETE"
      }
    })
      .then(() => {
        setLoading(false);        
        refreshRide();
      });
  };

  return (
    <div className='grow flex flex-col'>
      <div className='relative grow h-48'>
        <div className='absolute top-0 left-0 w-full h-full'>
          {userLocation ? (
            <MapComponent
              userLocation={userLocation}
              markers={currentRide
                ?.group
                ?.rides
                ?.map(ride => ride.stops.map(stop => ({
                  label: stop.name,
                  lat: stop.lat,
                  lng: stop.lng
                }))).flat(1)
                || []
              }
            />
          ) : (
            <div className='skeleton w-full h-full rounded-none' />
          )}
        </div>
      </div>

      <div className='p-4'>
        <div className='flex items-center gap-2'>
          <h1 className='font-semibold'>
            Your Ride Group
          </h1>

          <div className='dropdown dropdown-start' >
            <button className='btn btn-sm btn-square border-0 rounded-full' role="button" >
              <FaEllipsisVertical />
            </button>

            <div className='p-0 w-fit menu dropdown-content z-[2] bg-neutral-300 shadow rounded-lg'>
              <button onClick={handleLeave} disabled={loading} className='w-max btn btn-sm btn-ghost hover:text-red-600'>
                {loading && (
                  <div className='loading loading-spinner loading-sm' />
                )}
                Leave Group
              </button>
              <button onClick={handleCancel} disabled={loading} className='w-max btn btn-sm btn-ghost hover:text-red-600'>
                {loading && (
                  <div className='loading loading-spinner loading-sm' />
                )}
                Cancel Ride
              </button>
            </div>
          </div>
        </div>

        {currentRide!.group && (
          <div className='mt-2 text-sm'>
            <strong className='mr-2'>
              Rides connected:
            </strong>

            <span>
              {currentRide?.group.rides.map(ride => ride.user.name).join(', ')}
            </span>
          </div>
        )}

        <div className='mt-4 text-sm'>
          TODO: Connect stops meaningfully using Graphhopper route solver<br />
          TODO: Show estimated distance and time (based on route optimized by graphhopper)<br />
          TODO: Chat for sharing information<br />
          TODO: Add Socket.io in invitations and chat
        </div>
      </div>
    </div>
  );
}
