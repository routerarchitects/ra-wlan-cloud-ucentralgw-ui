import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { CheckCircle, WarningOctagon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CloseButton } from 'components/Buttons/CloseButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  warnings: Record<string, any[]>;
  activeConfigurations: string[];
  isDisabled?: boolean;
}

const ViewConfigWarningsModal = ({ warnings, activeConfigurations, isDisabled = false }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const warningsAmount = activeConfigurations.reduce((sum, key) => sum + (warnings[key]?.length ?? 0), 0);

  return (
    <>
      <Tooltip
        label={`${warningsAmount} ${warningsAmount === 1 ? t('common.warning') : t('common.warnings')}`}
        hasArrow
        shouldWrapChildren
      >
        <IconButton
          aria-label="Warnings"
          colorScheme={warningsAmount === 0 ? 'green' : 'yellow'}
          type="button"
          onClick={onOpen}
          icon={warningsAmount === 0 ? <CheckCircle size={20} /> : <WarningOctagon size={20} />}
          isDisabled={isDisabled || warningsAmount === 0}
        />
      </Tooltip>
      <Modal 
          onClose={onClose} 
          isOpen={isOpen} 
          title={`${warningsAmount} ${warningsAmount === 1 ? t('common.warning') : t('common.warnings')}`}
          topRightButtons={<CloseButton ml={2} onClick={onClose} />}
      >
        <pre>
          {JSON.stringify(
            Object.fromEntries(activeConfigurations.map((key) => [key, warnings[key]])),
            null,
            2,
          )}
        </pre>
      </Modal>
    </>
  );
};

export default React.memo(ViewConfigWarningsModal);
