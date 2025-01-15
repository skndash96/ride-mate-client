import React from 'react'
import { Route, Switch } from 'wouter'
import Home from './views/Home'
import Header from './components/Header'
import { AuthProvider } from './hooks/useAuth'
import Login from './views/Login'
import Profile from './views/Profile'
import NotFound from './views/404'
import NewRide from './views/NewRide'
import { NotifProvider } from './hooks/useNotifs'

function App() {
  return (
    <NotifProvider>
      <AuthProvider>
        <div id="wrapper" className='flex flex-col min-h-screen'>
          <Header />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/profile" component={Profile} />
            <Route path="/new" component={NewRide} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </AuthProvider>
    </NotifProvider>
  )
}

export default App
