import React, { useState } from 'react';
import moment from 'moment';
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import { FieldFormatter, TextInput } from '..';
import { ToggleList } from '../../Containers';
import './SelectInput.scss';
import { C } from '../../../utils/Helpers';
import { IGenericObject } from '../../../config/interfaces';

const SelectInput = (props: any) => {
  const {
    value = [],
    autoComplete = false, // text with autoComplete (hidden toggle button)
    selectProps = {},
    toggleType = 'list',
  } = props;

  const {
    forceToList = false,
    isMultiple = false, // one or more items
    fullValues = false, // return entire array
    options,
  } = selectProps;

  const defaultRender: IGenericObject = {
    list: isMultiple ? FieldFormatter.MULTI_SELECT : FieldFormatter.DEFAULT_SELECT,
    datetime: FieldFormatter.DATETIME,
  };

  const defaultFormat: any = {
    datetime: (value: any) => {
      const f = moment.unix(value);
      return f.isValid() ? f.format('L LT') : '';
    },
  };

  const defaultUpdate: any = {
    datetime: (value: any) => {
      const f = moment(value, 'L LT');
      return f.isValid() ? parseFloat(f.format('X')) : `${value}|validationDateTime`;
    },
  };

  const {
    renderValues = defaultRender[toggleType],
    valueFormat = defaultFormat[toggleType],
    updateValue = defaultUpdate[toggleType],
  } = props;

  const iconIniProps = {
    icon: <FiChevronDown />,
  };

  const iconToggleProps = {
    icon: <FiChevronUp />,
  };

  const [iconProps, setIconProps] = useState(iconIniProps); // for dropdown effect
  const [isToggled, setIsToggled] = useState(false); // for dropdown effect
  const [inputEl, setInputEl] = useState<any>(null); // input into component
  const [values, setValues] = useState<any>(value); // values
  //const [withFocus, setWithFocus] = useState<boolean>(false); // focus
  const [filter, setFilter] = useState<string>(''); // find in grid with text values
  const [suggestedOption, setSuggestedOption] = useState<any>([]); // main suggest from grid to input

  const handleFocus = (e: any) => {
    //setWithFocus(true);
  };

  const handleBlur = () => {
    //setWithFocus(false);
    handleToggled(false);
    setFilter('');
  };

  // login for icon toggled effect
  const handleToggled = (v = true) => {
    setIsToggled(v);
    setIconProps(!v ? iconIniProps : iconToggleProps);
  };

  // inject into textInput
  const iconToggled = () => {
    if (autoComplete) return;
    return {
      ...iconProps,
      iconClick: () => {
        handleToggled(!isToggled);
      },
    };
  };

  // an item in list has clicked
  const onItemsChange = (values: any) => {
    setValues(values);
    switch (toggleType) {
      case 'list':
        if (isMultiple) {
          setFilter('');
          setSuggestedOption([[], C._FORCE_VALUE]);
        } else {
          setSuggestedOption(values);
          handleToggled(false); // toggle false in not multiple
        }
        break;
      case 'datetime':
        handleToggled(false); // toggle false in not multiple
        break;
    }
  };

  const hanleInputReady = (inputEl: any) => {
    setInputEl(inputEl);
  };

  // input changes, check it's a autoComplete to show list
  const checkListNeeds = (e: any) => {
    const {
      target: { value = e },
      type,
    } = e;

    // on click case
    if (type === 'click') {
      if (isToggled) {
        filter && setFilter(''); // list show & filter, clear filter to show all
      } else {
        // list hidden & autoComplete -> show list and filter if input has a value
        autoComplete && setFilter(inputEl.value);
        handleToggled(true);
      }

      return;
    }

    if (autoComplete) {
      handleToggled(!!value); // show list if have value
    } else {
      handleToggled(true);
    }

    setFilter(value); // update filter
  };

  // an element in list need be a suggest
  const handleFirstElementOnList = (item: any) => {
    //console.log(item);
    switch (toggleType) {
      case 'list':
        setSuggestedOption(item);
        break;
    }
  };

  const [inputKeyPress, setInputKeyPress] = useState<any>(null);

  const handleKeyDown = ({ key }: any) => {
    switch (toggleType) {
      case 'list':
        if (key === 'ArrowDown') {
          if (isToggled) {
          } else {
            handleToggled(true);
            return;
          }
        }

        if (key === 'Escape') {
          setSuggestedOption([values[0], C._FORCE_VALUE]);
          handleToggled(false);
        } else setInputKeyPress([key, Math.random()]);
        break;
    }
  };

  const handleCloseIcon = () => {
    switch (toggleType) {
      case 'list':
        if (filter) {
          setSuggestedOption([values[0], C._FORCE_VALUE]);
          setFilter('');
        } else {
          setSuggestedOption([[], C._FORCE_VALUE]);
          setValues([]);
        }
        handleToggled(false);
        break;
      case 'datetime': {
        setSuggestedOption([[], C._FORCE_VALUE]);
        setValues([]);
      }
    }
  };

  return (
    <TextInput
      {...props}
      {...iconToggled()}
      onKeyDown={handleKeyDown}
      onInputReady={hanleInputReady} // input into textInput
      onInputChange={checkListNeeds}
      fullValues={fullValues} // retur an array or not
      renderValues={renderValues} // render values after select lost focus
      onBlur={handleBlur} // lost focus
      onFocus={handleFocus} // get focus
      onClick={checkListNeeds}
      isMultiple={isMultiple} // one or more items
      groupClass="select-input"
      isToggled={isToggled} // show list or not
      onItemsChange={onItemsChange}
      values={values}
      forceToList={forceToList} // force to select a element in list
      htmlContent // show html content (when input is hide)
      suggestedOption={suggestedOption}
      updateValue={updateValue}
      valueFormat={valueFormat}
      extraIcons={[
        ...[filter && isToggled && <FiSearch />],
        ...[
          (filter || values.length > 0) && <FiX className="close-icon" onClick={handleCloseIcon} />,
        ],
      ]}
      dropDown={
        <ToggleList
          show={isToggled}
          options={options}
          filter={filter} // text to filter
          onItemsChange={onItemsChange} // an item was changed
          isMultiple={isMultiple} // same to list toggle
          firstElementOnList={handleFirstElementOnList}
          keyPress={inputKeyPress}
          values={values} // values will be injected in textinput
          toggleType={toggleType}
          valueFormat={valueFormat}
        />
      }
    />
  );
};

export default SelectInput;
