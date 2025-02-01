import React, { useMemo } from 'react'
import { Redirect, Route, Switch } from 'wouter'
import Invites from './components/receivedInvites'
import Suggestions from './components/suggestions'
import NotFound from './not-found'
import Tab from './components/tab'
import Ride from './components/my-ride'
import Profile from './components/profile'
import { useCurrentRide } from '../../hooks/useCurrentRide'
import SentInvites from './components/sentInvites'
import ReceivedInvites from './components/receivedInvites'

export default function Index() {
  const { currentRide, loading } = useCurrentRide()

  const isUngrouped = useMemo(() => {
    if (currentRide?.groupId) return false
    return true
  }, [currentRide])

  const isGroupOwner = useMemo(() => {
    if (currentRide?.group?.ownerRideId === currentRide?.id) return true
    return false
  }, [currentRide])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!currentRide) {
    return <Redirect to="/new-ride" />
  }

  return (
    <div className='grow flex flex-col'>
      <div className='grow'>
        <Switch>
          {isUngrouped ? (
            <Route path="/invites" component={SentInvites} />
          ) : isGroupOwner ? (
            <Route path="/invites" component={ReceivedInvites} />
          ) : null}

          {isUngrouped && (
            <Route path="/suggestions" component={Suggestions} />
          )}

          <Route path="/profile" component={Profile} />
          <Route path="/my-ride" component={Ride} />
          <Route path="/" component={() => <Redirect to="/my-ride" />} />
          <Route component={NotFound} />
        </Switch>
      </div>

      <Tab isGroupOwner={isGroupOwner} isUngrouped={isUngrouped} />
    </div>
  )
}
