import type { CSSProperties } from 'react';
import { useMemo } from 'react';

import { useBrushTracker } from '../../EventsTrackers/BrushTracker.js';
import { useMouseTracker } from '../../EventsTrackers/MouseTracker.js';
import { useChartData } from '../../context/ChartContext.js';
import { useActiveSpectrum } from '../../hooks/useActiveSpectrum.js';
import { useFormatNumberByNucleus } from '../../hooks/useFormatNumberByNucleus.js';
import { LAYOUT, getLayoutID } from '../utilities/DimensionLayout.js';
import { get1DYScale, useScale2DX, useScale2DY } from '../utilities/scale.js';

const style: CSSProperties = {
  cursor: 'crosshair',
  position: 'absolute',
  paddingRight: '5px',
  fontWeight: 'bold',
  pointerEvents: 'none',
  overflow: 'visible',
  userSelect: 'none',
  zIndex: 10,
};

function XYLabelPointer({ layout, data1D }) {
  const position = useMouseTracker();
  const { step } = useBrushTracker();
  const {
    margin,
    width,
    height,
    yDomains,
    view: {
      spectra: { activeTab },
    },
  } = useChartData();

  const activeSpectrum = useActiveSpectrum();
  const trackID =
    position &&
    getLayoutID(layout, {
      startX: position.x,
      startY: position.y,
    });

  const nuclei = activeTab.split(',');
  const [formatX, formatY] = useFormatNumberByNucleus(nuclei);
  const scale2DX = useScale2DX();
  const scale2DY = useScale2DY();

  const scaleX = useMemo(() => {
    if (!activeSpectrum || !data1D || data1D.length === 0) {
      return scale2DX;
    }

    switch (trackID) {
      case LAYOUT.top:
      case LAYOUT.main: {
        return scale2DX;
      }
      case LAYOUT.left: {
        return scale2DY;
      }
      default:
        return null;
    }
  }, [activeSpectrum, data1D, scale2DX, scale2DY, trackID]);

  const scaleY = useMemo(() => {
    if (!activeSpectrum || !data1D || data1D.length === 0) {
      return scale2DY;
    }
    switch (trackID) {
      case LAYOUT.main: {
        return scale2DY;
      }
      case LAYOUT.top: {
        return data1D[0]
          ? get1DYScale(yDomains[data1D[0].id], margin.top)
          : null;
      }
      case LAYOUT.left: {
        return data1D[1]
          ? get1DYScale(yDomains[data1D[1].id], margin.left)
          : null;
      }
      default:
        return null;
    }
  }, [
    activeSpectrum,
    data1D,
    margin.left,
    margin.top,
    scale2DY,
    trackID,
    yDomains,
  ]);

  if (
    step === 'brushing' ||
    !position ||
    position.y < margin.top ||
    position.x < margin.left ||
    position.x > width - margin.right ||
    position.y > height - margin.bottom
  ) {
    return null;
  }

  const getXValue = (x = null) => {
    switch (trackID) {
      case LAYOUT.main:
      case LAYOUT.top: {
        return scaleX?.invert(x || position.x);
      }
      case LAYOUT.left: {
        return scaleX?.invert(x || position.y);
      }
      default:
        return 0;
    }
  };

  const getYValue = () => {
    switch (trackID) {
      case LAYOUT.main:
      case LAYOUT.top: {
        return scaleY?.invert(position.y);
      }
      case LAYOUT.left: {
        return scaleY?.invert(position.x);
      }
      default:
        return 0;
    }
  };

  return (
    <div
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px) translate(-100%,-100%)`,
      }}
    >
      <span>{formatY(getYValue())}</span>
      <span style={{ color: 'gray' }}>{','}</span>
      <span style={{ color: 'red' }}>{formatX(getXValue())}</span>
    </div>
  );
}

export default XYLabelPointer;
