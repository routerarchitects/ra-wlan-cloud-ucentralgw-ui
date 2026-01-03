import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { CheckCircle, WarningOctagon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CloseButton } from 'components/Buttons/CloseButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  errors: Record<string, any[]>;
  activeConfigurations: string[];
  isDisabled?: boolean;
}

const ViewConfigErrorsModal = ({ errors, activeConfigurations, isDisabled = false }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const errorAmount =
    (errors.globals?.length ?? 0) +
    (errors.unit?.length ?? 0) +
    (errors.metrics?.length ?? 0) +
    (errors.services?.length ?? 0) +
    (errors.radios?.length ?? 0) +
    (errors.interfaces?.length ?? 0) +
    (errors['third-party']?.length ?? 0);

  return (
    <>
      <Tooltip
        label={`${errorAmount} ${errorAmount === 1 ? t('common.error') : t('common.errors')}`}
        hasArrow
        shouldWrapChildren
      >
        <IconButton
          aria-label="Errors"
          colorScheme={errorAmount === 0 ? 'green' : 'red'}
          type="button"
          onClick={onOpen}
          ml={2}
          icon={errorAmount === 0 ? <CheckCircle size={20} /> : <WarningOctagon size={20} />}
          isDisabled={isDisabled || errorAmount === 0}
        />
      </Tooltip>
      <Modal 
          onClose={onClose} 
          isOpen={isOpen} 
          title={`${errorAmount} ${errorAmount === 1 ? t('common.error') : t('common.errors')}`}
          topRightButtons={<CloseButton ml={2} onClick={onClose} />}
      >
        <pre>
          {JSON.stringify(
            {
              globals: activeConfigurations.includes('globals') ? errors.globals : undefined,
              unit: activeConfigurations.includes('unit') ? errors.unit : undefined,
              metrics: activeConfigurations.includes('metrics') ? errors.metrics : undefined,
              services: activeConfigurations.includes('services') ? errors.services : undefined,
              radios: activeConfigurations.includes('radios') ? errors.radios : undefined,
              interfaces: activeConfigurations.includes('interfaces') ? errors.interfaces : undefined,
              'third-party': activeConfigurations.includes('third-party') ? errors['third-party'] : undefined,
            },
            null,
            2,
          )}
        </pre>
      </Modal>
    </>
  );
};

export default React.memo(ViewConfigErrorsModal);
