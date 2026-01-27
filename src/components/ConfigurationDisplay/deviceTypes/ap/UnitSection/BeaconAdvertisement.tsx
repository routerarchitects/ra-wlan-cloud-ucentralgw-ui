import * as React from 'react';
import { Box, Flex, Heading, Switch } from '@chakra-ui/react';
import { NumberField } from 'components/Form/Fields/NumberField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';

type Props = {
  isEditing: boolean;
};

const BeaconAdvertisement = ({ isEditing }: Props) => {
  const field = useFastField<any>({ name: 'configuration.beacon-advertisement' });

  const isActive = !!field.value;

  const onOpen = React.useCallback(() => {
    field.onChange({
      'device-name': true,
      'device-serial': true,
      'network-id': 0,
    });
  }, []);

  const onClose = React.useCallback(() => {
    field.onChange(undefined);
  }, []);

  return (
    <Box>
      <Flex alignItems="center">
        <Heading size="md">Beacon Advertisement</Heading>
        <Switch size="lg" ml="2" isChecked={isActive} onChange={isActive ? onClose : onOpen} isDisabled={!isEditing} />
      </Flex>
      {isActive ? (
        <Flex mt={2}>
          <Box w="220px">
            <ToggleField
              name="configuration.beacon-advertisement.device-name"
              label="Device Name"
              isDisabled={!isEditing}
            />
          </Box>
          <Box w="220px">
            <ToggleField
              name="configuration.beacon-advertisement.device-serial"
              label="Device Serial"
              isDisabled={!isEditing}
            />
          </Box>
          <NumberField
            name="configuration.beacon-advertisement.network-id"
            label="Network ID"
            isDisabled={!isEditing}
            w="120px"
          />
        </Flex>
      ) : null}
    </Box>
  );
};

export default BeaconAdvertisement;
