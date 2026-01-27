import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Flex,
  Grid,
  HStack,
  SimpleGrid,
  Spacer,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { Select as ChakraSelect } from 'chakra-react-select';
import { FieldArray, Formik, getIn, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../../../common/components/InternalFormAccess';
import SectionGeneralCard from '../../../common/components/SectionGeneralCard';
import { CreateButton } from 'components/Buttons/CreateButton';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { ConfigurationSectionShape } from 'constants/propShapes';
import {
  DEFAULT_STORM_CONTROL,
  DEFAULT_BPDU_GUARD,
  DEFAULT_DHCP_SNOOP_PORT,
  DEFAULT_LLDP,
  DEFAULT_VOICE_VLAN,
  DEFAULT_POE,
  DUPLEX_OPTIONS,
  ETHERNET_PORT_OPTIONS,
  ETHERNET_SCHEMA,
  getEthernetEntryDefaults,
  LLDP_ADMIN_STATUS_OPTIONS,
  POE_DETECTION_OPTIONS,
  POE_PRIORITY_OPTIONS,
  VOICE_VLAN_DETECT_OPTIONS,
  VOICE_VLAN_MODE_OPTIONS,
} from './ethernetConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

type EthernetEntry = Record<string, any>;

type EthernetFormValues = {
  configuration: EthernetEntry[];
  [key: string]: any;
};

const LLDP_TLV_FIELDS = [
  { name: 'lldp-basic-tlv-mgmt-ip-v4', label: 'basic-tlv-mgmt-ip-v4' },
  { name: 'lldp-basic-tlv-mgmt-ip-v6', label: 'basic-tlv-mgmt-ip-v6' },
  { name: 'lldp-basic-tlv-port-descr', label: 'basic-tlv-port-descr' },
  { name: 'lldp-basic-tlv-sys-capab', label: 'basic-tlv-sys-capab' },
  { name: 'lldp-basic-tlv-sys-descr', label: 'basic-tlv-sys-descr' },
  { name: 'lldp-basic-tlv-sys-name', label: 'basic-tlv-sys-name' },
  { name: 'lldp-dot1-tlv-proto-ident', label: 'dot1-tlv-proto-ident' },
  { name: 'lldp-dot1-tlv-proto-vid', label: 'dot1-tlv-proto-vid' },
  { name: 'lldp-dot1-tlv-pvid', label: 'dot1-tlv-pvid' },
  { name: 'lldp-dot1-tlv-vlan-name', label: 'dot1-tlv-vlan-name' },
  { name: 'lldp-dot3-tlv-link-agg', label: 'dot3-tlv-link-agg' },
  { name: 'lldp-dot3-tlv-mac-phy', label: 'dot3-tlv-mac-phy' },
  { name: 'lldp-dot3-tlv-max-frame', label: 'dot3-tlv-max-frame' },
  { name: 'lldp-dot3-tlv-poe', label: 'dot3-tlv-poe' },
  { name: 'lldp-med-tlv-ext-poe', label: 'med-tlv-ext-poe' },
  { name: 'lldp-med-tlv-inventory', label: 'med-tlv-inventory' },
  { name: 'lldp-med-tlv-location', label: 'med-tlv-location' },
  { name: 'lldp-med-tlv-med-cap', label: 'med-tlv-med-cap' },
  { name: 'lldp-med-tlv-network-policy', label: 'med-tlv-network-policy' },
  { name: 'lldp-notification', label: 'notification' },
  { name: 'lldp-med-notification', label: 'med-notification' },
];

const PORT_LABELS = new Map(ETHERNET_PORT_OPTIONS.map((opt) => [opt.value, opt.label]));

const LldpTlvSelector = ({ prefix, isDisabled }: { prefix: string; isDisabled: boolean }) => {
  const { values, setFieldValue } = useFormikContext<EthernetFormValues>();
  const base = `${prefix}.lldp-interface-config`;
  const current = getIn(values, base) ?? {};
  const selected = useMemo(
    () => LLDP_TLV_FIELDS.filter((field) => current?.[field.name]).map((field) => field.name),
    [current],
  );

  const onChange = useCallback(
    (items: readonly { value: string | number; label: string }[]) => {
      const selectedSet = new Set(items.map((item) => item.value));
      LLDP_TLV_FIELDS.forEach((field) => {
        setFieldValue(`${base}.${field.name}`, selectedSet.has(field.name));
      });
    },
    [base, setFieldValue],
  );

  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        tlvs
      </FormLabel>
      <ChakraSelect
        isMulti
        closeMenuOnSelect={false}
        options={LLDP_TLV_FIELDS.map((field) => ({ label: field.label, value: field.name }))}
        value={selected.map((val) => ({ label: val, value: val }))}
        onChange={(items) => onChange(items as readonly { value: string | number; label: string }[])}
        isDisabled={isDisabled}
        chakraStyles={{
          control: (provided) => ({
            ...provided,
            borderRadius: '15px',
            border: '2px solid',
          }),
          valueContainer: (provided) => ({
            ...provided,
            flexWrap: 'wrap',
          }),
          multiValue: (provided) => ({
            ...provided,
            flex: '0 0 calc(50% - 8px)',
            maxWidth: 'calc(50% - 8px)',
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
          }),
          menuList: (provided) => ({
            ...provided,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            columnGap: '12px',
            rowGap: '6px',
          }),
          option: (provided) => ({
            ...provided,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }),
        }}
      />
    </FormControl>
  );
};

const EthernetEntryFields = ({
  prefix,
  editing,
}: {
  prefix: string;
  editing: boolean;
}) => {
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<EthernetFormValues>();
  const entry = getIn(values, prefix) ?? {};
  const selectPortsError = getIn(errors, `${prefix}.select-ports`);
  const selectPortsTouched = getIn(touched, `${prefix}.select-ports`);
  const hasLldp = entry['lldp-interface-config'] !== undefined;
  const hasStormControl = entry['storm-control'] !== undefined;
  const hasVoiceVlan = entry['voice-vlan-intf-config'] !== undefined;
  const isBpduGuardEnabled = entry?.['bpdu-guard'] !== undefined;
  const isDhcpSnoopEnabled = entry?.['dhcp-snoop-port'] !== undefined;
  const isPoeEnabled = entry?.poe !== undefined;
  const isEdgePortEnabled = entry?.['edge-port'] === true;

  const toggleLldp = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${prefix}.lldp-interface-config`, e.target.checked ? DEFAULT_LLDP : undefined);
    },
    [prefix, setFieldValue],
  );

  const toggleStormControl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${prefix}.storm-control`, e.target.checked ? DEFAULT_STORM_CONTROL : undefined);
    },
    [prefix, setFieldValue],
  );

  const toggleBpduGuard = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${prefix}.bpdu-guard`, e.target.checked ? DEFAULT_BPDU_GUARD : undefined);
    },
    [prefix, setFieldValue],
  );

  const toggleDhcpSnoop = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${prefix}.dhcp-snoop-port`, e.target.checked ? DEFAULT_DHCP_SNOOP_PORT : undefined);
    },
    [prefix, setFieldValue],
  );

  const toggleVoiceVlan = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${prefix}.voice-vlan-intf-config`, e.target.checked ? DEFAULT_VOICE_VLAN : undefined);
    },
    [prefix, setFieldValue],
  );

  const togglePoe = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${prefix}.poe`, e.target.checked ? DEFAULT_POE : undefined);
    },
    [prefix, setFieldValue],
  );

  return (
    <VStack spacing={6} align="stretch" w="100%">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="16px" mt={2} w="100%">
        <Box minW="260px" w="100%">
          <FormControl isRequired isInvalid={Boolean(selectPortsTouched && selectPortsError)}>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              select-ports
            </FormLabel>
            <ChakraSelect
              isMulti
              closeMenuOnSelect={false}
              options={ETHERNET_PORT_OPTIONS}
              value={(entry?.['select-ports'] ?? []).map((val: string) => ({
                label: PORT_LABELS.get(val) ?? val,
                value: val,
              }))}
              onChange={(items) => {
                setFieldValue(
                  `${prefix}.select-ports`,
                  (items as readonly { value: string | number }[]).map((item) => item.value),
                );
                setFieldTouched(`${prefix}.select-ports`, true, false);
              }}
              isDisabled={!editing}
              placeholder="Select..."
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: '15px',
                  border: '2px solid',
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  alignItems: 'center',
                }),
                multiValue: (provided) => ({
                  ...provided,
                  flex: '0 0 calc(33.333% - 8px)',
                  maxWidth: 'calc(33.333% - 8px)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  columnGap: '6px',
                  paddingInlineStart: '8px',
                  paddingInlineEnd: '6px',
                  minHeight: '28px',
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'gray.700',
                  fontSize: 'sm',
                  paddingInline: 0,
                  minWidth: 0,
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  position: 'static',
                  marginInlineStart: 0,
                }),
              }}
            />
            <FormErrorMessage>{selectPortsError}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box minW="260px" w="100%">
          <FormControl>
            <HStack spacing={2} align="center">
              <FormLabel ms="4px" fontSize="md" fontWeight="normal" mb="0" w="auto">
                lldp-interface-config
              </FormLabel>
              <Switch isChecked={hasLldp} onChange={toggleLldp} isDisabled={!editing} />
            </HStack>
          </FormControl>
          {hasLldp && (
            <Box mt={4}>
              <SelectField
                name={`${prefix}.lldp-interface-config.lldp-admin-status`}
                label="lldp-admin-status"
                options={LLDP_ADMIN_STATUS_OPTIONS}
                isDisabled={!editing}
                isRequired
              />
              <Box mt={4}>
                <LldpTlvSelector prefix={prefix} isDisabled={!editing} />
              </Box>
            </Box>
          )}
        </Box>
      </Grid>

      <Box w="100%">
        <SimpleGrid minChildWidth="220px" spacing="16px" w="100%">
          <NumberField name={`${prefix}.speed`} label="speed" isDisabled={!editing} isRequired />
          <SelectField
            name={`${prefix}.duplex`}
            label="duplex"
            options={DUPLEX_OPTIONS}
            isDisabled={!editing}
            isRequired
          />
          <FormControl>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal" mb="0">
              edge-port
            </FormLabel>
            <Switch
              isChecked={isEdgePortEnabled}
              onChange={(e) => setFieldValue(`${prefix}.edge-port`, e.target.checked ? true : undefined)}
              isDisabled={!editing}
            />
          </FormControl>
          <ToggleField name={`${prefix}.enabled`} label="enabled" isDisabled={!editing} />
        </SimpleGrid>
      </Box>

      <VStack spacing={4} align="stretch">
        <Box>
          <FormControl>
            <HStack spacing={2} align="center">
              <FormLabel mb="0" fontWeight="bold" w="auto">
                bpdu guard
              </FormLabel>
              <Switch isChecked={isBpduGuardEnabled} onChange={toggleBpduGuard} isDisabled={!editing} />
            </HStack>
          </FormControl>
          {isBpduGuardEnabled && (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="16px" mt={4} w="100%">
              <ToggleField name={`${prefix}.bpdu-guard.enabled`} label="enable" isDisabled={!editing} />
              <NumberField
                name={`${prefix}.bpdu-guard.auto-recovery-intvl-secs`}
                label="interval"
                isDisabled={!editing}
                isRequired
              />
            </SimpleGrid>
          )}
        </Box>

        <Box>
          <FormControl>
            <HStack spacing={2} align="center">
              <FormLabel mb="0" fontWeight="bold" w="auto">
                dhcp snoop port
              </FormLabel>
              <Switch isChecked={isDhcpSnoopEnabled} onChange={toggleDhcpSnoop} isDisabled={!editing} />
            </HStack>
          </FormControl>
          {isDhcpSnoopEnabled && (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="16px" mt={4} w="100%">
              <ToggleField
                name={`${prefix}.dhcp-snoop-port.dhcp-snoop-port-trust`}
                label="dhcp-snoop-port-trust"
                isDisabled={!editing}
              />
            </SimpleGrid>
          )}
        </Box>

        <Box>
          <FormControl>
            <HStack spacing={2} align="center">
              <FormLabel mb="0" fontWeight="bold" w="auto">
                storm control
              </FormLabel>
              <Switch isChecked={hasStormControl} onChange={toggleStormControl} isDisabled={!editing} />
            </HStack>
          </FormControl>
          {hasStormControl && (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="16px" mt={4} w="100%">
              <NumberField
                name={`${prefix}.storm-control.broadcast-pps`}
                label="broadcast-pps"
                isDisabled={!editing}
                isRequired
              />
              <NumberField
                name={`${prefix}.storm-control.multicast-pps`}
                label="multicast-pps"
                isDisabled={!editing}
                isRequired
              />
              <NumberField
                name={`${prefix}.storm-control.unknown-unicast-pps`}
                label="unknown-unicast-pps"
                isDisabled={!editing}
                isRequired
              />
            </SimpleGrid>
          )}
        </Box>

        <Box>
          <FormControl>
            <HStack spacing={2} align="center">
              <FormLabel mb="0" fontWeight="bold" w="auto">
                poe
              </FormLabel>
              <Switch isChecked={isPoeEnabled} onChange={togglePoe} isDisabled={!editing} />
            </HStack>
          </FormControl>
          {isPoeEnabled && (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="16px" mt={4} w="100%">
              <ToggleField name={`${prefix}.poe.admin-mode`} label="admin-mode" isDisabled={!editing} />
              <SelectField
                name={`${prefix}.poe.detection`}
                label="detection"
                options={POE_DETECTION_OPTIONS}
                isDisabled={!editing}
                isRequired
              />
              <NumberField name={`${prefix}.poe.power-limit`} label="power-limit" isDisabled={!editing} isRequired />
              <SelectField
                name={`${prefix}.poe.priority`}
                label="priority"
                options={POE_PRIORITY_OPTIONS}
                isDisabled={!editing}
                isRequired
              />
              <ToggleField name={`${prefix}.poe.do-reset`} label="do-reset" isDisabled={!editing} />
            </SimpleGrid>
          )}
        </Box>

        <Box>
          <FormControl>
            <HStack spacing={2} align="center">
              <FormLabel mb="0" fontWeight="bold" w="auto">
                voice vlan
              </FormLabel>
              <Switch isChecked={hasVoiceVlan} onChange={toggleVoiceVlan} isDisabled={!editing} />
            </HStack>
          </FormControl>
          {hasVoiceVlan && (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="16px" mt={4} w="100%">
              <SelectField
                name={`${prefix}.voice-vlan-intf-config.voice-vlan-intf-mode`}
                label="mode"
                options={VOICE_VLAN_MODE_OPTIONS}
                isDisabled={!editing}
                isRequired
              />
              <NumberField
                name={`${prefix}.voice-vlan-intf-config.voice-vlan-intf-priority`}
                label="priority"
                isDisabled={!editing}
                isRequired
              />
              <SelectField
                name={`${prefix}.voice-vlan-intf-config.voice-vlan-intf-detect-voice`}
                label="detect-voice"
                options={VOICE_VLAN_DETECT_OPTIONS}
                isDisabled={!editing}
                isRequired
              />
              <ToggleField
                name={`${prefix}.voice-vlan-intf-config.voice-vlan-intf-security`}
                label="security"
                isDisabled={!editing}
              />
            </SimpleGrid>
          )}
        </Box>
      </VStack>

    </VStack>
  );
};

const EthernetSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const [tabIndex, setTabIndex] = useState(0);
  const removeEthernetSection = () => removeSub('ethernet');

  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `ethernet.${k}`, error });
        }

        const newSection = {
          data: { configuration: node.values.configuration },
          isDirty: node.dirty,
          invalidValues,
        };

        if (!isEqual(sectionInformation, newSection)) {
          setSection(newSection);
        }
      }
    },
    [sectionInformation],
  );

  useEffect(() => {
    if (!editing) setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={{
        name: 'Ethernet',
        ...(sectionInformation.data?.configuration ?? ETHERNET_SCHEMA(t).cast({})),
      }}
      validationSchema={ETHERNET_SCHEMA(t)}
      onSubmit={() => undefined}
    >
      {({ values }) => {
        const entries = values.configuration ?? [];
        return (
        <>
          <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
          <VStack spacing={4} w="100%">
            <SectionGeneralCard
              editing={editing}
              buttons={<DeleteButton onClick={removeEthernetSection} isDisabled={!editing} />}
            />
            <FieldArray name="configuration">
              {(arrayHelpers) => {
                const addEthernet = () => {
                  arrayHelpers.push(getEthernetEntryDefaults(t));
                  setTabIndex(entries.length);
                };

                const removeEthernet = (index: number) => {
                  arrayHelpers.remove(index);
                  if (index > 0) setTabIndex(0);
                };

                if (entries.length === 0) {
                  return (
                    <Center>
                      <CreateButton
                        label="Add Rule"
                        onClick={addEthernet}
                        isCompact={false}
                        hidden={!editing}
                        size="lg"
                        borderRadius={0}
                      />
                    </Center>
                  );
                }

                return (
                  <Card variant="widget" w="100%">
                    <CardBody overflowX="hidden">
                      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" isLazy w="100%">
                        <Box overflowX="auto" overflowY="auto" pt={1} h={{ base: '80px', md: '56px' }}>
                          <TabList mt={0} flexWrap={{ base: editing ? 'wrap' : 'nowrap', md: 'nowrap' }}>
                            {entries.map((_, index) => (
                              <Tab key={`ethernet-tab-${index}`}>Rule {index + 1}</Tab>
                            ))}
                            <CreateButton
                              label="Add Rule"
                              onClick={addEthernet}
                              hidden={!editing}
                              size="lg"
                              borderRadius={0}
                            />
                          </TabList>
                        </Box>
                        <TabPanels>
                          {entries.map((_, index) => (
                            <TabPanel key={`ethernet-panel-${index}`} p={{ base: 0, md: 4 }}>
                              <Flex align="center" mb={4}>
                                <Box fontWeight="bold">Rule {index + 1}</Box>
                                <Spacer />
                                <DeleteButton onClick={() => removeEthernet(index)} isDisabled={!editing} />
                              </Flex>
                              <EthernetEntryFields prefix={`configuration[${index}]`} editing={editing} />
                            </TabPanel>
                          ))}
                        </TabPanels>
                      </Tabs>
                    </CardBody>
                  </Card>
                );
              }}
            </FieldArray>
          </VStack>
        </>
        );
      }}
    </Formik>
  );
};

EthernetSection.propTypes = propTypes;
export default React.memo(EthernetSection, isEqual);
