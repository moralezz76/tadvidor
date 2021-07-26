import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { TextInput } from '../';
import './PasswordInput.scss';

const PasswordInput = (props: any) => {
  const { toggleIcon } = props;

  const iconIniProps = {
    icon: <FiEye />,
    type: 'password',
  };

  const iconToggleProps = {
    icon: <FiEyeOff />,
    type: 'text',
  };

  const [iconProps, setIconProps] = useState(iconIniProps);
  const [isToggle, setIsToggle] = useState(false);

  const iconToggled = () => {
    if (!toggleIcon) return {};
    return {
      ...iconProps,
      iconClick: () => {
        setIsToggle(!isToggle);
        setIconProps(isToggle ? iconIniProps : iconToggleProps);
      },
    };
  };

  return <TextInput {...props} {...iconToggled()} groupClass="password-input" />;
};

export default PasswordInput;
