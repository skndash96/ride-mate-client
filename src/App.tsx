import React from 'react'
import { Redirect, Route, Switch } from 'wouter'
import NewRide from './views/new-ride/index'
import Login from './views/login'
import Home from './views/home/index'
import Header from './components/header'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, authLoading } = useAuth()

  return (
    <div id="wrapper" className='flex flex-col h-screen'>
      <Header />
      <main className='grow bg-neutral-100 flex flex-col'>
        {authLoading ? (
          <div>Loading...</div>
        ) : (!user) ? (
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/*" component={() => <Redirect to="/login" />} />
          </Switch>
        ) : (
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/new-ride" component={NewRide} />
            <Route path="/*" component={Home} />
          </Switch>
        )}
      </main>
    </div>
  )
}

export default App
