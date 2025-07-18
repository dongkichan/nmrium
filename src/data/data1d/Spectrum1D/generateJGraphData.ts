import type { Jcoupling, Range, Signal1D } from '@zakodium/nmr-types';

/**
 * Links object that use coupling as key and value is an array of objects {id:signal id ,x:signal delta,y:coupling}
 */

interface Coupling {
  coupling: number;
  delta: number;
}

export interface CouplingLink {
  id: string;
  couplings: Coupling[];
  from: number;
  to: number;
}

interface GenerateJGraphDataResult {
  signals: Signal1D[];
  jCouplingMax: number;
  links: CouplingLink[];
}

export default function generateJGraphData(
  ranges: Range[],
  jGraphTolerance: number,
): GenerateJGraphDataResult | null {
  if (!ranges && !Array.isArray(ranges)) return null;

  const signals: Signal1D[] = [];
  let jCouplingMax = 0;
  const links: CouplingLink[] = createLinks(ranges, jGraphTolerance);
  for (const range of ranges) {
    for (const signal of range.signals) {
      const { id: signalId, ...restSignal } = signal;

      if (restSignal.js) {
        signals.push({ id: `${range.id}${signalId}`, ...restSignal });
        const tempMax = getJsCouplingMax(restSignal.js);
        jCouplingMax = Math.max(tempMax, jCouplingMax);
      }
    }
  }

  return { signals, jCouplingMax, links };
}

function getJsCouplingMax(js: Jcoupling[]): number {
  let max = Number.NEGATIVE_INFINITY;
  for (const { coupling } of js) {
    max = Math.max(coupling, max);
  }
  return max;
}

function getCouplings(ranges: Range[]): Coupling[] {
  const couplings: Coupling[] = [];
  for (const range of ranges) {
    for (const { delta, js } of range.signals) {
      for (const { coupling } of js || []) {
        couplings.push({ coupling, delta });
      }
    }
  }
  return couplings;
}

function initLink(coupling: Coupling): CouplingLink {
  const { delta } = coupling;
  return {
    id: crypto.randomUUID(),
    from: delta,
    to: delta,
    couplings: [coupling],
  };
}

function createLinks(ranges: Range[], jGraphTolerance = 0) {
  const couplings = getCouplings(ranges).sort(
    (a, b) => a.coupling - b.coupling,
  );

  if (!couplings || couplings.length === 0) return [];

  const links: CouplingLink[] = [initLink(couplings[0])];

  let index = 0;
  let start = index;
  let end = 1;

  while (end < couplings.length) {
    const nextCoupling = couplings[end];
    if (
      Math.abs(couplings[start].coupling - nextCoupling.coupling) <
      jGraphTolerance
    ) {
      links[index].couplings.push(nextCoupling);

      if (nextCoupling.delta > links[index].to) {
        links[index].to = nextCoupling.delta;
      } else if (nextCoupling.delta < links[index].from) {
        links[index].from = nextCoupling.delta;
      }

      end++;
    } else if (
      Math.abs(couplings[end - 1].coupling - nextCoupling.coupling) <
      jGraphTolerance
    ) {
      start = end - 1;
    } else {
      index++;
      links[index] = initLink(couplings[end]);
      start = end;
      end = end + 1;
    }
  }

  return links;
}
