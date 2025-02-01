import "react";

declare global {
  interface User {
    id: string
    email: string
    name: string
    phoneNumber?: string
    gender?: string
  }

  interface GeocodingLocation {
    [key: string]: any
  }

  interface Ride {
    [key: string]: any
  }

  interface Suggestion {
    [key: string]: any
  }

  interface Invite {
    [key: string]: any
  }
}