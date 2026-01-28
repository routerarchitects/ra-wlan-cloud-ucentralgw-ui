import React, { useCallback, useMemo } from 'react';
import { Box, Flex, Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';
import { useFormikContext } from 'formik';

interface Props {
  editing: boolean;
}

const Unit = ({ editing }: Props) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext();
  const { value: multicast } = useFastField({ name: 'configuration.multicast' });
  const hasMulticast = useMemo(() => multicast !== undefined, [multicast]);

  const toggleMulticast = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(
        'configuration.multicast',
        e.target.checked
          ? {
              'igmp-snooping-enable': false,
              'querier-enable': false,
            }
          : undefined,
      );
    },
    [setFieldValue],
  );

  return (
    <Card variant="widget">
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.unit')}
        </Heading>
      </CardHeader>
      <CardBody pb={8}>
        <Box w="100%">
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={4} mt={2} w="100%">
            <ToggleField
              name="configuration.leds-active"
              label="leds-active"
              definitionKey="unit.leds-active"
              isDisabled={!editing}
              isRequired
            />
            <StringField
              name="configuration.system-password"
              label="system-password"
              definitionKey="unit.system-password"
              isDisabled={!editing}
              emptyIsUndefined
            />
            <NumberField
              name="configuration.usage-threshold"
              label="usage-threshold"
              definitionKey="unit.usage-threshold"
              isDisabled={!editing}
              emptyIsUndefined
            />
          </SimpleGrid>
          <Flex align="center" mt={2} mb={2}>
            <Text fontWeight="bold" mr={2}>
              multicast
            </Text>
            <Switch isChecked={hasMulticast} onChange={toggleMulticast} isDisabled={!editing} />
          </Flex>
          {hasMulticast && (
            <SimpleGrid minChildWidth="300px" spacing="20px" mb={4} w="100%">
              <ToggleField
                name="configuration.multicast.igmp-snooping-enable"
                label="igmp-snooping-enable"
                isDisabled={!editing}
              />
              <ToggleField
                name="configuration.multicast.querier-enable"
                label="querier-enable"
                isDisabled={!editing}
              />
            </SimpleGrid>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default React.memo(Unit);
