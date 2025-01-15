import React, { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Geocoding } from '../utils/fetch';
import { Icon } from 'leaflet';

export default function MapComponent({
  userLocation,
  pickup,
  drop,
}: {
  userLocation: [number, number] //lat,lng
  pickup: Geocoding | null
  drop: Geocoding | null
}) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    }
  }, []);

  return (
    <MapContainer
      className='w-full h-full'
      center={userLocation}
      zoom={userLocation ? 15 : 9}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={new Icon({
        iconUrl: "pin.png",
        iconSize: [50,50],
        iconAnchor: [30,45],
        popupAnchor: [0, -45]
      })} position={userLocation}>
        <Popup>
          Your Location
        </Popup>
      </Marker>
      {pickup && (
        <Marker position={[pickup.point.lat, pickup.point.lng]}>
          <Popup>
            Pickup Location
          </Popup>
        </Marker>
      )}
      {drop && (
        <Marker position={[drop.point.lat, drop.point.lng]}>
          <Popup>
            Drop Location
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
