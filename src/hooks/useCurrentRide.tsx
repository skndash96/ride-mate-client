import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

interface CurrentRideContextType {
  currentRide: Ride | null
  loading: boolean
  refresh: () => void
}

const CurrentRideContext = createContext<CurrentRideContextType | undefined>(undefined)

export const useCurrentRide = () => {
  const context = useContext(CurrentRideContext)
  if (context === undefined) {
    throw new Error('useCurrentRide must be used within a CurrentRideProvider')
  }
  return context
}

export const CurrentRideProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [currentRide, setCurrentRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCurrentRide = async () => {
    axios.get('/api/rides/current')
      .then(response => {
        setCurrentRide(response.data.data)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        setCurrentRide(null)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCurrentRide()
  }, [])

  return (
    <CurrentRideContext.Provider value={{ currentRide, loading, refresh: fetchCurrentRide }}>
      {children}
    </CurrentRideContext.Provider>
  )
}