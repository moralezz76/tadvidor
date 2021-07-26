import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import './CustomButtonCommon.scss';
import { ToggleList } from '../../Containers';

const CustomButtonCommon = (props: any) => {
  const { icon, onClick = () => {}, disabled, color, actions = [], className, title } = props;

  let clickOnMe = false;

  const handleClick = (e: any) => {
    e.stopPropagation();
    !disabled && onClick();
    inputEl.current && inputEl.current.focus();
  };

  const [isToggled, setToggled] = useState(false);

  const _actions = typeof actions === 'function' ? actions() : actions;
  //console.log(_actions);

  let options: any = [];
  let allItems: any = [];

  Object.keys(_actions).map((key: any, i: number) => {
    const it = _actions[key];
    options.push([i, it.label]);
    allItems.push(it);
  });

  const onItemsChange = (item: any) => {
    const [id] = item[0];
    const { cb } = allItems[id];

    cb(id);
  };

  const handleBlur = () => {
    console.log('lost');
    if (!clickOnMe)
      setTimeout(() => {
        setToggled(false);
      }, 150);
    clickOnMe = false;
  };

  const handleFocus = () => {
    setToggled(true);
  };

  const inputEl = useRef<any>();

  const headerProps = [
    {},
    {
      render: (v: any, [id]: any) => {
        const { icon } = allItems[id];
        return (
          <>
            {icon} &nbsp;{v}
          </>
        );
      },
    },
  ];

  const rowClasses = (v: any) => {
    const [id] = v;
    const { classes = [] } = allItems[id];
    if (typeof classes === 'function') return classes(v);
    else if (typeof classes === 'string') return [classes];
    return classes;
  };

  return (
    <div
      className={classNames(className, 'custom-button', { disabled })}
      onClick={handleClick}
      style={{ color }}
    >
      <div
        onMouseDown={(e: any) => {
          clickOnMe = true;
        }}
      >
        {icon}
        {title && <span>{title}</span>}
      </div>
      {options.length > 0 && (
        <div className="custom-button-toggled">
          <div className="custom-button-input-content input-group">
            <input ref={inputEl} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <ToggleList
            show={isToggled}
            options={options}
            onItemsChange={onItemsChange} // an item was changed
            inputEl={inputEl}
            headerProps={headerProps}
            rowClasses={rowClasses}
          />
        </div>
      )}
    </div>
  );
};

export default CustomButtonCommon;
