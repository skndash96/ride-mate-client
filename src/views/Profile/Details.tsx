import React, { useEffect, useState } from 'react'
import { useAuth, User } from '../../hooks/useAuth';
import { Ride } from '../../hooks/useRide';
import { apiFetch } from '../../utils/fetch';
import { useNotifs } from '../../hooks/useNotifs';

export default function Details() {
  const { user } = useAuth();
  const { addNotification } = useNotifs();

  const [name, setName] = useState(user?.name ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    handleCancel();
  }, [user]);

  const handleCancel = () => {
    setEditing(false);
    setName(user?.name ?? '');
    setGender(user?.gender ?? '');
    setPhone(user?.phone ?? '');
  };

  const handleSave = () => {
    setLoading(true);

    apiFetch<User>('/api/users/me', {
      fetchOptions: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          gender,
          phone
        })
      },
      addNotification
    })
      .finally(() => {
        setEditing(false);
        setLoading(false);
      });
  };

  return (
    <div className='flex flex-col gap-4' >
      <div className='flex flex-col' >
        <label className='inline-block label text-sm' htmlFor="name" >
          Name:
        </label>
        <input
          name='name'
          className="shrink-1 input input-bordered shadow-sm input-sm disabled:hover:cursor-default disabled:text-neutral-900"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={!editing}
        />
      </div>

      <div className='flex flex-col' >
        <label className='inline-block label text-sm' htmlFor="gender" >
          Gender:
        </label>
        <select
          name="gender"
          value={gender}
          onChange={e => setGender(e.currentTarget.value)}
          className="shrink-1 select select-bordered shadow-sm select-sm disabled:hover:cursor-default disabled:placeholder:text-black disabled:text-neutral-900"
          disabled={!editing}
        >
          <option value="" >
            Select
          </option>
          <option value="MALE" >
            Male
          </option>
          <option value="FEMALE" >
            Female
          </option>
          <option value="OTHERS" >
            Others
          </option>
        </select>
      </div>

      <div className='flex flex-col' >
        <label className='inline-block label text-sm' htmlFor="phone" >
          Phone Number:
        </label>
        <input
          name='phone'
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="shrink-1 input input-bordered shadow-sm input-sm disabled:hover:cursor-default disabled:placeholder:text-black disabled:text-neutral-900"
          disabled={!editing}
        />
      </div>

      <div className='w-fit ml-auto' >
        {editing ? (
          <>
            <button onClick={handleCancel} className='btn btn-sm btn-ghost font-normal' >
              Cancel
            </button>
            <button onClick={handleSave} className='ml-2 btn btn-sm bg-neutral-900 hover:bg-neutral-700 text-white' >
              {loading && (
                <span className='loading loading-spinner loading-xs' />
              )
              }
              Save
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className='btn btn-sm bg-neutral-900 hover:bg-neutral-700 text-white'>
            Edit
          </button>
        )}
      </div>
    </div>
  )
}
