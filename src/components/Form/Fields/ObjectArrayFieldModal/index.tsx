import React from 'react';
import { Box, Button, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useField } from 'formik';

// TODO: This is a stub implementation of ObjectArrayFieldModal
// The full component needs to be ported from owprov-ui or implemented
// This stub allows the build to succeed but the functionality is limited

export interface ObjectArrayFieldModalOptions {
  buttonLabel: string;
  buttonIcons?: React.ReactNode;
  fields: {
    name: string;
    label: string;
    type?: string;
    isRequired?: boolean;
    options?: { label: string; value: string | number }[];
  }[];
  schema?: any;
  isDisabled?: boolean;
  columns?: number;
}

interface ObjectArrayFieldModalProps {
  name: string;
  label: string;
  fields: ObjectArrayFieldModalOptions['fields'];
  schema?: any;
  isDisabled?: boolean;
  columns?: number;
  buttonLabel?: string;
  buttonIcons?: React.ReactNode;
  hideLabel?: boolean;
}

const ObjectArrayFieldModal: React.FC<ObjectArrayFieldModalProps> = ({
  name,
  label,
  isDisabled = false,
  buttonLabel = 'Add Item',
  hideLabel = false,
}) => {
  const [{ value }] = useField<any[]>(name);

  return (
    <FormControl isDisabled={isDisabled}>
      {!hideLabel && (
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          {label}
        </FormLabel>
      )}
      <Box>
        <Text fontSize="sm" color="gray.500" mb={2}>
          {value?.length || 0} items configured
        </Text>
        <Button size="sm" isDisabled={isDisabled} colorScheme="blue">
          {buttonLabel}
        </Button>
        <Text fontSize="xs" color="orange.500" mt={2}>
          ⚠️ ObjectArrayFieldModal stub - Full implementation needed
        </Text>
      </Box>
    </FormControl>
  );
};

export default React.memo(ObjectArrayFieldModal);
