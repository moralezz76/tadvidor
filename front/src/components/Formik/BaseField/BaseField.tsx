import React from 'react';
import classNames from 'classnames';
import { ErrorMessage, FormikProps } from 'formik';
import './BaseField.scss';
import { IGenericObject } from '../../../config/interfaces';

interface FieldProps {
  name: string;
  value?: string | number;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  inputCharsLength: number;
}

/*interface FormProps {
  touched: Record<string, any>;
  errors: Record<string, any>;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string) => void;
}*/

export interface IProps {
  field: FieldProps;
  form: FormikProps<IGenericObject>;
  label?: string;
  extraLabel?: string;
  placeholder?: string;
  className?: string;
  groupClass?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  type?: string;
  icon?: any;
  iconClick?: () => void;
  autoComplete?: string;
  handleOnBlur?: (e: any) => void;
  handleOnChange?: (e: any) => void;
  children: any;
  renderElement?: boolean | ((value: any, values?: IGenericObject) => void);
  withFocus?: boolean;
  fieldChange?: (
    values: IGenericObject,
    set: (values: IGenericObject) => void,
    FormikProps: FormikProps<IGenericObject>
  ) => void;
}

const BaseField = (props: IProps) => {
  const {
    field: { name, onChange, onBlur, value },
    form: { touched, errors, values, setFieldValue, setFieldTouched },
    required,
    label,
    hint,
    handleOnBlur,
    handleOnChange,
    children,
    className,
    groupClass = 'text-input',
    fieldChange,
    renderElement,
    extraLabel,
    withFocus,
  } = props;

  const isRequired = required && !renderElement;

  const set = (values: IGenericObject) => {
    Object.keys(values).forEach(key => setFieldValue(key, values[key]));
  };

  const childrenProps = () => {
    return {
      // text
      handleChange: (event: any) => {
        const {
          target: { value },
        } = event;
        onChange && onChange(event);
        handleOnChange && handleOnChange(event);
        fieldChange &&
          setTimeout(() => {
            fieldChange({ ...values, [name]: value }, set, props.form);
          }, 1);
      },
      handleBlur: (event: any) => {
        onBlur && onBlur(event);
        handleOnBlur && handleOnBlur(event);
        fieldChange && fieldChange({ ...values, [name]: value }, set, props.form);
      },
      handleFocus: () => {
        setFieldTouched(name, false);
      },
      classes: classNames('form-control', className, {
        'is-invalid': errors[name] && touched[name],
      }),
    };
  };

  /*console.log(touched);
  console.log(values);*/

  const showMessageError = touched[name] && errors[name];
  return (
    <div className={classNames('form-group', groupClass, { 'with-focus': withFocus })}>
      {extraLabel ? (
        <label>{extraLabel}</label>
      ) : (
        label && (
          <label className={classNames({ required: isRequired })} htmlFor={name}>
            {label}
          </label>
        )
      )}

      {typeof renderElement === 'function'
        ? renderElement(value, values)
        : children(childrenProps())}
      {showMessageError ? (
        <ErrorMessage name={name} component="div" className="invalid-feedback" />
      ) : (
        hint && <div className="hint-container">{hint}</div>
      )}
    </div>
  );
};

export default BaseField;
