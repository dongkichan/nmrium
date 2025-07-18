import type { Zones as ZonesType } from '@zakodium/nmr-types';
import type { Display2D, Spectrum2D } from '@zakodium/nmrium-core';
import { memo } from 'react';

import useSpectrum from '../../hooks/useSpectrum.js';

import Zone from './Zone.js';

interface ZonesInnerProps {
  zones: ZonesType;
  display: Display2D;
}

function ZonesInner({ zones, display }: ZonesInnerProps) {
  return (
    <g className="2D-Zones">
      {display.isVisible &&
        zones.values.map((zone) => (
          <g className="zone" key={zone.id}>
            <Zone zoneData={zone} />
          </g>
        ))}
    </g>
  );
}

const MemoizedZones = memo(ZonesInner);

const emptyData = { zones: {}, display: {} };

export default function Zones() {
  const { zones, display } = useSpectrum(emptyData) as Spectrum2D;
  return <MemoizedZones {...{ zones, display }} />;
}
