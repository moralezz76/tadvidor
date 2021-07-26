import React from 'react';
import './Button.scss';
import classNames from 'classnames';
import { FaSpinner } from 'react-icons/fa';

export enum EButtonType {
  default = 'primary',
  primary = 'primary',
  secondary = 'secondary',
  light = 'light',
  transparent = 'transparent',
  link = 'link',
  success = 'success',
  dark = 'dark',
}
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  buttonType?: any;
  className?: string;
  block?: boolean;
  disabled?: boolean;
  isSubmitting?: boolean;
}

const Button = ({
  onClick,
  children,
  buttonType = EButtonType.default,
  className = '',
  block,
  type = 'button',
  isSubmitting = false,
  ...restProps
}: IButtonProps) => (
  <button
    onClick={onClick}
    type={type}
    className={classNames('btn', `btn-${buttonType}`, className, {
      block,
      'btn-loading': isSubmitting,
    })}
    disabled={isSubmitting}
    {...restProps}
  >
    {isSubmitting && <FaSpinner className="icon-spin spin" />} {children}
  </button>
);
export default Button;
