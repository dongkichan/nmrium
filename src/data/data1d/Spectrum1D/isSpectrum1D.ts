import type { Spectrum1D, Spectrum } from '@zakodium/nmrium-core';

export function isSpectrum1D(spectrum: Spectrum): spectrum is Spectrum1D {
  return spectrum && spectrum.info.dimension === 1;
}

export function isFid1DSpectrum(spectrum: Spectrum): spectrum is Spectrum1D {
  return isSpectrum1D(spectrum) && spectrum.info.isFid;
}

export function isFt1DSpectrum(spectrum: Spectrum): spectrum is Spectrum1D {
  return isSpectrum1D(spectrum) && spectrum.info.isFt;
}
