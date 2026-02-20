import React, { useRef, useState } from 'react';
import { FormControl, FormLabel, Modal, ModalBody, ModalContent, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { DNAT_RULE_SCHEMA, NAT_RULE_SCHEMA } from './natConstants';
import { CloseButton } from 'components/Buttons/CloseButton';
import { CreateButton } from 'components/Buttons/CreateButton';
import { SaveButton } from 'components/Buttons/SaveButton';
import { ModalHeader } from 'components/Modals/GenericModal/ModalHeader';

interface Props {
  editing: boolean;
  setTabIndex: (index: number) => void;
}

const nextRuleId = (rules: any[] = []) => {
  const maxExisting = rules.reduce((max, rule) => {
    const id = Number(rule?.['rule-id']);
    return Number.isFinite(id) ? Math.max(max, id) : max;
  }, 0);

  return maxExisting + 1;
};

const CreateRuleButton = ({ editing, setTabIndex }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { values, setFieldValue } = useFormikContext<any>();
  const defaultType = 'snat';
  const [selectedType, setSelectedType] = useState<'snat' | 'dnat'>(defaultType);
  const selectedTypeRef = useRef<'snat' | 'dnat'>(defaultType);

  const addRule = (type: 'snat' | 'dnat') => {
    const normalizedType = type === 'dnat' ? 'dnat' : 'snat';
    const existingRules = values?.configuration?.[normalizedType]?.rules ?? [];
    const ruleId = nextRuleId(existingRules);
    const snatLength = values?.configuration?.snat?.rules?.length ?? 0;

    const newRule =
      normalizedType === 'dnat'
        ? DNAT_RULE_SCHEMA(t, true).cast({
            'rule-id': ruleId,
            'in-interface': { name: '' },
            source: { address: '' },
            translation: { address: '' },
          })
        : NAT_RULE_SCHEMA(t, true).cast({
            'rule-id': ruleId,
            'out-interface': { name: '' },
            source: { address: '' },
            translation: { address: '' },
          });

    setFieldValue(`configuration.${normalizedType}.rules`, [...existingRules, newRule]);

    const visibleIndex = normalizedType === 'snat' ? existingRules.length : snatLength + existingRules.length;
    setTabIndex(visibleIndex);
    onClose();
  };

  return (
    <>
      <CreateButton
        label="Add Rule"
        onClick={() => {
          setSelectedType(defaultType);
          selectedTypeRef.current = defaultType;
          onOpen();
        }}
        isCompact={(values?.configuration?.snat?.rules?.length ?? 0) + (values?.configuration?.dnat?.rules?.length ?? 0) !== 0}
        hidden={!editing}
        size="lg"
        borderRadius={0}
      />
      <Modal onClose={onClose} isOpen={isOpen} size="sm" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            title="Add Rule"
            right={
              <>
                <SaveButton onClick={() => addRule(selectedTypeRef.current)} isDisabled={!selectedType} />
                <CloseButton ml={2} onClick={onClose} />
              </>
            }
          />
          <ModalBody>
            <FormControl isRequired mb={2}>
              <FormLabel>type</FormLabel>
              <Select
                value={selectedType}
                onChange={(e) => {
                  const next = e.target.value === 'dnat' ? 'dnat' : 'snat';
                  setSelectedType(next);
                  selectedTypeRef.current = next;
                }}
              >
                <option value="snat">SNAT</option>
                <option value="dnat">DNAT</option>
              </Select>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(CreateRuleButton, isEqual);
