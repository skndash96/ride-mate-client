import React, { useEffect } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, polyline } from 'leaflet';

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
  const [markerCoords, setMarkerCoords] = React.useState<[number, number][]>([]);

  useEffect(() => {
    if (!map) return;

    const markerCoords = markers.map(({ lat, lng }) => [lat, lng]) as [number, number][];

    map.fitBounds([userLocation, ...markerCoords], {
      padding: [20, 20]
    });

    const connectMarkers = polyline(markerCoords).addTo(map);

    setMarkerCoords(markerCoords);

    return () => {
      connectMarkers.removeFrom(map);
    };
  }, [map, markers]);

  return null;
};

export default function MapComponent({
  userLocation,
  markers
}: {
  userLocation: [number, number],
  markers?: MarkerType[]
}) {
  return (
    <MapContainer
      className='w-full h-full'
      center={userLocation || undefined}
      zoom={userLocation ? 15 : 9}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers && (
        <>
          <MapBounds userLocation={userLocation} markers={markers} />

          {markers.map(marker => (
            <Marker key={marker.label} position={[marker.lat, marker.lng]}>
              <Popup>
                {marker.label}
              </Popup>
            </Marker>
          ))}
        </>
      )}

      {userLocation && (
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
      )}
    </MapContainer>
  );
}
