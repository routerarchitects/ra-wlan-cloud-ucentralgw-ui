import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { UploadSimple } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import ImportConfigurationModal from './ImportConfigurationModal';

interface Props {
  setConfig: (v: any) => void;
  isDisabled: boolean;
}

const ImportConfigurationButton = ({ setConfig, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label={t('configurations.import_file')}>
        <IconButton
          aria-label={t('configurations.import_file')}
          ml={2}
          colorScheme="blue"
          onClick={onOpen}
          icon={<UploadSimple size={20} />}
          isDisabled={isDisabled}
        />
      </Tooltip>
      <ImportConfigurationModal isOpen={isOpen} onClose={onClose} setValue={setConfig} />
    </>
  );
};

export default React.memo(ImportConfigurationButton);
