import React, { useEffect } from 'react'
import { useCurrentRide } from '../../../hooks/useCurrentRide'
import axios from 'axios'
import ReactJson from 'react-json-view'

export default function ReceivedInvites() {
  const { currentRide } = useCurrentRide()
  const [invites, setInvites] = React.useState<Invite[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const fetchInvites = () => {
    if (!currentRide) {
      setLoading(false)
      setInvites([])
      return
    }

    axios.get(`/api/invites/received`)
      .then(res => {
        setInvites(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInvites()
  }, [currentRide])

  const handleAccept = (inviteId: string) => {
    axios.post(`/api/invites/${inviteId}/accept`)
      .then(() => {
        fetchInvites()
        alert('Request accepted')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleDecline = (inviteId: string) => {
    const reason = prompt('Reason for declining?')

    axios.post(`/api/invites/${inviteId}/decline`, {
      reason
    })
      .then(() => {
        fetchInvites()
        alert('Request declined')
      })
      .catch(err => {
        console.log(err)
      })
  }

  if (!currentRide) {
    return <p> No current ride </p>
  }

  return (
    <div>
      <h1> Received Requests </h1>

      {loading && <p> Loading... </p>}

      {invites.length === 0 && !loading && <p> No invites </p>}

      {invites.map(invite => (
        <div key={invite.id} className='bg-neutral-300'>
          <ReactJson name="invite" src={invite} collapsed={1} />

          {invite.status === 'PENDING' && (
            <>
              <button onClick={handleAccept.bind(null, invite.id)}>
                Accept
              </button>

              <button onClick={handleDecline.bind(null, invite.id)}>
                Decline
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
