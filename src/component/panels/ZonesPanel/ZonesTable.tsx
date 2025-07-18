import styled from '@emotion/styled';
import type { Info2D } from '@zakodium/nmr-types';
import type {
  Zones1DNucleusPreferences,
  Zones2DNucleusPreferences,
} from '@zakodium/nmrium-core';
import type { ReactNode } from 'react';
import { FaLink } from 'react-icons/fa';

import { withDialog } from '../../elements/DialogManager.js';
import { EmptyText } from '../../elements/EmptyText.js';
import { usePanelPreferences } from '../../hooks/usePanelPreferences.js';
import useTableSortBy from '../../hooks/useTableSortBy.js';
import { EditZoneModal } from '../../modal/editZone/EditZoneModal.js';
import { NoDataForFid } from '../extra/placeholder/NoDataForFid.js';

import ZonesTableRow from './ZonesTableRow.js';
import { useMapZones } from './hooks/useMapZones.js';

const Table = styled.table`
  border-spacing: 0;
  border: 1px solid #dedede;
  width: 100%;
  font-size: 12px;

  .react-contextmenu-wrapper {
    display: contents;
  }

  th {
    position: sticky;
    background-color: white;
    z-index: 2;
  }

  th,
  td {
    white-space: nowrap;
    text-align: center;
    margin: 0;
    padding: 0.1rem 0.4rem;
    border-bottom: 1px solid #dedede;
    border-right: 1px solid #dedede;

    :last-child {
      border-right: 0;
    }

    button {
      background-color: transparent;
      border: none;
      padding: 0 5px;
    }
  }

  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }

  thead tr:nth-of-type(1) th {
    top: 0;
  }

  thead tr:nth-of-type(2) th {
    top: 21px;
  }
`;

interface ZonesTableProps {
  tableData: Array<{
    signals: any[];
    tableMetaInfo: any;
    rowIndex: number;
    signalIndex: number;
    id: number;
  }>;
  onUnlink: (
    zoneData: any,
    isOnZoneLevel: any,
    signalIndex: any,
    axis: any,
  ) => void;
  nucleus: string;
  info: Info2D;
}
const ZoneEditionDialog = withDialog(EditZoneModal, { force: true });

function ZonesTable({ tableData, onUnlink, nucleus, info }: ZonesTableProps) {
  const { experiment, isFid } = info;

  const nuclei = nucleus.split(',');
  const data = useMapZones(tableData, { nuclei, experiment });
  const { items: sortedData, isSortedDesc, onSort } = useTableSortBy(data);
  const { deltaPPM: deltaX } = usePanelPreferences(
    'zones',
    nuclei?.[0],
  ) as Zones1DNucleusPreferences;
  const { deltaPPM: deltaY } = usePanelPreferences(
    'zones',
    nuclei?.[1],
  ) as Zones1DNucleusPreferences;
  const {
    showSerialNumber,
    showAssignment,
    showKind,
    showDeleteAction,
    showEditAction,
    showZoomAction,
    showAssignmentLabel,
  } = usePanelPreferences('zones', nucleus) as Zones2DNucleusPreferences;

  const showActions = showDeleteAction || showEditAction || showZoomAction;

  if (isFid) {
    return <NoDataForFid />;
  }

  if (!tableData || tableData.length === 0) {
    return <EmptyText text="No data" />;
  }

  return (
    <div>
      <ZoneEditionDialog />
      <Table>
        <thead>
          <tr>
            {showSerialNumber && <th rowSpan={2}>#</th>}
            {showAssignmentLabel && <th rowSpan={2}>Assignment</th>}
            {(deltaX.show || deltaX.show) && <th colSpan={2}>δ (ppm)</th>}
            {showAssignment && (
              <>
                <th colSpan={2}>
                  <FaLink />
                </th>
                <th colSpan={2}>Σ</th>
              </>
            )}
            {showKind && <th rowSpan={2}>Kind</th>}
            {showActions && <th rowSpan={2}>{''}</th>}
          </tr>
          <tr>
            {deltaX.show && (
              <th id="tableMetaInfo.signal.x.delta" {...onSort}>
                <SurroundedText text="F2">
                  {nuclei[0]}{' '}
                  {isSortedDesc('tableMetaInfo.signal.x.delta').content}
                </SurroundedText>
              </th>
            )}
            {deltaY.show && (
              <th id="tableMetaInfo.signal.y.delta" {...onSort}>
                <SurroundedText text="F1">
                  {nuclei[1]}{' '}
                  {isSortedDesc('tableMetaInfo.signal.y.delta').content}
                </SurroundedText>
              </th>
            )}
            {showAssignment && (
              <>
                <th>
                  <SurroundedText text="F2">{nuclei[0]}</SurroundedText>
                </th>
                <th>
                  <SurroundedText text="F1">{nuclei[1]}</SurroundedText>
                </th>
                <th>
                  <SurroundedText text="F2">{nuclei[0]}</SurroundedText>
                </th>
                <th>
                  <SurroundedText text="F1">{nuclei[1]}</SurroundedText>
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((rowData, index) => (
            <ZonesTableRow
              rowIndex={index}
              key={`${rowData.tableMetaInfo.id}`}
              rowData={rowData}
              onUnlink={onUnlink}
              nucleus={nucleus}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function SurroundedText(props: { text: 'F1' | 'F2'; children: ReactNode }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          fontSize: 8,
          color: '#3539E6',
        }}
      >
        {props.text}
      </div>
      <div style={{ marginLeft: 5 }}>{props.children}</div>
    </>
  );
}

export default ZonesTable;
