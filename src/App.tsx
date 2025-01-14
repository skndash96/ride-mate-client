import React from 'react'
import { Route, Switch } from 'wouter'
import Home from './views/Home'
import Header from './components/Header'
import { AuthProvider } from './hooks/useAuth'
import Login from './views/Login'
import Profile from './views/Profile'

function App() {
  return (
    <AuthProvider>
      <div id="wrapper" className='flex flex-col min-h-screen'>
        <Header />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </AuthProvider>
  )
}

export default App
