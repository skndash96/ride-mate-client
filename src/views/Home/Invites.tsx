import React, { useEffect, useState } from 'react'
import { Invite } from '../../types';
import { apiFetch } from '../../utils/fetch';
import { useNotifs } from '../../hooks/useNotifs';
import RideComponent from '../../components/Ride';

export default function Invites() {
  const { addNotification } = useNotifs();
  const [incomingInvites, setIncomingInvites] = useState<Invite[]>([]);
  const [outgoingInvites, setOutgoingInvites] = useState<Invite[]>([]);
  const [isIncoming, setIsIncoming] = useState(true);
  const [incomingLoading, setIncomingLoading] = useState(true);
  const [outgoingLoading, setOutgoingLoading] = useState(true);

  const getInvites = () => {
    setIncomingLoading(true);
    setOutgoingLoading(true);

    apiFetch<Invite[]>("/api/invites/incoming", {
      addNotification
    })
      .then(data => {
        setIncomingLoading(false);
        if (data === false) return;
        setIncomingInvites(data ?? []);
      });

    apiFetch<Invite[]>("/api/invites/outgoing", {
      addNotification
    })
      .then(data => {
        setOutgoingLoading(false);
        if (data === false) return;
        setOutgoingInvites(data ?? []);
      });
  };

  useEffect(() => {
    getInvites();
  }, []);

  const handleAccept = (id: string) => {
    apiFetch(`/api/invites/${id}/accept`, {
      addNotification,
      fetchOptions: {
        method: 'POST'
      }
    })
      .then(res => {
        if (res !== false) {
          addNotification("Invite Accepted", "success");
          getInvites();
        }
      });
  };

  const handleDecline = (id: string) => {
    const reason = window.prompt("Reason for declining invite");

    apiFetch(`/api/invites/${id}/decline`, {
      addNotification,
      fetchOptions: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason
        })
      }
    })
      .then(res => {
        if (res !== false) {
          addNotification("Invite Declined", "success");
          getInvites();
        }
      });
  };

  return (
    <div className='p-4'>
      <div className='grid grid-cols-2 gap-2'>
        <button onClick={() => setIsIncoming(true)} className={`btn btn-sm ${isIncoming ? 'bg-neutral-900 hover:bg-neutral-700 text-white' : ''}`}>
          Incoming
        </button>
        <button onClick={() => setIsIncoming(false)} className={`btn btn-sm ${!isIncoming ? 'bg-neutral-900 hover:bg-neutral-700 text-white' : ''}`}>
          Outgoing
        </button>
      </div>

      <div className='mt-4 flex flex-col gap-4'>
        {isIncoming && incomingLoading && <div className='loading loading-spinner loading-lg' />}
        {!isIncoming && outgoingLoading && <div className='loading loading-spinner loading-lg' />}

        {isIncoming ? (
          incomingInvites.map(invite => (
            <div key={invite.id} className='p-2 bg-neutral-100 rounded-lg shadow-md'>
              <RideComponent ride={invite.fromRide} />

              <p className='mt-2 text-sm'>
                Invite Status: {invite.status}
              </p>

              {invite.status === "PENDING" && (
                <div className='mt-2 flex gap-2'>
                  <button onClick={() => handleAccept(invite.id)} className='btn btn-sm btn-neutral'>
                    Accept
                  </button>

                  <button onClick={() => handleDecline(invite.id)} className='btn btn-sm btn-neutral'>
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          outgoingInvites.map(invite => (
            <div key={invite.id} className='p-2 bg-neutral-100 rounded-lg shadow-md'>
              <RideComponent ride={invite.toRide} />

              <p className='mt-2 text-sm'>
                Invite Status: {invite.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
