import React from 'react';
import { FormControl, FormLabel, LayoutProps, SpaceProps, Switch } from '@chakra-ui/react';

interface DisplayToggleFieldProps extends LayoutProps, SpaceProps {
  label: string;
  value: boolean;
  isRequired?: boolean;
}

const DisplayToggleField: React.FC<DisplayToggleFieldProps> = ({
  label,
  value,
  isRequired = false,
  ...props
}) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <Switch
      isChecked={value}
      borderRadius="15px"
      size="lg"
      isDisabled
      {...props}
      _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
    />
  </FormControl>
);

export default DisplayToggleField;
