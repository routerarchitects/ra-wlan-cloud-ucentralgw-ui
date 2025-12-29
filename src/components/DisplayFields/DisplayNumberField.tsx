import React from 'react';
import { FormControl, FormLabel, LayoutProps, NumberInput, NumberInputField, SpaceProps } from '@chakra-ui/react';

interface DisplayNumberFieldProps extends LayoutProps, SpaceProps {
  label: string;
  value: string | number;
  isRequired?: boolean;
}

const DisplayNumberField: React.FC<DisplayNumberFieldProps> = ({
  label,
  value,
  isRequired = false,
  ...props
}) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <NumberInput allowMouseWheel value={value} borderRadius="15px" fontSize="sm" {...props}>
      <NumberInputField />
    </NumberInput>
  </FormControl>
);

export default DisplayNumberField;
