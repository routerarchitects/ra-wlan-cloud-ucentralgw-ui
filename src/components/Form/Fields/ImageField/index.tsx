import React from 'react';
import { FormControl, FormLabel, Text, Box } from '@chakra-ui/react';
import { useField } from 'formik';

// TODO: Stub - ImageField needs full implementation
interface ImageFieldProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

const ImageField: React.FC<ImageFieldProps> = ({
  name,
  label,
  isDisabled = false,
  isRequired = false,
}) => {
  const [{ value }] = useField<string>(name);

  return (
    <FormControl isDisabled={isDisabled} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Text fontSize="sm">{value ? 'Image configured' : 'No image selected'}</Text>
        <Text fontSize="xs" color="orange.500" mt={1}>⚠️ ImageField stub</Text>
      </Box>
    </FormControl>
  );
};

export default React.memo(ImageField);
