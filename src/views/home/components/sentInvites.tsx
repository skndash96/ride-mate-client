import React, { useEffect } from 'react'
import { useCurrentRide } from '../../../hooks/useCurrentRide'
import axios from 'axios'
import ReactJson from 'react-json-view'

export default function SentInvites() {
  const { currentRide } = useCurrentRide()
  const [invites, setInvites] = React.useState<Invite[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const fetchInvites = () => {
    if (!currentRide) {
      setLoading(false)
      setInvites([])
      return
    }

    axios.get(`/api/invites/sent`)
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

  if (!currentRide) {
    return <p> No current ride </p>
  }

  return (
    <div>
      <h1> Sent Requests </h1>

      {loading && <p> Loading... </p>}

      {invites.length === 0 && !loading && <p> No invites </p>}

      {invites.map(invite => (
        <div key={invite.id} className='bg-neutral-300'>
          <ReactJson name="Invite" src={invite} collapsed={1} />
          <span className='bg-neutral-200'>
            {invite.status}
          </span>
        </div>
      ))}
    </div>
  )
}
