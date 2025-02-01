import React, { createContext, useContext, useEffect, useState } from "react";

interface LocationContextType {
  location: {
    lat: number
    lon: number
  },
  loading: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const useLocation = () => {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }

  return context
}

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<LocationContextType['location']>({ lat: 0, lon: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
      setLoading(false)
    })
  }, [])

  return (
    <LocationContext.Provider value={{ location, loading }}>
      {children}
    </LocationContext.Provider>
  )
}