import React from 'react';
import { FormControl, FormLabel, Input, LayoutProps, SpaceProps } from '@chakra-ui/react';

interface DisplayStringFieldProps extends LayoutProps, SpaceProps {
  label: string;
  value?: string;
  isRequired?: boolean;
}

const DisplayStringField: React.FC<DisplayStringFieldProps> = ({
  label,
  value = '',
  isRequired = false,
  ...props
}) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <Input
      value={value}
      borderRadius="15px"
      fontSize="sm"
      isDisabled
      _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
      {...props}
    />
  </FormControl>
);

export default DisplayStringField;
