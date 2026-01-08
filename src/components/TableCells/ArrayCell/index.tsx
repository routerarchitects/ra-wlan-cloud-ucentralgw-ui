import React from 'react';
import { Text } from '@chakra-ui/react';

// TODO: Stub - ArrayCell component needs full implementation
interface ArrayCellProps {
  value?: any[];
}

const ArrayCell: React.FC<ArrayCellProps> = ({ value }) => {
  return <Text fontSize="sm">{value?.length || 0} items</Text>;
};

export default React.memo(ArrayCell);
