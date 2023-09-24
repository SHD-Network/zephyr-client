'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '@/styles/Pages/Maps.module.scss';
import { Safehouse } from '@/components/MapPin';

function MapsPage() {
  return (
    <div className={styles.maps}>
      <MapContainer
        center={[53.23566, -0.521296]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="http://localhost:8080/styles/dark/{z}/{x}/{y}.png" />
        <Safehouse
          position={[53.23591, -0.5219]}
          tooltip="Greetwell Safehouse"
        />
        <Safehouse
          position={[52.551135, -0.209015]}
          tooltip="Ellwood Safehouse"
        />
        <Safehouse
          position={[53.707635, -1.42988]}
          tooltip="Crescent Safehouse"
        />
        <Safehouse
          position={[52.55157, -0.21281]}
          tooltip="Coneygree Safehouse"
        />
      </MapContainer>
    </div>
  );
}

export default MapsPage;
