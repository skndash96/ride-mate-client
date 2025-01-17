export interface User {
  id: number;
  name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHERS' | null;
  phone?: string;
  provider: string;
  email: string;
}

export interface Group {
  id: string;
  rides: Ride[];
}

export interface Message {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

export interface Ride {
  id: number;
  depTime: Date;
  peopleCnt: number;
  femaleCnt: number;
  reqCnt: number;
  user: {
    name: string;
  };
  stops: {
    name: string;
    lat: number;
    lng: number;
  }[];
  status: string;
  recvInvs?: Invite[]
  group?: Group;
}

export interface Invite {
  id: string;
  status: string;
  fromRide: Ride;
  toRide: Ride;
}

export type Geocoding = {
  point: {
    lat: number
    lng: number
  }
  [key: string]: any
};

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}