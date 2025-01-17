import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

const LocationContext = createContext<[number, number] | null>(null);

export const useUserLocation = () => {
  const location = useContext(LocationContext);

  return location;
}

export const UserLocationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([
        position.coords.latitude,
        position.coords.longitude,
      ]);

      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          alert('Please enable location services for easy usage.');
        }
      });
    });
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};