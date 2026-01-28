import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import ApConfigurationDisplay from './ap/ConfigurationDisplay';
import SwitchConfigurationDisplay from './switch/ConfigurationDisplay';
import { ConfigurationDisplayProps } from './common/types';

type DeviceType = 'ap' | 'switch';

type Props = ConfigurationDisplayProps & {
  deviceType?: DeviceType;
};

const DeviceTypeConfigurationDisplay = ({ deviceType, ...props }: Props) => {
  if (deviceType === 'switch') {
    return <SwitchConfigurationDisplay {...props} />;
  }
  if (deviceType === 'ap') {
    return <ApConfigurationDisplay {...props} />;
  }
  return (
    <Box p={6}>
      <Text fontWeight="bold">Unknown device type</Text>
      <Text color="gray.500" mt={2}>
        Received deviceType: {deviceType ?? 'undefined'}
      </Text>
    </Box>
  );
};

export default React.memo(DeviceTypeConfigurationDisplay);
