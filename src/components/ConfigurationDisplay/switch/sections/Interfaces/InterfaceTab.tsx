import React from 'react';
import { Tab, useColorMode, useMultiStyleConfig, useTab } from '@chakra-ui/react';

// eslint-disable-next-line react/prop-types
const InterfaceTab: React.FC<{ index: number }> = React.forwardRef(({ index, ...props }, ref) => {
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';
  // @ts-ignore
  const tabProps = useTab({ ...props, ref });

  const styles = useMultiStyleConfig('Tabs', tabProps);

  return (
    <Tab
      _selected={{
        // @ts-ignore
        ...styles.tab?._selected,
        borderBottomColor: isLight ? 'gray.100' : 'gray.800',
      }}
    >
      Interface {index + 1}
    </Tab>
  );
});

export default React.memo(InterfaceTab);
