/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './BaseToast.scss';
import classNames from 'classnames';

export interface IBaseToastProps {
  title: string;
  message: string;
  classShow: string;
  classHide: string;
  id: string;
  timeOut: number;
  type: string;
  handleClose: (id: string) => void;
}

const BaseToast = (props: IBaseToastProps) => {
  const {
    title,
    message,
    classShow = 'bounceIn',
    classHide = 'bounceOut',
    id,
    timeOut = 5000,
    type = 'success',
    handleClose = () => {},
  } = props;

  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => hide(), timeOut);
  }, []);

  const hide = () => {
    handleClose(id);
    setShow(false);
  };

  const dialogEffect =
    (classShow || classHide) && classNames({ [classShow]: show, [classHide]: !show });

  return (
    <div className={classNames(dialogEffect, `toast toast-${type}`)} onClick={hide}>
      <div className="toast-title">{title}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default BaseToast;
