import axios from 'axios'
import React, { useEffect } from 'react'
import { useCurrentRide } from '../../../hooks/useCurrentRide'
import CreateGroup from './create-group-modal'
import ReactJson from 'react-json-view'

export default function Suggestions() {
  const { currentRide } = useCurrentRide()
  const [suggestions, setSuggestions] = React.useState<Suggestion>([])
  const [loading, setLoading] = React.useState(true)

  const fetchSuggestions = () => {
    setLoading(true)

    axios.get('/api/suggestions')
      .then((response) => {
        setSuggestions(response.data?.data || [])
      })
      .catch(e => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!currentRide) {
      setSuggestions([])
      setLoading(false)
      return
    }

    fetchSuggestions()
  }, [currentRide])

  const handleAskToJoin = (groupId: string) => {
    axios.post(`api/invites`, {
      groupId
    })
      .then(() => {
        fetchSuggestions()
        alert('Request sent')
      })
      .catch(e => {
        console.error(e)
        alert('Error sending request')
      })
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1>
          Suggestions
        </h1>

        <CreateGroup />
      </div>

      {loading ? 'Loading...' : (
        <>
          {suggestions.length === 0 ? 'No suggestions yet' : (
            suggestions.map((suggestion: any) => (
              <div key={suggestion.routeId} className='bg-neutral-200'>
                <ReactJson name="suggestion" src={suggestion} collapsed={1} />
                <button disabled={!!suggestion.inviteStatus} onClick={handleAskToJoin.bind(null, suggestion.group.id)}>
                  {suggestion.inviteStatus ?? "Ask to Join"}
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
