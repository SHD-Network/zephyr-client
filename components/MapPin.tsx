'use client';

import L from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';

const SafehouseMarker = new L.DivIcon({
  className: 'map-pin',
  html: `<div class='safehouse'><span></span></div>`,
});

type SafehouseProps = {
  position: [number, number];
  tooltip?: string;
};

function Safehouse({ position, tooltip }: SafehouseProps) {
  return (
    <Marker position={position} icon={SafehouseMarker}>
      {tooltip && (
        <Tooltip offset={[20, 0]} direction="right">
          {tooltip}
        </Tooltip>
      )}
    </Marker>
  );
}

export { Safehouse };
