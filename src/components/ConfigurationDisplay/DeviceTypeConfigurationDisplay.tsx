import React from 'react';
import ApConfigurationDisplay from './ap/ConfigurationDisplay';
import OlgConfigurationDisplay from './olg/ConfigurationDisplay';
import SwitchConfigurationDisplay from './switch/ConfigurationDisplay';
import { ConfigurationDisplayProps } from './common/types';

type DeviceType = 'ap' | 'switch' | 'olg';

type Props = ConfigurationDisplayProps & {
  deviceType?: DeviceType;
};

const DeviceTypeConfigurationDisplay = ({ deviceType, ...props }: Props) => {
  if (deviceType === 'switch') {
    return <SwitchConfigurationDisplay {...props} />;
  }

  if (deviceType === 'olg') {
    return <OlgConfigurationDisplay {...props} />;
  }

  return <ApConfigurationDisplay {...props} />;
};

export default React.memo(DeviceTypeConfigurationDisplay);
