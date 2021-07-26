import React, { useState } from 'react';
import './BaseDialog.scss';
import { BsX } from 'react-icons/bs';
import classNames from 'classnames';
import { Button } from '../Formik';
import { FormikProps } from 'formik';
import { IGenericObject, IRequestResult } from '../../config/interfaces';

export interface IBaseDialogProps {
  handleClose: (id: string) => void;
  title: string;
  closeButton: boolean;
  children: React.ReactElement;
  buttonClose: string;
  buttons: [];
  id: string;
  icon: React.ReactElement;
  centered: boolean;
  iconPosition: string;
  footerJustify: string;
  hideFooterSepar: boolean;
  classShow: string;
  classHide: string;
  centerContent: boolean;
  type: string;
  dialogType: string;
  onClose: (id: string) => void;
  maxWidth: number;
  key?: string;
}

export interface IButtonsProps {
  handleClick: (values?: {}) => {};
  isSubmit: boolean;
  text?: string;
  variant?: string;
}

const BaseDialog = (props: IBaseDialogProps) => {
  let formRef: FormikProps<IGenericObject> | null = null;

  const {
    handleClose = () => {},
    title,
    closeButton = false,
    children,
    buttonClose = 'Close',
    buttons = [],
    id,
    icon,
    centered = false,
    iconPosition = 'top',
    footerJustify = 'center',
    hideFooterSepar = false,
    classShow = 'slideDown',
    classHide = 'slideUp',
    centerContent = false,
    type,
    dialogType,
    onClose = () => {},
    maxWidth = 380,
  } = props;

  const [awaiting, setAwaiting] = useState(false);
  const [show, setShow] = useState(true);
  const hide = () => {
    handleClose(id);
    onClose(id);
    setShow(false);
  };

  const buttonClick = async ({ handleClick, isSubmit }: IButtonsProps) => {
    setAwaiting(true);

    if (isSubmit && formRef) {
      // have a form attach
      const { submitForm, isValid, values } = formRef;

      if (handleClick) {
        const hideModal = await handleClick(values);
        if (hideModal) hide();
      } else {
        submitForm();
        if (!isValid) setAwaiting(false);
      }
    } else {
      // is a dialog buttom
      const hideModal = await handleClick();
      if (hideModal) hide();
    }
  };

  const dialogEffect =
    (classShow || classHide) && classNames({ [classShow]: show, [classHide]: !show });

  const childContent = children.props
    ? React.cloneElement(children, {
        ...children.props,
        formRef: (ref: FormikProps<IGenericObject>) => {
          formRef = ref;
        },

        requestResult: ({ status }: IRequestResult) => {
          if (status === 200) hide();
          setAwaiting(false);
        },
      })
    : children;

  return (
    <div className={'mdl show'} tabIndex={-1} role="dialog">
      <div
        className={classNames('mdl-dialog', type, dialogType, {
          'mdl-dialog-centered': centered,
        })}
        role="document"
        style={{ maxWidth }}
      >
        <div
          className={classNames(dialogEffect, 'mdl-content', {
            'text-center': centerContent,
          })}
        >
          {(title || closeButton) && (
            <div className="mdl-header">
              {iconPosition === 'header' && <div className="icon">{icon}</div>}
              <div className="title">{title}</div>
              {closeButton && (
                <div className="btn-close">
                  <BsX onClick={hide} />
                </div>
              )}
            </div>
          )}
          <div className="mdl-content-body">
            {iconPosition === 'body' && <div className="icon">{icon}</div>}
            <div className="children">{childContent}</div>
          </div>
          <div
            className={classNames('mdl-content-footer', {
              'justify-content-between': footerJustify === 'left',
              'justify-content-center': footerJustify === 'center',
              'hide-footer-separ': hideFooterSepar,
            })}
          >
            {buttonClose && (
              <Button onClick={hide} disabled={awaiting} buttonType="dark">
                Close
              </Button>
            )}
            {buttons.map(({ text, variant = 'primary', ...rest }: IButtonsProps) => (
              <Button
                disabled={awaiting}
                isSubmitting={awaiting}
                key={text}
                onClick={async () => await buttonClick(rest)}
              >
                {text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDialog;
