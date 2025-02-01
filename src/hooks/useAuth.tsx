import React from "react";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null
  authLoading: boolean
  refresh: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const [authLoading, setAuthLoading] = useState(true)

  const refresh = () => {
    const token = document.cookie.split(";").find(c => c.includes("access-token"))?.split("=")[1]

    if (!token) {
      setUser(null)
      setAuthLoading(false)
      return
    }

    const payload = jwtDecode(token) as any
    
    if (payload?.user) {
      setUser(payload.user)
    } else {
      setUser(null)
    }

    setAuthLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <AuthContext.Provider value={{ user, authLoading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}