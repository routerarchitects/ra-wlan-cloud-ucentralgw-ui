import * as React from 'react';
import { Flex, Heading, IconButton, SimpleGrid, Spacer, Tooltip } from '@chakra-ui/react';
import { Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { SERVICES_CLASSIFIER_DNS_SCHEMA, SERVICES_CLASSIFIER_PORTS_SCHEMA } from '../servicesConstants';
import { Card } from 'components/Containers/Card';
import { NumberField } from 'components/Form/Fields/NumberField';
import ObjectArrayFieldModal from 'components/Form/Fields/ObjectArrayFieldModal';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const CLASSIFIER_PROTO_OPTS = [
  { value: 'any', label: 'any' },
  { value: 'tcp', label: 'tcp' },
  { value: 'udp', label: 'udp' },
];

export const DSCP_OPTIONS = [
  { value: 'CS0', label: 'CS0' },
  { value: 'CS1', label: 'CS1' },
  { value: 'CS2', label: 'CS2' },
  { value: 'CS3', label: 'CS3' },
  { value: 'CS4', label: 'CS4' },
  { value: 'CS5', label: 'CS5' },
  { value: 'CS6', label: 'CS6' },
  { value: 'CS7', label: 'CS7' },
  { value: 'AF11', label: 'AF11' },
  { value: 'AF12', label: 'AF12' },
  { value: 'AF13', label: 'AF13' },
  { value: 'AF21', label: 'AF21' },
  { value: 'AF22', label: 'AF22' },
  { value: 'AF23', label: 'AF23' },
  { value: 'AF31', label: 'AF31' },
  { value: 'AF32', label: 'AF32' },
  { value: 'AF33', label: 'AF33' },
  { value: 'AF41', label: 'AF41' },
  { value: 'AF42', label: 'AF42' },
  { value: 'AF43', label: 'AF43' },
  { value: 'DF', label: 'DF' },
  { value: 'EF', label: 'EF' },
  { value: 'VA', label: 'VA' },
  { value: 'LE', label: 'LE' },
];

type Props = { editing: boolean; index: number; onRemove: () => void };

export const ClassifierField = ({ editing, index, onRemove }: Props) => {
  const { t } = useTranslation();

  return (
    <Card my={1}>
      <Flex>
        <Heading size="sm" mt={1.5}>
          #{index}
        </Heading>
        <Spacer />
        <Tooltip label={t('crud.add')}>
          <IconButton
            aria-label={t('crud.add')}
            onClick={onRemove}
            icon={<Trash size={20} />}
            size="sm"
            colorScheme="red"
            isDisabled={!editing}
          />
        </Tooltip>
      </Flex>
      <SimpleGrid minChildWidth="200px" spacing="20px" mb={2} w="100%">
        <SelectField
          name={`configuration.quality-of-service.classifier[${index}].dscp`}
          label="dscp"
          options={DSCP_OPTIONS}
          definitionKey="service.quality-of-service.bulk-detection.dscp"
          isDisabled={!editing}
          isRequired
          w="100px"
        />
        <ObjectArrayFieldModal
          name={`configuration.quality-of-service.classifier[${index}].ports`}
          label="ports"
          definitionKey={`service.quality-of-service.classifier[${index}].ports`}
          fields={
            <SimpleGrid minChildWidth="100px" gap={4}>
              <SelectField name="protocol" label="protocol" options={CLASSIFIER_PROTO_OPTS} isRequired w={24} />
              <NumberField name="port" label="port" isDisabled={!editing} isRequired w={24} />
              <NumberField name="range-end" label="range-end" isDisabled={!editing} isRequired w={24} />
              <ToggleField name="reclassify" label="reclassify" isDisabled={!editing} isRequired />
            </SimpleGrid>
          }
          columns={[
            {
              id: 'protocol',
              Header: 'protocol',
              Footer: '',
              accessor: 'protocol',
            },
            {
              id: 'port',
              Header: 'port',
              Footer: '',
              accessor: 'port',
              customWidth: '50px',
            },
            {
              id: 'reclassify',
              Header: 'reclassify',
              Footer: '',
              // @ts-ignore
              Cell: ({ cell }: { cell: { row: { original: { reclassify: boolean } } } }) =>
                cell.row.original.reclassify ? 'true' : 'false',
              accessor: 'reclassify',
              customWidth: '50px',
            },
            {
              id: 'range-end',
              Header: 'range-end',
              Footer: '',
              accessor: 'range-end',
              customWidth: '100px',
            },
          ]}
          schema={SERVICES_CLASSIFIER_PORTS_SCHEMA}
          isDisabled={!editing}
          isRequired
        />
        <ObjectArrayFieldModal
          name={`configuration.quality-of-service.classifier[${index}].dns`}
          label="dns"
          definitionKey={`service.quality-of-service.classifier[${index}].dns`}
          fields={
            <SimpleGrid minChildWidth="100px" gap={4}>
              <StringField name="fqdn" label="fqdn" isDisabled={!editing} isRequired />
              <ToggleField name="suffix-matching" label="suffix-matching" isDisabled={!editing} isRequired />
              <ToggleField name="reclassify" label="reclassify" isDisabled={!editing} isRequired />
            </SimpleGrid>
          }
          columns={[
            {
              id: 'fqdn',
              Header: 'fqdn',
              Footer: '',
              accessor: 'fqdn',
            },
            {
              id: 'suffix-matching',
              Header: 'suffix-matching',
              Footer: '',
              // @ts-ignore
              Cell: ({ cell }: { cell: { row: { original: { 'suffix-matching': boolean } } } }) =>
                cell.row.original['suffix-matching'] ? 'true' : 'false',
              accessor: 'suffix-matching',
              customWidth: '50px',
            },
            {
              id: 'reclassify',
              Header: 'reclassify',
              Footer: '',
              // @ts-ignore
              Cell: ({ cell }: { cell: { row: { original: { reclassify: boolean } } } }) =>
                cell.row.original.reclassify ? 'true' : 'false',
              accessor: 'reclassify',
              customWidth: '50px',
            },
          ]}
          schema={SERVICES_CLASSIFIER_DNS_SCHEMA}
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </Card>
  );
};
