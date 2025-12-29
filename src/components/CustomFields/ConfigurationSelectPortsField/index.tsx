import React from 'react';
import { Box, Button, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useField } from 'formik';

// TODO: Stub implementation - needs full porting
interface ConfigurationSelectPortsFieldProps {
  name: string;
  label?: string;
  isDisabled?: boolean;
}

const ConfigurationSelectPortsField: React.FC<ConfigurationSelectPortsFieldProps> = ({
  name,
  label = 'Select Ports',
  isDisabled = false,
}) => {
  const [{ value }] = useField<string[]>(name);

  return (
    <FormControl isDisabled={isDisabled}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Text fontSize="sm" mb={2}>{value?.length || 0} ports selected</Text>
        <Button size="sm" isDisabled={isDisabled}>Configure Ports</Button>
        <Text fontSize="xs" color="orange.500" mt={2}>⚠️ Stub - Full implementation needed</Text>
      </Box>
    </FormControl>
  );
};

export default React.memo(ConfigurationSelectPortsField);
