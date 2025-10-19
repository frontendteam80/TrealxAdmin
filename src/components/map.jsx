import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: '100%', height: '350px' };

export default function Map({ latitude, longitude, units }) {
  const center = { lat: latitude || 0, lng: longitude || 0 };
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={center} onClick={() => setSelectedMarker({ label: "Project Location", position: center })} />
      {units?.map(unit => (
        <Marker key={unit.id} position={{ lat: parseFloat(unit.latitude || latitude), lng: parseFloat(unit.longitude || longitude) }}
          onClick={() => setSelectedMarker({ label: `${unit.type}: ₹${unit.price}`, position: { lat: parseFloat(unit.latitude || latitude), lng: parseFloat(unit.longitude || longitude) } })}
        />
      ))}
      {selectedMarker && <InfoWindow position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
        <div>{selectedMarker.label}</div>
      </InfoWindow>}
    </GoogleMap>
  )
}
