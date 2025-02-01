import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import { CurrentRideProvider } from './hooks/useCurrentRide'
import './index.css'
import { LocationProvider } from './hooks/useLocation'

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <LocationProvider>
        <CurrentRideProvider>
          <App />
        </CurrentRideProvider>
      </LocationProvider>
    </AuthProvider>
  </React.StrictMode>
);