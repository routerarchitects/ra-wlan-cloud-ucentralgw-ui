import React, { useMemo } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import { useGetResource } from 'hooks/Network/Resources';

const LockedCaptive = ({ variableBlockId }: { variableBlockId?: string }) => {
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
    definitionKey: `interface.captive.${suffix}`,
    isDisabled: true,
  });

  if (!data) return null;

  return (
    <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
      <DisplayStringField {...fieldProps('gateway-name')} />
      <DisplayStringField {...fieldProps('gateway-fqdn')} />
      <DisplayNumberField {...fieldProps('max-clients')} w={36} />
      <DisplayNumberField {...fieldProps('upload-rate')} w={36} />
      <DisplayNumberField {...fieldProps('download-rate')} w={36} />
      <DisplayNumberField {...fieldProps('upload-quota')} w={36} />
      <DisplayNumberField {...fieldProps('download-quota')} w={36} />
    </SimpleGrid>
  );
};

export default React.memo(LockedCaptive);
