import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './MenuListComponent.scss';
import { t } from '../../../config/i18n';
import { Icon } from '../../Common';
import MenuLiner from './MenuLinerCommon/MenuLinerCommon';

const ListItems = (props: any) => {
  const {
    items = {},
    path,
    onClick,
    selected,
    level,
    menuTitles = {},
    useTrans = true,
    menuMargin = 24,
    expanded = [],
    onToggled,
    findText = '',
    className,
  } = props;

  const handleClick = (e: string, i: any, toggle = false) => {
    if (toggle) onToggled(i);
    else onClick(e.toLocaleLowerCase(), i);
  };

  return (
    <>
      {Object.keys(items).map((i: any, idx: number) => {
        const e = items[i];
        let text = useTrans ? t(`menu${i}`) : i;

        const lastIndex = idx === Object.keys(items).length - 1;
        if (typeof e === 'string') {
          if (findText) {
            const io = text.toLowerCase().indexOf(findText.toLowerCase());
            if (io !== -1) {
              text = (
                <>
                  {text.substr(0, io)}
                  <b className="resalt">{text.substr(io, findText.length)}</b>
                  {text.substr(io + findText.length)}
                </>
              );
            } else return null;
          }
          return (
            <div
              className={classNames('list-item', className, {
                selected: e.toLocaleLowerCase() === selected?.toLocaleLowerCase(),
                'last-item': lastIndex,
                expanded: expanded.includes(i),
              })}
              onClick={() => handleClick(e, i)}
            >
              <MenuLiner level={level} margin={menuMargin} />
              <div className="item-text">{menuTitles[i] || text}</div>
            </div>
          );
        } else {
          const newLevel = level + (i ? 1 : 0);
          return (
            <>
              {i && (
                <div
                  className={classNames('list-item', className, {
                    selected: e === selected,
                    expanded: expanded.includes(i),
                    'last-item': lastIndex,
                  })}
                  onClick={() => handleClick(e, i, true)}
                >
                  <MenuLiner level={level} margin={menuMargin} />
                  <div className="item-text">
                    <Icon type={expanded.includes(i) ? 'minus' : 'plus'} />
                    {menuTitles[i] || (useTrans ? t(`menu${i}`) : i)}
                  </div>
                </div>
              )}
              {(expanded.includes(i) || level === newLevel) && (
                <ListItems
                  className={classNames(className, lastIndex ? `no-level-${level}` : '')}
                  items={e}
                  path={`${path}/${i}/`}
                  onClick={onClick}
                  selected={selected}
                  level={newLevel}
                  menuTitles={menuTitles}
                  useTrans={useTrans}
                  menuMargin={menuMargin}
                  expanded={expanded}
                  onToggled={onToggled}
                  findText={findText}
                />
              )}
            </>
          );
        }
      })}
    </>
  );
};

const MenuListComponent = (props: any) => {
  const {
    className,
    list = {},
    onClick = () => {},
    selected = null,
    level = 0,
    menuTitles = {},
    useTrans = true,
    asBlue = false,
    expanded = [],
    findText = false,
  } = props;

  const [sel, setSel] = useState('');
  const [expandedList, setExpandedList] = useState(expanded);
  const [textValue, setTextValue] = useState('');
  const [textPlaceholder, setTextPlaceholder] = useState('global');

  useEffect(() => {
    setSel(selected);
  }, [selected]);

  const findExpanded = (arr_expanded: string[], arr_list: any): any => {
    let ret: string[] = [];
    let find: string[] = [];
    Object.keys(arr_list).forEach((ii: string) => {
      const vv = arr_list[ii];

      if (!textValue && expanded.includes(ii)) ret = [...ret, ii];

      if (typeof vv === 'string') {
        if (vv === selected) setTextPlaceholder(ii);

        const io = ii.toLowerCase().indexOf(textValue.toLowerCase());
        if ((textValue && io !== -1) || vv === selected) {
          ret = [...arr_expanded];
          return;
        }
      } else {
        const isExp = findExpanded([ii], vv);
        if (isExp.length || (!textValue && expanded.includes(ii))) {
          ret = [...ret, ...arr_expanded, ...isExp];
        }
        return;
      }
    });

    return ret;
  };

  useEffect(() => {
    let newExpanded = findExpanded([], list).filter((v: any, i: any, a: any) => a.indexOf(v) === i);
    setExpandedList(newExpanded);
  }, [expanded, textValue]);

  const handleClick = (value: string, name: string) => {
    setSel(value);
    onClick(value);
    setTextValue('');
  };

  const onToggled = (i: any) => {
    if (expandedList.includes(i)) {
      setExpandedList(expandedList.filter((a: string) => a !== i));
    } else {
      setExpandedList([...expandedList, i]);
    }
  };

  const updateInputValue = (e: any) => {
    const {
      target: { value },
    } = e;
    setTextValue(value);
  };

  return (
    <>
      {findText && (
        <div className="find-text">
          <div className="label">{findText}:</div>
          <div className="input">
            <input
              type="text"
              value={textValue}
              onChange={updateInputValue}
              placeholder={textPlaceholder}
            />
          </div>
        </div>
      )}
      <div className={classNames('menu-list', className, { 'as-blue': asBlue })}>
        <ListItems
          items={list}
          onClick={handleClick}
          selected={sel}
          level={level}
          menuTitles={menuTitles}
          useTrans={useTrans}
          menuMargin={asBlue ? 24 : 24}
          expanded={expandedList}
          onToggled={onToggled}
          findText={textValue}
        />
      </div>
    </>
  );
};

export default MenuListComponent;
