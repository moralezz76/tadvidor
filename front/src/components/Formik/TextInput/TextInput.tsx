/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { BaseField } from '../';
import { isEqual, C } from '../../../utils/Helpers';
import './TextInput.scss';

const TextInput = (props: any) => {
  const {
    field: { name, value },
    form: { setFieldValue },
    type = 'text',
    placeholder,
    icon,
    iconClick = () => {},
    onElementHasHandled = () => {},
    disabled = false,
    dropDown = false,
    isToggled = false,
    //htmlContent = false,
    renderValues = (value: any) => ({ value, element: value }),
    onFocus = () => {},
    onBlur = () => {},
    onClick = () => {},
    onInputReady = () => {},
    onInputChange = () => {},
    onItemsChange = () => {},
    onKeyDown = () => {},
    isMultiple = false,
    values = null,
    indexOfInputVal = 1,
    fullValues = false,
    forceToList = false,
    suggestedOption = [-1, ''],
    extraIcons = [],
    updateValue = (value: any) => value,
    valueFormat = (value: any) => value,
  } = props;

  // no needs values

  //console.log(value);

  const [width, setWidth] = useState(0);
  const [inputValue, setInputValue] = useState(value);
  const [withFocus, setWithFocus] = useState(false);

  const [elementHasHandled, setElementHasHandled] = useState<string | null>(null);

  const inputEl = useRef<any>(null);

  useEffect(() => {
    updateInputByValues(values);
  }, [values]);

  useEffect(() => {
    /* LAST */
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    inputEl && onInputReady(inputEl.current);
  }, [inputEl, onInputReady]);

  useEffect(() => {
    const [sugg_opt = [], sugg_by] = suggestedOption;
    sugg_by === C._FORCE_VALUE && setInputValue(sugg_opt[indexOfInputVal] || '');
    //sugg_by === C._FORCE_VALUE && console.log(sugg_opt);
    if (sugg_by === C._FORCE_VALUE) console.log(sugg_opt);
  }, [suggestedOption]);

  const iconClasses = classNames({
    'input-group-text': true,
    'icon-with-pointer': iconClick,
    'rounded-right': true,
  });

  const updateInputByValues = (currValues: any) => {
    if (currValues) {
      const theValues = isMultiple ? currValues : currValues[0];
      const onlyIndex0 = currValues.map((i: any) => i[0]);
      const uniqueValue = fullValues
        ? theValues
        : isMultiple
        ? onlyIndex0
        : theValues
        ? theValues[0]
        : '';

      setFieldValue(name, uniqueValue);
      if (!isMultiple && currValues[0]) {
        setInputValue(currValues[0][indexOfInputVal]);
      }
    }
    onItemsChange(currValues);
  };

  // UPDATE VALUE **************************************************************************************************

  const singleValue = !(forceToList || isMultiple);

  const inputOnChange = (e: any, handleChange: any) => {
    const {
      target: { value },
    } = e;

    setInputValue(value);
    singleValue && handleChange(e);
    onInputChange(e); // check if need show list - find in list ?
  };

  /* UPDATE VALUE ON BLUR */
  const handleOnBlur = (e: any, handleBlur: any) => {
    if (elementHasHandled) {
      // an element into select has focus, blur canceled
      setElementHasHandled(null);
      return;
    }

    setWithFocus(false);

    if (!isMultiple) {
      const uValue = updateValue(inputValue);
      const pairValue = [[uValue, valueFormat(uValue)]];
      let finalValues = null;
      if (values && values[0]) {
        const [sugg_value] = suggestedOption;

        finalValues = values && inputValue === values[0][indexOfInputVal] ? values : pairValue;

        if (!inputValue) finalValues = [];
        else if (sugg_value) {
          if (forceToList || isEqual(inputValue, sugg_value[indexOfInputVal])) {
            console.log('siii');
            finalValues = [sugg_value];
          }
        }
      }

      //console.log(finalValues || pairValue);
      updateInputByValues(finalValues || pairValue);
    }

    handleBlur(e);
    onBlur(e);
  };

  const handleOnFocus = (e: any, handleFocus: any) => {
    handleFocus();
    onFocus();
    setWithFocus(true);
  };

  const handleKeyDown = (e: any) => {
    e.keyCode === 13 && handleOnBlur(e, () => {});
    onKeyDown(e);
  };

  const customInput = (propsInput: any) => {
    const { handleChange, handleBlur, handleFocus, placeholder } = propsInput;
    return (
      <input
        ref={inputEl}
        name={name}
        value={inputValue}
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
        onChange={(e: any) => inputOnChange(e, handleChange)}
        onBlur={e => handleOnBlur(e, handleBlur)}
        className="form-control"
        onFocus={e => handleOnFocus(e, handleFocus)}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      />
    );
  };

  useEffect(() => {
    const resizeWindow = () => {
      const {
        current: { offsetParent },
      } = inputEl;

      const { clientWidth } = offsetParent;
      setWidth(clientWidth);
    };

    if (dropDown) {
      window.addEventListener('resize', resizeWindow);
      resizeWindow();
    }

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, [dropDown]);

  // an inside element was clicked, focus then
  const eventElementHasHandled = (target: any) => {
    setElementHasHandled(target);
    onElementHasHandled(target);
  };

  useEffect(() => {
    if (elementHasHandled) {
      inputEl && inputEl.current.focus();
    }
  }, [elementHasHandled]);

  const inputContentValue = () => {
    if (type === 'password') {
      return _.repeat('●', value.length);
    }
    return inputValue;
  };

  return (
    <BaseField {...props} withFocus={withFocus}>
      {(childrenProps: any) => {
        const { value: newPlaceholder, element: htmlContentValue } = renderValues(
          values,
          placeholder
        );

        //console.log(renderValues.toString());

        /*
        if (name === 'status') {
          console.log(values);
          console.log(newPlaceholder);
          console.log(htmlContentValue);
        }
        */

        childrenProps.placeholder = newPlaceholder || placeholder;

        const { classes } = childrenProps;
        const isInvalid = classes.split(' ').includes('is-invalid');
        const htmlContent = inputContentValue() || htmlContentValue;

        return (
          <>
            <div
              className={classNames('input-group default-input-group', {
                toggled: isToggled,
                'is-invalid': isInvalid,
              })}
            >
              {customInput(childrenProps)}
              {extraIcons && (
                <div
                  className="extra-icons"
                  onMouseDown={() => eventElementHasHandled('extra-icons')}
                >
                  {extraIcons.map((i: any) => i)}
                </div>
              )}

              <div
                className={classNames('html-content', { placeholder: !htmlContent })}
                style={{ ...(width && { width: width - 33 }) }}
              >
                {dropDown ? htmlContentValue || placeholder : htmlContent || placeholder}
                {/*htmlContent || placeholder*/}
              </div>

              {icon && (
                <div className="input-group-append">
                  <span
                    className={iconClasses}
                    onMouseDown={() => eventElementHasHandled('toggle')}
                    onClick={iconClick}
                  >
                    <span>{icon}</span>
                  </span>
                </div>
              )}
            </div>
            {
              dropDown &&
                isToggled &&
                React.cloneElement(dropDown, {
                  inputEl,
                  //values: isMultiple || fullValues ? values : [],
                  onMouseDown: () => eventElementHasHandled('list'),
                }) /* inputEl to calculare coor, and values to refresh */
            }
          </>
        );
      }}
    </BaseField>
  );
};

export default TextInput;
