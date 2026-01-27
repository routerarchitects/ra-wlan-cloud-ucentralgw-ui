import React, { useMemo } from 'react';
import { Tab, useColorMode, useMultiStyleConfig, useTab } from '@chakra-ui/react';
import { useGetResource } from 'hooks/Network/Resources';
import { useFastField } from 'hooks/useFastField';

// eslint-disable-next-line react/prop-types
const RadioTab: React.FC<{ index: number }> = React.forwardRef(({ index, ...props }, ref) => {
  const { value } = useFastField({ name: `configuration[${index}]` });
  const { data: resource } = useGetResource({
    id: value?.__variableBlock,
    enabled: value?.__variableBlock !== undefined,
  });
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';

  // @ts-ignore
  const tabProps = useTab({ ...props, ref });

  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig('Tabs', tabProps);

  const name = useMemo(() => {
    if (value?.band) {
      // Ensure band is a string, not an object
      return typeof value.band === 'string' ? value.band : String(value.band);
    }
    if (resource?.variables && resource?.variables[0]?.value) {
      try {
        const json = JSON.parse(resource?.variables[0]?.value);
        return typeof json.band === 'string' ? json.band : String(json.band || '');
      } catch (e) {
        return '';
      }
    }

    return '';
  }, [value, resource]);
  return (
    <Tab
      _selected={{
        // @ts-ignore
        ...styles.tab?._selected,
        borderBottomColor: isLight ? 'gray.100' : 'gray.800',
      }}
    >
      {String(name)} Radio
    </Tab>
  );
});

export default React.memo(RadioTab);
