import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SimpleGrid, VStack } from '@chakra-ui/react';
import { Formik } from 'formik';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../../../common/components/InternalFormAccess';
import SectionGeneralCard from '../../../common/components/SectionGeneralCard';
import Nat from './Nat';
import { DEFAULT_NAT_CONFIGURATION, NAT_SCHEMA } from './natConstants';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { ConfigurationSection } from '../../../common/types';

interface Props {
  editing: boolean;
  setSection: (section: ConfigurationSection) => void;
  sectionInformation: ConfigurationSection;
  removeSub: (sub: string) => void;
  allSections?: Record<string, ConfigurationSection>;
}

const stripEmptyValues = (input: any): any => {
  if (Array.isArray(input)) {
    const cleaned = input.map(stripEmptyValues).filter((v) => v !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (input && typeof input === 'object') {
    const entries = Object.entries(input)
      .filter(([key]) => key !== 'description')
      .map(([k, v]) => [k, stripEmptyValues(v)] as const)
      .filter(([, v]) => v !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  if (input === '' || input === null || input === undefined) return undefined;
  return input;
};

const sanitizeRules = (rules: any[]) =>
  rules
    .map((rule) => stripEmptyValues(rule))
    .filter((rule) => rule && typeof rule === 'object' && Object.keys(rule).length > 0);

const NatSection = ({ editing, setSection, sectionInformation, removeSub, allSections }: Props) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());

  const initialConfiguration = useMemo(() => {
    const raw = sectionInformation.data?.configuration;

    // Handle legacy nested shape: { configuration: { name, description, weight, configuration: {...} } }
    if (raw?.configuration && (raw.configuration.snat || raw.configuration.dnat)) {
      return raw.configuration;
    }

    if (raw?.snat || raw?.dnat) return raw;

    return DEFAULT_NAT_CONFIGURATION;
  }, [sectionInformation.data]);

  const interfaceNameOptions = useMemo(() => {
    const interfaceEntries = allSections?.interfaces?.data?.configuration;
    if (!Array.isArray(interfaceEntries)) return [];

    const seen = new Set<string>();
    return interfaceEntries
      .map((entry: any) => entry?.name)
      .filter((name: unknown): name is string => typeof name === 'string' && name.trim() !== '')
      .filter((name: string) => {
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .map((name: string) => ({ label: name, value: name }));
  }, [allSections?.interfaces?.data?.configuration]);

  const sectionRef = useCallback(
    (node: any) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `nat.${k}`, error: error as string | object });
        }

        const snatRules = sanitizeRules(node.values?.configuration?.snat?.rules ?? []);
        const dnatRules = sanitizeRules(node.values?.configuration?.dnat?.rules ?? []);

        const configuration: any = {};
        if (snatRules.length > 0) configuration.snat = { rules: snatRules };
        if (dnatRules.length > 0) configuration.dnat = { rules: dnatRules };

        const newSection = {
          data: {
            ...node.values,
            configuration,
          },
          isDirty: node.dirty,
          invalidValues,
          warnings: [],
        };

        if (!isEqual(sectionInformation, newSection)) {
          setSection(newSection);
        }
      }
    },
    [sectionInformation, setSection],
  );

  const removeNat = () => removeSub('nat');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={{ ...sectionInformation.data, name: 'Nat', configuration: initialConfiguration }}
      validationSchema={NAT_SCHEMA(t)}
    >
      {({ values, setFieldValue }) => {
        const snatRules = values?.configuration?.snat?.rules ?? [];
        const dnatRules = values?.configuration?.dnat?.rules ?? [];
        const combinedRules = [
          ...snatRules.map((rule: any, index: number) => ({ mode: 'snat' as const, index, rule })),
          ...dnatRules.map((rule: any, index: number) => ({ mode: 'dnat' as const, index, rule })),
        ];

        const onRemoveRule = (mode: 'snat' | 'dnat', index: number) => {
          const currentRules = values?.configuration?.[mode]?.rules ?? [];
          setFieldValue(
            `configuration.${mode}.rules`,
            currentRules.filter((_: unknown, i: number) => i !== index),
          );
        };

        return (
          <>
            <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
            <VStack spacing={4}>
              <SectionGeneralCard editing={editing} buttons={<DeleteButton onClick={removeNat} isDisabled={!editing} />} />

              <SimpleGrid minChildWidth="400px" spacing={4} w="100%">
                <Nat
                  editing={editing}
                  rules={combinedRules}
                  onRemoveRule={onRemoveRule}
                  interfaceNameOptions={interfaceNameOptions}
                  hasSectionContext={Boolean(allSections)}
                />
              </SimpleGrid>
            </VStack>
          </>
        );
      }}
    </Formik>
  );
};

export default React.memo(NatSection, isEqual);
