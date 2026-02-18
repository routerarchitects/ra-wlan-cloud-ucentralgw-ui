import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';
import ApConfigurationDisplay from './ap/ConfigurationDisplay';
import OlgConfigurationDisplay from './olg/ConfigurationDisplay';
import SwitchConfigurationDisplay from './switch/ConfigurationDisplay';
import { ConfigurationDisplayProps } from './common/types';

type DeviceType = 'ap' | 'switch' | 'olg';

type Props = ConfigurationDisplayProps & {
  deviceType?: DeviceType | string;
};

const DeviceTypeConfigurationDisplay = ({ deviceType, ...props }: Props) => {
  const normalizedType = (deviceType ?? '').trim().toLowerCase();

  if (normalizedType === 'switch') {
    return <SwitchConfigurationDisplay {...props} />;
  }

  if (normalizedType === 'olg') {
    return <OlgConfigurationDisplay {...props} />;
  }

  if (normalizedType === 'ap') {
    return <ApConfigurationDisplay {...props} />;
  }

  // Keep unsupported types explicit to avoid rendering the wrong schema/UI.
  // eslint-disable-next-line no-console
  console.warn('[DeviceTypeConfigurationDisplay] Unsupported device type:', deviceType);

  return (
    <Alert status="warning" variant="left-accent" my={2}>
      <AlertIcon />
      <Box>
        <AlertTitle>Unsupported device type</AlertTitle>
        <AlertDescription>
          Device type "{deviceType ?? 'unknown'}" is not supported for configuration display.
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export default React.memo(DeviceTypeConfigurationDisplay);
