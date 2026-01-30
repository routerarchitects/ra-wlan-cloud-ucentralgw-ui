import React, { useMemo } from 'react';
import { Tab, useColorMode, useMultiStyleConfig, useTab } from '@chakra-ui/react';
import { useFastField } from 'hooks/useFastField';

// eslint-disable-next-line react/prop-types
const InterfaceTab: React.FC<{ index: number }> = React.forwardRef(({ index, ...props }, ref) => {
  const { value } = useFastField({ name: `configuration[${index}]` });
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';
  // @ts-ignore
  const tabProps = useTab({ ...props, ref });

  const styles = useMultiStyleConfig('Tabs', tabProps);

  const name = useMemo(() => {
    if (value?.name) {
      return value.name.length <= 15 ? value.name : `${value.name.substring(0, 12)}...`;
    }
    return '';
  }, [value]);

  return (
    <Tab
      _selected={{
        // @ts-ignore
        ...styles.tab?._selected,
        borderBottomColor: isLight ? 'gray.100' : 'gray.800',
      }}
    >
      {name} ({value?.role})
    </Tab>
  );
});

export default React.memo(InterfaceTab);
