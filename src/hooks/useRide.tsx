import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { useAuth } from "./useAuth";
import { apiFetch } from "../utils/fetch";
import { useNotifs } from "./useNotifs";
import { Ride } from "../types";

export interface RideContextType {
  currentRide: Ride | null;
  refreshRide: () => void;
  loading: boolean;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
  const context = useContext(RideContext);

  if (context === undefined) {
    throw new Error("useRide must be used within a RideProvider");
  }

  return context;
}

export const RideProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { addNotification } = useNotifs();
  const { user, loading: authLoading } = useAuth();
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRide = () => {
    apiFetch<Ride>("/api/rides/current", {
      addNotification
    })
    .then(ride => {
      setCurrentRide(ride || null);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      refreshRide();
    } else {
      setCurrentRide(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  return (
    <RideContext.Provider value={{
      currentRide,
      loading,
      refreshRide
    }}>
      {children}
    </RideContext.Provider>
  );
};