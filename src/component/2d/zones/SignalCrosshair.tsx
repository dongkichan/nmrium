import type { Signal2D } from '@zakodium/nmr-types';
import { useMemo } from 'react';

import { buildID } from '../../../data/utilities/Concatenation.js';
import { useHighlight } from '../../highlight/index.js';
import SignalDeltaLine from '../SignalDeltaLine.js';

interface SignalCrosshairProps {
  signal: Signal2D;
}

function SignalCrosshair({ signal }: SignalCrosshairProps) {
  const highlightIDsX = useMemo(() => {
    return [buildID(signal.id, 'Crosshair'), buildID(signal.id, 'Crosshair_X')];
  }, [signal.id]);

  const highlightIDsY = useMemo(() => {
    return [buildID(signal.id, 'Crosshair'), buildID(signal.id, 'Crosshair_Y')];
  }, [signal.id]);

  const highlightX = useHighlight(highlightIDsX);
  const highlightY = useHighlight(highlightIDsY);
  const highlight = useHighlight([signal.id]);

  if (!signal?.x?.delta || !signal?.y?.delta) return null;

  return (
    <g>
      <SignalDeltaLine
        delta={signal.x.delta}
        axis="X"
        show={highlightX.isActive || highlight.isActive}
      />
      <SignalDeltaLine
        delta={signal.y.delta}
        axis="Y"
        show={highlightY.isActive || highlight.isActive}
      />
    </g>
  );
}

export default SignalCrosshair;
