import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import BeaconAdvertisement from './BeaconAdvertisement';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

interface Props {
  editing: boolean;
}

const Unit = ({ editing }: Props) => {
  const { t } = useTranslation();

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
            <StringField
              name="configuration.name"
              label="name"
              definitionKey="unit.name"
              isDisabled={!editing}
              isRequired
            />
            <StringField
              name="configuration.location"
              label="location"
              definitionKey="unit.location"
              isDisabled={!editing}
              isRequired
            />
            <StringField
              name="configuration.hostname"
              label="hostname"
              definitionKey="unit.hostname"
              isDisabled={!editing}
              emptyIsUndefined
            />
            <SelectField
              name="configuration.timezone"
              label="timezone"
              definitionKey="unit.timezone"
              // @ts-ignore
              emptyIsUndefined
              isDisabled={!editing}
              options={[
                { value: '', label: t('common.none') },
                {
                  value: 'UTC-11:00',
                  label: 'Midway Islands Time (UTC-11:00)',
                },
                {
                  value: 'UTC-10:00',
                  label: 'Hawaii Standard Time (UTC-10:00)',
                },
                {
                  value: 'UTC-8:00',
                  label: 'Pacific Standard Time (UTC-8:00)',
                },
                {
                  value: 'UTC-7:00',
                  label: 'Mountain Standard Time (UTC-7:00)',
                },
                {
                  value: 'UTC-6:00',
                  label: 'Central Standard Time (UTC-6:00)',
                },
                {
                  value: 'UTC-5:00',
                  label: 'Eastern Standard Time (UTC-5:00)',
                },
                {
                  value: 'UTC-4:00',
                  label: 'Puerto Rico and US Virgin Islands Time (UTC-4:00)',
                },
                {
                  value: 'UTC-3:30',
                  label: 'Canada Newfoundland Time (UTC-3:30)',
                },
                { value: 'UTC-3:00', label: 'Brazil Eastern Time (UTC-3:00)' },
                {
                  value: 'UTC-1:00',
                  label: 'Central African Time (UTC-1:00)',
                },
                {
                  value: 'UTC',
                  label: 'Universal Coordinated Time (UTC)',
                },
                {
                  value: 'UTC+1:00',
                  label: 'European Central Time (UTC+1:00)',
                },
                {
                  value: 'UTC+2:00',
                  label: 'Eastern European Time (UTC+2:00)',
                },
                {
                  value: 'UTC+2:00',
                  label: '(Arabic) Egypt Standard Time (UTC+2:00)',
                },
                {
                  value: 'UTC+3:00',
                  label: 'Eastern African Time (UTC+3:00)',
                },
                { value: 'UTC+3:30', label: 'Middle East Time (UTC+3:30)' },
                { value: 'UTC+4:00', label: 'Near East Time (UTC+4:00)' },
                {
                  value: 'UTC+5:00',
                  label: 'Pakistan Lahore Time (UTC+5:00)',
                },
                { value: 'UTC+5:30', label: 'India Standard Time (UTC+5:30)' },
                {
                  value: 'UTC+6:00',
                  label: 'Bangladesh Standard Time (UTC+6:00)',
                },
                {
                  value: 'UTC+7:00',
                  label: 'Vietnam Standard Time (UTC+7:00)',
                },
                { value: 'UTC+8:00', label: 'China Taiwan Time (UTC+8:00)' },
                { value: 'UTC+9:00', label: 'Japan Standard Time (UTC+9:00)' },
                {
                  value: 'UTC+9:30',
                  label: 'Australia Central Time (UTC+9:30)',
                },
                {
                  value: 'UTC+10:00',
                  label: 'Australia Eastern Time (UTC+10:00)',
                },
                {
                  value: 'UTC+11:00',
                  label: 'Solomon Standard Time (UTC+11:00)',
                },
                {
                  value: 'UTC+12:00',
                  label: 'New Zealand Standard Time (UTC+12:00)',
                },
              ]}
            />
            <ToggleField
              name="configuration.leds-active"
              label="leds-active"
              definitionKey="unit.leds-active"
              isDisabled={!editing}
              isRequired
            />
            <ToggleField
              name="configuration.random-password"
              label="random-password"
              definitionKey="unit.random-password"
              isDisabled={!editing}
              isRequired
            />
          </SimpleGrid>
          <BeaconAdvertisement isEditing={editing} />
        </Box>
      </CardBody>
    </Card>
  );
};

export default React.memo(Unit);
