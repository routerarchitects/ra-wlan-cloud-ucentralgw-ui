import React from 'react';
import { Box, Button, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useField } from 'formik';

// TODO: This is a stub implementation of FileInputFieldModal
// The full component needs to be ported or implemented
// This stub allows the build to succeed but the functionality is limited

interface FileInputFieldModalProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  accept?: string;
}

const FileInputFieldModal: React.FC<FileInputFieldModalProps> = ({
  name,
  label,
  isDisabled = false,
  isRequired = false,
}) => {
  const [{ value }] = useField<string>(name);

  return (
    <FormControl isDisabled={isDisabled} isRequired={isRequired}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        {label}
      </FormLabel>
      <Box>
        <Text fontSize="sm" color="gray.500" mb={2}>
          {value ? 'File configured' : 'No file selected'}
        </Text>
        <Button size="sm" isDisabled={isDisabled} colorScheme="blue">
          Select File
        </Button>
        <Text fontSize="xs" color="orange.500" mt={2}>
          ⚠️ FileInputFieldModal stub - Full implementation needed
        </Text>
      </Box>
    </FormControl>
  );
};

export default React.memo(FileInputFieldModal);
