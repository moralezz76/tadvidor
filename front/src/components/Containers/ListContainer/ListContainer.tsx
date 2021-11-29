/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import './ListContainer.scss';

const ListContainer = (props: any) => {
  const { children, startOn = 'right-bottom', onBlur, mainEl } = props;
  let clickOnMe = false;

  const [className, setClassName] = useState('');

  const inputEl = useRef<any>();
  const selfEl = useRef<any>();

  const handleBlur = () => {
    if (!clickOnMe) {
      onBlur();
      return;
    }
    inputEl.current && inputEl.current.focus();
    clickOnMe = false;
  };

  useEffect(() => {
    setClassName(startOn);
  }, [startOn]);

  const checkPosition = () => {
    // check window dimensions

    const { current } = selfEl;
    const { current: parent } = mainEl;
    if (!current || !parent) return;
    const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect();
    const { width, top, height } = current.getBoundingClientRect();

    let realClass = startOn;

    //TOP
    if (top + height > window.innerHeight) {
      if (realClass === 'left-bottom') {
        realClass = 'left-top';
      } else if (realClass === 'right-bottom') {
        realClass = 'right-top';
      }
    }

    //LEFT
    if (parentLeft + width > window.innerWidth) {
      if (realClass === 'left-bottom') {
        realClass = 'right-bottom';
      } else if (realClass === 'left-top') {
        realClass = 'right-top';
      }
    }

    realClass !== className && setClassName(realClass);
  };

  useEffect(() => {
    const resizeWindow = () => {
      onBlur();
    };

    window.addEventListener('resize', resizeWindow);
    checkPosition();

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, []);

  return (
    <div
      className={classNames('list-container', className)}
      onMouseDown={(e: any) => {
        clickOnMe = true;
      }}
    >
      <div className="hide-input-parent">
        <input ref={inputEl} onBlur={handleBlur} autoFocus />
      </div>
      <div className="children" ref={selfEl}>
        {children}
      </div>
    </div>
  );
};

export default ListContainer;
