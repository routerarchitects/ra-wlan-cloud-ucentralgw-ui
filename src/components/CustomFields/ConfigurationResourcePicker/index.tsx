import React from 'react';
import { FormControl, FormLabel, Text, Box } from '@chakra-ui/react';
import { useField } from 'formik';

// TODO: Stub - ConfigurationResourcePicker from owprov-ui not available
interface ConfigurationResourcePickerProps {
  name: string;
  label?: string;
  isDisabled?: boolean;
  resourceType?: string;
}

const ConfigurationResourcePicker: React.FC<ConfigurationResourcePickerProps> = ({
  name,
  label = 'Resource',
  isDisabled = false,
}) => {
  const [{ value }] = useField<any>(name);

  // Safely convert value to string - it might be an object
  const displayValue = React.useMemo(() => {
    if (!value) return 'No resource selected';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // If it's an object, try to extract a meaningful identifier
      if (value.__variableBlock?.[0]) return `Resource: ${value.__variableBlock[0]}`;
      if (value.id) return `Resource: ${value.id}`;
      return 'Resource configured';
    }
    return String(value);
  }, [value]);

  return (
    <FormControl isDisabled={isDisabled}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Text fontSize="sm">{displayValue}</Text>
        <Text fontSize="xs" color="orange.500" mt={1}>⚠️ Stub - Full implementation needed</Text>
      </Box>
    </FormControl>
  );
};

export default React.memo(ConfigurationResourcePicker);
