import React, { useCallback } from 'react';
import { useField } from 'formik';
import Field from './FastMultiSelectInput';

interface MultiSelectFieldProps {
  name: string;
  label: string;
  options: { label: string; value: string | number }[];
  isDisabled?: boolean;
  isRequired?: boolean;
  isHidden?: boolean;
  emptyIsUndefined?: boolean;
  hasVirtualAll?: boolean;
  canSelectAll?: boolean;
  isPortal?: boolean;
  definitionKey?: string | null;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  name,
  isDisabled = false,
  label,
  isRequired = false,
  isHidden = false,
  emptyIsUndefined = false,
  canSelectAll = false,
  hasVirtualAll = false,
  isPortal = false,
  definitionKey = null,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField<(string | number)[]>(name);

  const onChange = useCallback((option: readonly { value: string | number; label: string }[]) => {
    const allIndex = option.findIndex((opt) => opt.value === '*');
    if (option.length === 0 && emptyIsUndefined) {
      setValue(undefined as any);
    } else if (allIndex === 0 && option.length > 1) {
      const newValues = option.slice(1);
      setValue(newValues.map((val) => val.value));
    } else if (allIndex >= 0) {
      if (!hasVirtualAll) setValue(['*'] as any);
      else setValue(options.map(({ value: v }) => v));
    } else if (option.length > 0) setValue(option.map((val) => val.value));
    else setValue([]);
    setTouched(true);
  }, [emptyIsUndefined, hasVirtualAll, options, setValue, setTouched]);

  const onFieldBlur = useCallback(() => {
    setTouched(true);
  }, [setTouched]);

  return (
    <Field
      canSelectAll={canSelectAll}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onFieldBlur}
      error={error}
      touched={touched}
      options={options}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isHidden={isHidden}
      isPortal={isPortal}
      definitionKey={definitionKey}
    />
  );
};

export default React.memo(MultiSelectField);
