import React, { ReactNode, useRef } from 'react';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { RootState } from 'ReduxTypes';
import { bindActionCreators, Dispatch } from 'redux';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { IGenericObject, IRequestResult, requestType } from '../../../config/interfaces';
import { t } from '../../../config/i18n';
import { PasswordInput, TextInput, DropZone, Button, SelectInput } from '../';
import { capitalize } from '../../../utils/Helpers';

import { callUrlServiceAction } from '../../../bin/redux_session/actions';
import './FormFields.scss';
import Recaptcha from '../Recaptcha/Recaptcha';
import { CardContainer } from '../../Containers';
import classNames from 'classnames';
import { endpoints } from '../../../config/AppUrls';

export interface ISelectProps {
  isMultiple?: boolean; // select
  forceToList?: boolean; // select
  fullValues?: boolean; // select
  options?: [] | IGenericObject;
}
export interface IFields {
  required?: boolean;
  key?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  toggleIcon?: boolean;
  withLabel?: boolean;
  renderElement?: boolean | ((value: any, values?: IGenericObject) => void);
  withPlaceholder?: boolean;
  flex?: number;
  breaking?: boolean;
  disabled?: boolean | ((values: IGenericObject) => void);
  editable?: boolean | ((values: IGenericObject) => void);
  min?: number;
  max?: number;
  yup?: any;
  events?: any;
  selectProps?: ISelectProps;
  defaultValue?: string;
  validate?: () => void;
  sitekey?: string;
  fieldChange?: (
    values: IGenericObject,
    set: (values: IGenericObject) => void,
    FormikProps: FormikProps<IGenericObject>
  ) => void;
}

type IFieldsKeys = keyof IFields;

interface IGenericField {
  [key: string]: IFieldsKeys[];
}

export interface IFormFields {
  [key: string]: IFields;
}

export interface IFormFieldsProps {
  fields: IFormFields;
  initialValues?: IGenericObject;
  params?: IGenericObject;
  submitText?: string;
  resetText?: string;
  validateSubmit?: (v: IGenericObject, cb: (v: IGenericObject) => void) => void;
  endpoint?: keyof typeof endpoints;
  method?: requestType;
  callUrlService: typeof callUrlServiceAction;
  title?: React.ReactNode;
  endFormCode?: React.ReactNode;
  requestResult?: (v: IRequestResult) => void;
  formRef?: (v: FormikProps<IGenericObject>) => void;
  panels?: IGenericObject;
  inColumns?: boolean;
  ClassName?: string;
  isCard?: boolean;
  width?: number;
  formValues?: (v: any) => void;
}

const FormFields = (props: IFormFieldsProps) => {
  const { fields } = props;
  const {
    initialValues = {},
    submitText,
    resetText,
    validateSubmit = (v, cb: (v: IGenericObject) => void) => cb(v),
    endpoint = '',
    method = 'post',
    callUrlService,
    title,
    endFormCode,
    requestResult = v => {},
    formRef = (v: FormikProps<IGenericObject>) => {},
    panels = [{ items: Object.keys(fields) }],
    inColumns = false,
    ClassName,
    isCard = false,
    params = {},
    formValues,
  } = props;

  const getInitialValues = () => {
    return Object.keys(fields).reduce((ret: IGenericObject, key: string) => {
      const { defaultValue } = fields[key];
      return {
        ...ret,
        [key]: initialValues[key] || defaultValue || '',
      };
    }, {});
  };

  const generateYup = (field: IFields) => {
    const {
      renderElement,
      type = 'text',
      required = '',
      min = 0,
      max = 0,
      yup = null,
      selectProps,
      //events = {},
    } = field;
    if (yup) return yup;

    const types: IGenericObject = {
      number: 'number',
    };

    const isRequired = required && !renderElement;

    //////console.log(events);

    const testValidation = ['file', 'datetime']; // for use of |validation
    const info: IGenericObject = {
      [types[type] || 'string']: true,
      //...events,
      ...(min && { min: [min, t('validationMinRequired')] }),
      ...(max && { max: [max, t('validationMaxRequired')] }),
      ...(isRequired && { required: t('validationFieldRequired') }),
      ...(type === 'email' && { email: t('validationEmail') }),
      ...(type === 'recaptcha' && { nullable: [], required: t('validationRecaptchaRequired') }),
      ...(type === 'select' && { ...selectProps }),
      //...(testValidation.includes(type) && {
      test: function (fieldValue: any) {
        if (typeof fieldValue === 'string') {
          const { path, createError } = this;
          const [value, error] = fieldValue.split('|validation');
          // return this.required(value);
          return error ? createError({ path, message: t(`validation${error}`, { value }) }) : this;
        }
        return this;
      },
      //}),
    };

    return Object.keys(info).reduce((ret: IGenericObject, key: string) => {
      const param = info[key];
      const arrayParam = Array.isArray(param) ? param : [param];
      const params = param === true ? [] : arrayParam;

      if (param && ret[key]) return ret[key](...params);
      else return ret;
    }, Yup);
  };

  const validationSchema = () => {
    const result = Object.keys(fields).reduce((ret: IGenericObject, key: string) => {
      return {
        ...ret,
        [key]: generateYup(fields[key]),
      };
    }, {});

    return Yup.object().shape({
      ...result,
    });
  };

  const generateFormBody = (formData: FormikProps<IGenericObject>) => {
    //console.log(formData);
    //console.log(formData);

    return panels.map((panelProp: IGenericObject, i: number) => {
      return (
        <CardContainer key={`cont-unique-${i}`} isCard={isCard}>
          {generateFields(formData, panelProp)}
        </CardContainer>
      );
    });
  };

  const generateFields = (formData: FormikProps<any>, panelProp: IGenericObject) => {
    const { items: fieldItems, columns = 1 } = panelProp;
    const { isSubmitting, values } = formData;

    const renderFields = fieldItems.map((name: string) => {
      if (!fields[name]) return null;
      const { key = name } = fields[name];
      const {
        type = 'text',
        withLabel = true,
        disabled = false,
        label = t(`label${capitalize(key)}`),
        withPlaceholder = true,
        placeholder = t(`placeholder${capitalize(key)}`),
        flex = 1,
        editable = true,
        events,
        ...restProps
      } = fields[name];

      //console.log(restProps);

      if (type === 'hidden') return <Field key={key} name={name} type="hidden" />;

      const components: IGenericObject = {
        password: PasswordInput,
        select: SelectInput,
        recaptcha: Recaptcha,
        file: DropZone,
        datetime: {
          component: SelectInput,
          toggleType: 'datetime',
        },
      };

      const isEditable = typeof editable === 'function' ? editable(values) : editable;
      const isDisabled = typeof disabled === 'function' ? disabled(values) : disabled;
      const componentInfo = {
        ...(components[type]
          ? components[type].component
            ? components[type]
            : {
                component: components[type],
              }
          : {
              component: TextInput,
            }),
      };

      const allProps: IGenericObject = {
        // define all new props for fields

        ...componentInfo,
        ...(withLabel && { label }),
        ...(withPlaceholder && { placeholder }),
        ...(type !== 'text' && { type }),
        ...((isDisabled || ((isSubmitting || !isEditable) && { disabled: true })) as {}),
        flex,
        name,
        key,
        ...events,
        ...restProps,
      };

      const ignoreProps: IGenericField = {
        // some components not require this props
        recaptcha: ['type', 'label', 'disabled', 'placeholder'],
        file: ['type', 'label', 'disabled', 'placeholder'],
      };

      // ignore props

      //console.log(allProps);
      const fieldProps: IGenericObject = Object.keys(allProps).reduce(
        (ret: IGenericObject, key: any) => {
          return {
            ...ret,
            ...(!(ignoreProps[type] || []).includes(key) && { [key]: allProps[key] }),
          };
        },
        {}
      );
      return <Field key={key} {...fieldProps} />;
    });

    //////console.log(renderFields);
    const multiColumn = columns > 1;
    if (!multiColumn) return renderFields;

    // logic for multiColumns
    const arrayOfElem: ReactNode[][] = [];
    const colLength = 12 / columns;

    let col: number = 0;
    let row: number = 0;
    for (let t = 0; t < renderFields.length; ++t) {
      const fieldNode = renderFields[t];
      const {
        props: { flex, breaking },
      } = fieldNode;
      if (!arrayOfElem[row]) arrayOfElem[row] = [];
      const length = flex * colLength;
      arrayOfElem[row].push(<div className={classNames(`col-md-${length}`)}>{fieldNode}</div>);
      col += length;
      if (col >= 12 || breaking) {
        row++;
        col = 0;
      }
    }

    return arrayOfElem.map((item, i) => (
      <div className="row" key={i}>
        {item}
      </div>
    ));
  };

  const handleSubmit = (values: IGenericObject, formData: FormikHelpers<IGenericObject>) => {
    const { setSubmitting } = formData;
    validateSubmit(values, (validateValues: IGenericObject) => {
      if (validateValues && endpoint) {
        callUrlService(endpoint, { ...validateValues, ...params }, method, v => {
          setSubmitting(false);

          /**/
          const { status, errors = {} } = v;
          switch (status) {
            case 422:
              Object.keys(errors).forEach(name => {
                const { setFieldTouched, setFieldError } = formData;
                setFieldTouched(name, true, false);
                setFieldError(name, errors[name][0]);
              });
              break;
          }
          /**/

          requestResult(v);
        });
      } else {
        setSubmitting(false);
      }
    });
  };

  const formEl = useRef<any>(null);

  const handleReset = (formData: any) => {
    const { resetForm, submitForm } = formData;

    resetForm();
    submitForm();
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={validationSchema()}
      onSubmit={handleSubmit}
    >
      {formData => {
        const { isSubmitting, values } = formData;
        formRef(formData);
        formValues && formValues(values);
        return (
          <Form
            ref={formEl}
            className={classNames(ClassName, 'form-fields', { 'in-columns': inColumns })}
            autoComplete="off"
          >
            {title && <h6>{title}</h6>}
            {generateFormBody(formData)}
            {endFormCode}
            {(submitText || resetText) && (
              <div className="footer-buttons">
                {submitText && (
                  <Button
                    isSubmitting={isSubmitting}
                    type="submit"
                    buttonType="dark"
                    className="form-control mt-3"
                  >
                    {submitText}
                  </Button>
                )}
                {resetText && (
                  <Button
                    buttonType="light"
                    className="form-control mt-3"
                    disabled={isSubmitting}
                    onClick={() => {
                      handleReset(formData);
                    }}
                  >
                    {resetText}
                  </Button>
                )}
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      callUrlService: callUrlServiceAction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FormFields);
