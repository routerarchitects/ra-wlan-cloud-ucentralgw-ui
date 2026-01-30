import React, { useMemo } from 'react';
import { Tab } from '@chakra-ui/react';
import { useGetResource } from 'hooks/Network/Resources';
import { useFastField } from 'hooks/useFastField';

const SsidTab: React.FC<{ index: number; interIndex: number }> = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ index, interIndex }) => {
    const { value } = useFastField({ name: `configuration[${interIndex}].ssids[${index}]` });
    const { value: wifiBands } = useFastField({ name: `configuration[${interIndex}].ssids[${index}].wifi-bands` });
    const { data: resource } = useGetResource({
      id: value?.__variableBlock,
      enabled: value?.__variableBlock !== undefined,
    });

    const name = useMemo(() => {
      if (value?.name) {
        return value.name.length <= 12 ? value.name : `${value.name.substring(0, 9)}...`;
      }
      if (resource?.variables && resource?.variables[0]?.value) {
        try {
          const json = JSON.parse(resource?.variables[0]?.value);
          return json.name.length <= 12 ? json.name : `${json.name.substring(0, 9)}...`;
        } catch (e) {
          return '';
        }
      }

      return '';
    }, [value, resource]);

    const bands = useMemo(() => {
      if (wifiBands) return wifiBands;
      if (resource?.variables && resource?.variables[0]?.value) {
        try {
          const json = JSON.parse(resource?.variables[0]?.value);
          return json['wifi-bands'];
        } catch (e) {
          return '';
        }
      }
      return undefined;
    }, [wifiBands, resource]);
    return (
      <Tab>
        {name} ({bands?.join(', ')})
      </Tab>
    );
  },
);

export default React.memo(SsidTab);
