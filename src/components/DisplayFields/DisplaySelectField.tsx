import React from 'react';
import { FormControl, FormLabel, LayoutProps, Select, SpaceProps } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

interface DisplaySelectFieldProps extends LayoutProps, SpaceProps {
  label: string;
  value: string | number;
  isRequired?: boolean;
  options: { value: string | number; label: string }[];
}

const DisplaySelectField: React.FC<DisplaySelectFieldProps> = ({
  label,
  value,
  isRequired = false,
  options,
  ...props
}) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <Select
      value={value}
      borderRadius="15px"
      fontSize="sm"
      isDisabled
      _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
      {...props}
    >
      {options.map((option) => (
        <option value={option.value} key={uuid()}>
          {option.label}
        </option>
      ))}
    </Select>
  </FormControl>
);

export default DisplaySelectField;
