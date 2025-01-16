import React, { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface MarkerType {
  label: string,
  lat: number,
  lng: number
}

const MapBounds = ({
  userLocation,
  markers
}: {
  userLocation: [number, number],
  markers: MarkerType[]
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.fitBounds([
      userLocation,
      ...markers.map(({ lat, lng }) => [lat, lng]) as [number, number][],
    ], {
      padding: [20, 20]
    });
  }, [map, markers]);

  return null;
};

export default function MapComponent({
  userLocation,
  markers
}: {
  userLocation: [number, number] //lat,lng
  markers: MarkerType[]
}) {
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

      <MapBounds userLocation={userLocation} markers={markers} />

      {markers.map(marker => (
        <Marker key={marker.label} position={[marker.lat, marker.lng]}>
          <Popup>
            {marker.label}
          </Popup>
        </Marker>
      ))}

      <Marker icon={new Icon({
        iconUrl: "pin.png",
        iconSize: [50, 50],
        iconAnchor: [30, 45],
        popupAnchor: [0, -45]
      })} position={userLocation}>
        <Popup>
          Your Location
        </Popup>
      </Marker>
    </MapContainer>
  );
}
