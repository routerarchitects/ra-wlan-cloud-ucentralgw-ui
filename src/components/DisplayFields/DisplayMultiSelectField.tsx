import React from 'react';
import { FormControl, FormLabel, LayoutProps, SpaceProps } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';

interface DisplayMultiSelectFieldProps extends LayoutProps, SpaceProps {
  label: string;
  value: string[] | number[];
  isRequired?: boolean;
  options: { value: string | number; label: string }[];
  isPortal?: boolean;
}

const DisplayMultiSelectField: React.FC<DisplayMultiSelectFieldProps> = ({
  label,
  value,
  isRequired = false,
  options,
  isPortal = false,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <FormControl isRequired={isRequired} isDisabled>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
      </FormLabel>
      <Select
        chakraStyles={{
          control: (provided: any, { isDisabled: isControlDisabled }: { isDisabled: boolean }) => ({
            ...provided,
            borderRadius: '15px',
            opacity: isControlDisabled ? '0.8 !important' : '1',
          }),
          dropdownIndicator: (provided: any) => ({
            ...provided,
            backgroundColor: 'unset',
            border: 'unset',
          }),
        }}
        classNamePrefix={isPortal ? 'chakra-react-select' : ''}
        menuPortalTarget={isPortal ? document.body : undefined}
        isMulti
        closeMenuOnSelect={false}
        options={options}
        {...props}
        value={
          value?.map((val) => {
            if (val === '*') return { value: val, label: t('common.all') };
            return options.find((opt) => opt.value === val);
          }).filter(Boolean) ?? []
        }
        isDisabled
      />
    </FormControl>
  );
};

export default DisplayMultiSelectField;
