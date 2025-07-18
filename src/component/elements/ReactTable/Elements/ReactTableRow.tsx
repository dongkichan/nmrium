/** @jsxImportSource @emotion/react */

import type { CSSObject, SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo } from 'react';

import {
  HighlightEventSource,
  useHighlight,
} from '../../../highlight/index.js';
import { ContextMenu } from '../../ContextMenuBluePrint.js';
import type { BaseRowStyle, TableContextMenuProps } from '../ReactTable.js';

function getRowStyle(
  isActive: boolean,
  rowStyle: BaseRowStyle = {},
  disableDefaultRowStyle?: boolean,
): SerializedStyles {
  const { hover = {}, active = {}, base = {}, activated = {} } = rowStyle;

  const hoverStyle = disableDefaultRowStyle
    ? (hover as CSSObject)
    : { backgroundColor: '#ff6f0091', ...hover };
  const activeStyle = disableDefaultRowStyle
    ? (active as CSSObject)
    : { backgroundColor: '#ff6f0070', ...active };
  const baseStyle = disableDefaultRowStyle
    ? (base as object)
    : { backgroundColor: 'white', ...base };

  return css([
    {
      ...baseStyle,
      ...(isActive && { backgroundColor: '#ff6f0070', ...activated }),
    },
    { ':hover': hoverStyle, ':active': activeStyle },
  ]);
}

export interface ClickEvent {
  onClick?: (event: Event, data: unknown) => void;
}
interface ReactTableRowProps extends ClickEvent, TableContextMenuProps {
  row: any;
  highlightedSource?: HighlightEventSource;
  isRowActive: boolean;
  rowStyle: BaseRowStyle | undefined;
  disableDefaultRowStyle?: boolean;
}

function getIDs(row: any): string[] {
  const id = row.original.id;
  if (id) {
    if (Array.isArray(id)) {
      return id;
    } else {
      return [String(id)];
    }
  }
  return [''];
}
function ReactTableRow(props: ReactTableRowProps) {
  const {
    row,
    highlightedSource = HighlightEventSource.UNKNOWN,
    onContextMenuSelect,
    contextMenu = [],
    onClick,
    isRowActive = false,
    rowStyle,
    disableDefaultRowStyle,
  } = props;
  const data = useMemo(
    () => ({
      type: highlightedSource,
      extra: row.original,
    }),
    [highlightedSource, row],
  );
  const highlight = useHighlight(getIDs(row), data);

  useEffect(() => {
    return () => {
      highlight.hide();
    };
    // TODO: avoid this hack.
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickHandler = useCallback(
    (event: Event) => {
      onClick?.(event, row);
    },
    [onClick, row],
  );

  const { key: rowKey, ...otherKeyProps } = row.getRowProps();
  return (
    <ContextMenu
      data={row.original}
      options={contextMenu}
      onSelect={(selected) => onContextMenuSelect?.(selected, row.original)}
      as="tr"
      style={{ position: 'static' }}
      key={rowKey}
      css={getRowStyle(
        highlight.isActive || isRowActive,
        rowStyle,
        disableDefaultRowStyle,
      )}
      {...otherKeyProps}
      {...highlight.onHover}
    >
      {row.cells.map((cell) => {
        const {
          column: { style },
          isRowSpanned,
        } = cell;
        if (isRowSpanned) {
          return null;
        } else {
          const { key: columnKey, ...otherColumnProps } = cell.getCellProps();

          return (
            <td
              rowSpan={cell.rowSpan}
              key={columnKey}
              {...otherColumnProps}
              onContextMenu={(e) => {
                e.preventDefault();

                return false;
              }}
              style={style}
              onClick={clickHandler}
            >
              {cell.render('Cell')}
            </td>
          );
        }
      })}
    </ContextMenu>
  );
}

export default ReactTableRow;
