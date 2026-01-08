import React, { useMemo } from 'react';
import { FormControl, FormLabel, Heading, Select, SimpleGrid } from '@chakra-ui/react';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import { useGetResource } from 'hooks/Network/Resources';

const LockedTunnel = ({ variableBlockId }: { variableBlockId?: string }) => {
  const { data: resource } = useGetResource({
    id: variableBlockId ?? '',
    enabled: variableBlockId !== undefined,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  const fieldProps = (suffix: string) => ({
    name: suffix,
    label: suffix,
    value: data?.[suffix],
    definitionKey: `interface.tunnel.${suffix}`,
    isDisabled: true,
  });

  if (!data) return null;

  return (
    <SimpleGrid minChildWidth="200px" spacing="20px" mb={8} mt={2} w="100%">
      <Heading size="md" display="flex">
        <FormControl isDisabled>
          <FormLabel>Protocol</FormLabel>
          <Select value={data?.proto ?? ''} borderRadius="15px" fontSize="sm" w="120px">
            <option value="mesh">mesh</option>
            <option value="vxlan">vxlan</option>
            <option value="l2tp">l2tp</option>
            <option value="gre">gre</option>
          </Select>
        </FormControl>
      </Heading>
      {data?.proto !== 'mesh' && (
        <>
          {data?.proto === 'vxlan' && (
            <>
              <DisplayStringField {...fieldProps('peer-address')} />
              <DisplayNumberField {...fieldProps('peer-port')} w={36} />
            </>
          )}
          {data?.proto === 'l2tp' && (
            <>
              <DisplayStringField {...fieldProps('server')} />
              <DisplayStringField {...fieldProps('user-name')} />
              <DisplayNumberField {...fieldProps('password')} w={36} />
            </>
          )}
          {data?.proto === 'vxlan' && (
            <>
              <DisplayStringField {...fieldProps('peer-address')} />
              <DisplayToggleField {...fieldProps('dhcp-healthcheck')} w={36} />
            </>
          )}
        </>
      )}
    </SimpleGrid>
  );
};

export default React.memo(LockedTunnel);
