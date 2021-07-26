/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Scrollbars from 'react-custom-scrollbars';
import './GridList.scss';
import { Checkbox } from '../Form';
import { CustomButton } from '../Common';
import { t } from '../../config/i18n';
import { C } from '../../utils/Helpers';

const GridList = (props: any) => {
  const {
    options = [],
    fix = 0,
    isMultiple = false,
    onItemsChange = () => {},
    onItemClick = () => {},
    firstElementOnList = () => {},
    mainKey,
    headerProps = [],
    parentStyle = {},
    id,
    actions = () => [],
    values = [],
    keyPress = [],
    withScroll = false,
    rowClasses = () => [],
  } = props;

  //  console.log(values);

  const zones = [C._FIXED, C._DATA];
  const scrollEl = useRef<any>(null);
  const scrollLeftEl = useRef<any>(null);
  const scrollTopEl = useRef<any>(null);
  const firstEl = useRef<any>(null);

  const [overItem, setOverItem] = useState<number | null>(null);
  const [currentOption, setCurrentOption] = useState<any[]>([-1, '']);

  useEffect(() => {
    const l = options.length;
    let sel = currentOption[0];

    const [keyCode] = keyPress || [];
    switch (keyCode) {
      case 'ArrowUp':
        sel !== 0 && --sel;
        break;
      case 'ArrowDown':
        sel < l - 1 && ++sel;
        break;
      default:
        return;
    }
    setCurrentOption([sel, C._FORCE_VALUE]);
  }, [keyPress]);

  useEffect(() => {
    if (!withScroll) return;
    const {
      // move scroll to first element
      current: { scrollTop },
    } = scrollEl;
    scrollTop && firstEl.current && scrollTop(firstEl.current.offsetTop);
    /* END move scrooll */

    const [c_opt, ename] = currentOption;

    // param has currentOption item, or first when no values, or null
    const param = options.length && c_opt !== -1 ? options[c_opt] : -1;
    firstElementOnList([param, ename]); // use as suggested value
  }, [currentOption]);

  useEffect(() => {
    if (!withScroll) return;
    // options changed, find current option, itn's in list, is 0
    const checked = values.length ? options.findIndex((it: any) => _.isEqual(values[0], it)) : 0;
    const start_opt = checked !== -1 || options.length === 0 ? checked : 0;
    const newCurrentOption = [start_opt, 'first-suggest'];
    if (!_.isEqual(newCurrentOption, currentOption))
      setCurrentOption(
        newCurrentOption
      ); /**************************************************************** */
  }, [options, values]);

  const rowSelectedHandled = (i: any) => {
    const my_opt = options[i];
    const currSelectedItems = isMultiple ? values : [];
    const newValue = currSelectedItems.find((i: any) => _.isEqual(my_opt, i)) ? false : true;
    let ret: any = [];

    if (newValue) {
      ret = [...currSelectedItems, my_opt];
    } else {
      const items = [...currSelectedItems];
      ret = items.filter((i: any) => !_.isEqual(my_opt, i));
    }

    onItemsChange(mainKey ? ret.map((i: any) => i[mainKey]) : ret, ret);
    onItemClick(my_opt);
  };

  const getContent = (z: string) => {
    const [i_opt] = currentOption;
    return (
      <div className="grid-list-body">
        {options.map((opt: any, i: number) => {
          const first = i === i_opt;
          const checked = isMultiple ? values.find((it: any) => _.isEqual(opt, it)) : i === i_opt;
          const over = overItem === i;
          return (
            <div
              key={`glb-${i}`}
              onMouseEnter={() => setOverItem(i)}
              onMouseLeave={() => setOverItem(null)}
              className={classNames(
                'grid-list-row',
                {
                  over,
                  checked,
                  first: !overItem && first,
                },
                ...rowClasses(opt)
              )}
              onClick={() => rowSelectedHandled(i)}
              ref={first && z === C._DATA ? firstEl : null}
            >
              {z === C._FIXED && (
                <>
                  {(isMultiple || actions().length > 0) && (
                    <div className={`grid-list-col grid-col-actions`}>
                      <div className="cell cell-cmps">
                        {isMultiple && (
                          <Checkbox
                            onChange={(value: any) => rowSelectedHandled(i)}
                            checked={!!checked}
                          />
                        )}
                        {actions().map((item: any, i: number) => {
                          const {
                            color,
                            onClick = () => {},
                            disabled = () => false,
                            icon,
                            hint,
                          } = item;
                          //////console.log(onClick);
                          return (
                            <CustomButton
                              key={`ico-${i}`}
                              icon={icon}
                              onClick={() => onClick(opt)}
                              disabled={disabled(opt)}
                              color={color}
                              className="rounded"
                              hint={hint}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {opt.map((d: any, k: number) => {
                const _r = (z === C._FIXED && k < fix) || (z === C._DATA && k >= fix);
                const rr =
                  (headerProps &&
                    headerProps[k] &&
                    headerProps[k].render &&
                    headerProps[k].render(d, opt)) ||
                  d;

                if (k >= headerProps.length) return null;

                return (
                  _r && (
                    <div className={`grid-list-col grid-col-${k}`} key={`glc-${k}`}>
                      <div className="cell">{rr}</div>
                    </div>
                  )
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const handleScroll = (w: any) => {
    //////console.log(scrollLeftEl.current);

    const {
      current: { getScrollLeft, getScrollTop },
    } = scrollEl;

    const { current: scrollLeftCmp } = scrollLeftEl;
    const { current: scrollTopCmp } = scrollTopEl;

    scrollLeftCmp && (scrollLeftCmp.scrollLeft = getScrollLeft());
    scrollTopCmp && (scrollTopCmp.scrollTop = getScrollTop());
  };

  // move to the first selected element in scroll

  useEffect(() => {
    var style = document.createElement('style');
    style.type = 'text/css';
    let classes = '';

    headerProps.forEach((item: any, i: number) => {
      const { width } = item;
      width && (classes += `#${id} .grid-col-${i} { min-width: ${width}px !important} \r\n`);
    });

    style.innerHTML = classes;
    document.getElementsByTagName('head')[0].appendChild(style);
  }, [headerProps]);

  const infoFixed = actions().length > 0 || isMultiple || fix !== 0;

  return (
    <div className="grid-list unsel" style={parentStyle}>
      {zones.map((z: string) => {
        return (
          (z === C._DATA || infoFixed) && (
            <div key={`${z}`} className="grid-list-content">
              {headerProps.length > 0 && (
                <div className="grid-list-header" ref={z === C._DATA ? scrollLeftEl : null}>
                  {headerProps.map(({ label = '' }: any, i: number) => {
                    const _r = (z === C._FIXED && i < fix) || (z === C._DATA && i >= fix);
                    return _r ? (
                      <div key={`gl-${i}`} className={`grid-list-header-col grid-col-${i}`}>
                        <div className="cell">{t(`column${label}`)}</div>
                      </div>
                    ) : (
                      i === 0 && <div className="grid-list-header-empty"></div>
                    );
                  })}
                </div>
              )}
              <div className={`grid-list-zone-${z}`} ref={z === C._FIXED ? scrollTopEl : null}>
                {z === C._FIXED || !withScroll ? (
                  getContent(z)
                ) : (
                  <Scrollbars autoHeight ref={scrollEl} onScroll={handleScroll} autoHide>
                    {getContent(z)}
                  </Scrollbars>
                )}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default GridList;
