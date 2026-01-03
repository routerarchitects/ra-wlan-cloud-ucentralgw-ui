import React from 'react';
import { Text } from '@chakra-ui/react';
const DisplayObjectArrayField: React.FC<{value?: any[]}> = ({ value }) => (
  <Text fontSize="sm">{value?.length || 0} items</Text>
);
export default React.memo(DisplayObjectArrayField);
