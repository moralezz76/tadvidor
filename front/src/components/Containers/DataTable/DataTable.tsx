/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { CustomButton, FilterPanel } from '../../Common';

import GridList from '../../GridList/GridList';
import './DataTable.scss';

const DataTable = (props: any) => {
  const {
    options,
    //onItemsChange = () => {},
    onItemClick = () => {},
    isMultiple = false,
    headerProps = [],
    fix = 0,
    id,
    actions = [],
    title,
    buttons = () => [],
    filters,
    onFilterChanged = () => {},
  } = props;

  const iniStyle = {
    maxWidth: 0,
    maxHeight: 0,
  };

  const [loading, setLoading] = useState<any>(false);
  const [parentAbsolute, setParentAbsolute] = useState<any>(null);
  const [parentStyle, setParentStyle] = useState<any>(iniStyle);

  useEffect(() => {
    setLoading(false);
  }, []);

  const tableEl = useRef<any>(null);

  useEffect(() => {
    const resizeWindow = () => {
      // calculate parent position
      setLoading(true);
      const { clientWidth, clientHeight } = parentAbsolute;

      const maxWidth = filters ? clientWidth - 260 : clientWidth;

      setParentStyle({
        ...iniStyle,
        maxWidth,
        maxHeight: clientHeight,
      });
      setLoading(false);
    };

    if (parentAbsolute) {
      // have parent absolute, need resize
      window.addEventListener('resize', resizeWindow);
      resizeWindow();
    }

    return () => {
      // have parent absolute, need resize
      window.removeEventListener('resize', resizeWindow);
    };
  }, [parentAbsolute]);

  useEffect(() => {
    if (tableEl) {
      const { current } = tableEl;
      setParentAbsolute(current);
    } else {
      setLoading(false);
    }
  }, [tableEl]); // tableEl allow controlled parent event size

  const handleFilters = async (values: any, cb: any) => {
    //
    await onFilterChanged(values);
    cb(false);
  };

  return (
    <>
      {title && <div className="is-header card-body">{title}</div>}
      {buttons.length > 0 && (
        <div className="is-header card-body">
          {buttons().map((buttonProps: any) => (
            <CustomButton {...buttonProps} className="tool-button" />
          ))}
        </div>
      )}
      <div id={id} className="data-table" ref={tableEl}>
        {!loading && (
          <>
            <GridList
              id={id}
              options={options}
              actions={actions}
              onItemClick={onItemClick}
              isMultiple={isMultiple}
              headerProps={headerProps}
              fix={fix}
              parentStyle={parentStyle}
            />
            {filters && <FilterPanel filters={filters} handleFilters={handleFilters} />}
          </>
        )}
      </div>
    </>
  );
};

export default DataTable;
