/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import GridList from '../../GridList/GridList';
import classNames from 'classnames';
import './ToggleList.scss';
import { t } from '../../../config/i18n';
import { IGenericObject } from '../../../config/interfaces';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const ToggleList = (props: any) => {
  const {
    show = false,
    options,
    isOverfloat = true,
    inputEl = null,
    onItemsChange,
    isMultiple = false,
    values = [],
    filter = '',
    onMouseDown,
    firstElementOnList = () => {},
    keyPress,
    withScroll = true,
    headerProps,
    rowClasses,
    toggleType = 'list',
    valueFormat = (v: any) => v,
  } = props;

  const iniStyle = {
    minHeight: 110,
  };

  const [parentAbsolute, setParentAbsolute] = useState<any>(null);
  const [parentStyle, setParentStyle] = useState<any>(iniStyle);

  const [loading, setLoading] = useState<any>(true);
  const [filterOptions, setFilterOptions] = useState<any>(options);

  // filter hook
  useEffect(() => {
    if (options) {
      if (filter) {
        const found = options.filter((opt: any) => {
          return opt.find((k: any) => k.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
        });

        setFilterOptions(found);
      } else {
        setFilterOptions(options);
      }
    }
  }, [filter]);

  // resize windows hook
  useEffect(() => {
    const resizeWindow = () => {
      // calculate parent position

      const { clientWidth } = parentAbsolute;

      setParentStyle({
        ...iniStyle,
        width: clientWidth + 2,
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

  // parent absolute hook
  useEffect(() => {
    if (!!inputEl && isOverfloat) {
      // have input has handled
      const {
        current: { offsetParent },
      } = inputEl;
      const parent = offsetParent.className.split(' ').includes('input-group')
        ? offsetParent
        : inputEl.current;
      setParentAbsolute(parent);
    } else {
      setLoading(false);
    }
  }, [show, inputEl, isOverfloat]);

  const dd_types: IGenericObject = {
    list: (
      <GridList
        options={filterOptions}
        onItemsChange={onItemsChange}
        isMultiple={isMultiple}
        values={values}
        firstElementOnList={firstElementOnList}
        keyPress={keyPress}
        withScroll={withScroll}
        headerProps={headerProps}
        rowClasses={rowClasses}
      />
    ),
    datetime: (
      <DayPicker
        onDayClick={value => {
          const v = moment.utc(moment(value, 'X')).unix();
          onItemsChange([[v, valueFormat(v)]]);
        }}
      />
    ),
  };

  //alert(222);

  return (
    loading === false &&
    show && (
      <div className="toggle-list" onMouseDown={onMouseDown}>
        <div
          style={parentStyle}
          className={classNames(`toggle-list-body ${toggleType}`, { 'is-fixed': isOverfloat })}
        >
          {filter && options && filterOptions.length === 0 && (
            <span className="no-items">{t('selectNoItemsFound')}</span>
          )}
          {dd_types[toggleType]}
        </div>
      </div>
    )
  );
};

export default ToggleList;
