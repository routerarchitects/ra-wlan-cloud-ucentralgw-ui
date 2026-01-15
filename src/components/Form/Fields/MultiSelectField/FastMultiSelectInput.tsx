import React from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';

interface FastMultiSelectInputProps {
  value?: (string | number)[];
  label: string;
  onChange: (option: readonly { value: string | number; label: string }[]) => void;
  options: { label: string; value: string | number }[];
  onBlur: () => void;
  error?: string | boolean;
  touched?: boolean;
  isDisabled?: boolean;
  canSelectAll?: boolean;
  isRequired?: boolean;
  isHidden?: boolean;
  isPortal?: boolean;
  definitionKey?: string | null;
}

const FastMultiSelectInput: React.FC<FastMultiSelectInputProps> = ({
  options,
  label,
  value = [],
  onChange,
  onBlur,
  error = false,
  touched = false,
  canSelectAll = false,
  isRequired = false,
  isDisabled = false,
  isHidden = false,
  isPortal = false,
}) => {
  const { t } = useTranslation();

  return (
    <FormControl isInvalid={!!error && touched} isRequired={isRequired} hidden={isHidden}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
      </FormLabel>
      <Select
        chakraStyles={{
          control: (provided, { isDisabled: isControlDisabled }) => ({
            ...provided,
            borderRadius: '15px',
            opacity: isControlDisabled ? '0.8 !important' : '1',
            border: '2px solid',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            backgroundColor: 'unset',
            border: 'unset',
          }),
        }}
        classNamePrefix={isPortal ? 'chakra-react-select' : ''}
        menuPortalTarget={isPortal ? document.body : undefined}
        isMulti
        closeMenuOnSelect={false}
        options={canSelectAll ? [{ value: '*', label: t('common.all') }, ...options] : options}
        value={
          value?.map((val) => {
            if (val === '*') return { value: val, label: t('common.all') };
            return options.find((opt) => opt.value === val);
          }).filter(Boolean) as { value: string | number; label: string }[] ?? []
        }
        onChange={(newValue) => onChange(newValue as readonly { value: string | number; label: string }[])}
        onBlur={onBlur}
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default React.memo(FastMultiSelectInput, isEqual);
