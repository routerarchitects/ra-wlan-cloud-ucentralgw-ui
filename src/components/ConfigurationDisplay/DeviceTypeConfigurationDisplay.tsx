import React from 'react';
import ApConfigurationDisplay from './deviceTypes/ap';
import SwitchConfigurationDisplay from './deviceTypes/switch';

type Props = React.ComponentProps<typeof ApConfigurationDisplay> & {
  deviceType?: string;
};

const DeviceTypeConfigurationDisplay = ({ deviceType, ...props }: Props) => {
  if (deviceType === 'switch') {
    return <SwitchConfigurationDisplay {...props} />;
  }
  return <ApConfigurationDisplay {...props} />;
};

export default React.memo(DeviceTypeConfigurationDisplay);
