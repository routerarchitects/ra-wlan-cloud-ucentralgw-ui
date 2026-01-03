import React from 'react';
import { Text } from '@chakra-ui/react';
const DisplaySelectPortsField: React.FC<{value?: any}> = ({ value }) => (
  <Text fontSize="sm">{JSON.stringify(value)}</Text>
);
export default React.memo(DisplaySelectPortsField);
