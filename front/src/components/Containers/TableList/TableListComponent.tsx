import React, { useState } from 'react';
import classNames from 'classnames';
import './TableListComponent.scss';
import { t } from '../../../config/i18n';

const TableListComponent = (props: any) => {
  const {
    title,
    value,
    list = [],
    className,
    maxItems = 0,
    onRowClick = () => {},
    emptyText,
    render = [],
  } = props;

  const [pages, setPages] = useState(1);

  const handleShow10 = () => {
    setPages(pages + 1);
  };

  const handleShowAll = () => {
    setPages(1000);
  };

  const showing = maxItems * pages;

  return (
    <div className={classNames('table-list', className)}>
      {title && <div className="title"> {title} </div>}
      <div className="list">
        {emptyText && list.length === 0 && (
          <div className="list-row">
            <div className={`cell`}>
              <span className="empty-text">{emptyText}</span>
            </div>
          </div>
        )}
        {list.map((items: any, k: number) => {
          return !maxItems || showing > k ? (
            <div
              key={`m${k}`}
              className="list-row"
              onClick={() => {
                onRowClick(items);
              }}
            >
              {items.map((value: any, i: number) => {
                return (
                  <div key={`l${k}${i}`} className={`cell cell-${i}`}>
                    {render[i] ? render[i](value) : value}
                  </div>
                );
              })}
            </div>
          ) : null;
        })}
        {maxItems > 0 && (
          <div className="text-right">
            {showing < list.length && (
              <span className="link" onClick={handleShow10}>
                {t('labelShow10')}
              </span>
            )}
            {showing < list.length && (
              <span className="link" onClick={handleShowAll}>
                {t('labelShowAll')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableListComponent;
