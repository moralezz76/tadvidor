/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'ReduxTypes';
import { IGenericObject } from '../../config/interfaces';
import BaseDialog from './BaseDialog';
import BaseToast from './BaseToast';
import { BsCheckCircle } from 'react-icons/bs';
import { getToasts, getModals } from '../../bin/redux_global/selectors';
import { addModal, addToast, removeModal, removeToast } from '../../bin/redux_global/actions';
import { IBaseDialogProps } from './BaseDialog';
import { IBaseToastProps } from './BaseToast';

interface IDialogProps {
  dialogType?: string;
  toasts: IBaseToastProps[];
  removeToast: typeof removeToast;
  addToast: typeof addToast;
  modals: IBaseDialogProps[];
  addModal: typeof addModal;
  removeModal: typeof removeModal;
  icon?: React.ReactElement;
}

const Dialog = (props: IDialogProps) => {
  const {
    dialogType = 'success',
    toasts,
    removeToast,
    addToast,
    modals = [],
    addModal,
    removeModal,
    icon = null,
  } = props;

  const iconsArray: IGenericObject = {
    success: <BsCheckCircle />,
  };

  const defaultTypes: IGenericObject = {
    confirmation: {
      iconPosition: 'body',
      icon: icon || iconsArray[dialogType],
      closeButton: true,
      centered: true,
      classNameShow: 'bounceIn',
      classNameHide: 'bounceOut',
    },
    dialog: {
      closeButton: true,
      iconPosition: 'header',
      icon: icon || iconsArray[dialogType],
    },
    alert: {
      classNameShow: 'bounceIn',
      classNameHide: 'bounceOut',
      hideFooterSepar: true,
      centerContent: true,
      icon: icon || iconsArray[dialogType],
      iconPosition: 'body',
      size: 'sm',
      centered: true,
    },
  };

  const modal = (modalProps: IGenericObject) => {
    const { type = 'dialog', onClose = () => {} } = modalProps;
    const { id = `dialog${Math.random().toString().substr(1)}` } = modalProps;
    const modal = {
      onClose,
      ...defaultTypes[type],
      dialogType,
      type,
      key: id,
      id,
      ...modalProps,
    };
    addModal(modal);
  };

  /* Open a toast */
  const toast = (toastProps: IGenericObject) => {
    const { type = 'success', id = `toast${Math.random().toString().substr(1)}` } = toastProps;
    const itemProps = {
      type,
      id,
      ...toastProps,
    };

    addToast(itemProps);
  };

  const handleDialogClose = (id: string) => {
    setTimeout(() => {
      removeModal(id);
    }, 600);
  };

  const handleToastClose = (id: string) => {
    setTimeout(() => {
      removeToast(id);
    }, 600);
  };

  useEffect(() => {
    window.dialog = {
      modal,
      toast,
    };
  }, []);

  return (
    <>
      {Object.keys(modals).map((item: any) => {
        const props = modals[item];
        const { key } = props;
        return <BaseDialog {...props} key={key} handleClose={handleDialogClose} />;
      })}
      {toasts.length > 0 && (
        <div className="toast-container toast-bottom-right">
          {toasts.map((item: any) => {
            return <BaseToast key={item.id} {...item} handleClose={handleToastClose} />;
          })}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    toasts: getToasts(state),
    modals: getModals(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      removeToast,
      addToast,
      removeModal,
      addModal,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
