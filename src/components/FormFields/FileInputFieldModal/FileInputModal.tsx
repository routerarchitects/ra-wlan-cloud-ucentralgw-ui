import React, { useEffect, useState } from 'react';
import {
  Box,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { UploadSimple } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { ConfigurationFieldExplanation } from 'components/Form/ConfigurationFieldExplanation';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { FileInputButton } from 'components/Buttons/FileInputButton';
import { SaveButton } from 'components/Buttons/SaveButton';

interface FileInputModalProps {
  value?: string;
  fileNameValue?: string;
  explanation: string;
  onChange: (value: string, filename: string) => void;
  test?: (value: string) => boolean;
  label: string;
  acceptedFileTypes: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isHidden?: boolean;
  error?: string | boolean;
  touched?: boolean;
  definitionKey?: string;
  canDelete: boolean;
  onDelete: () => void;
  wantBase64?: boolean;
}

const FileInputModal: React.FC<FileInputModalProps> = ({
  value = '',
  fileNameValue = '',
  label,
  acceptedFileTypes,
  explanation,
  onChange,
  test = () => true,
  error = false,
  touched = false,
  isRequired = false,
  isDisabled = false,
  isHidden = false,
  definitionKey,
  canDelete,
  onDelete,
  wantBase64 = false,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempValue, setTempValue] = useState('');
  const [tempFilename, setTempFilename] = useState('');
  const [refreshId, setRefreshId] = useState('');

  const textExplanation = () => {
    if (value === '') return t('form.not_uploaded_yet');
    if (fileNameValue === '') return t('form.value_recorded_no_filename');
    return t('form.using_file', { filename: fileNameValue });
  };

  const saveValue = () => {
    onChange(tempValue, tempFilename);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setRefreshId(uuid());
      setTempValue('');
      setTempFilename('');
    }
  }, [isOpen]);

  return (
    <>
      <FormControl isInvalid={!!error && touched} isRequired={isRequired} isDisabled={isDisabled} hidden={isHidden}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          {label}
          <ConfigurationFieldExplanation definitionKey={definitionKey} />
        </FormLabel>
        <Text ml={1} fontSize="sm">
          {textExplanation()}
          <Tooltip label={t('common.use_file')}>
            <IconButton
              aria-label="Upload file"
              colorScheme="blue"
              onClick={onOpen}
              icon={<UploadSimple size={20} />}
              isDisabled={isDisabled}
              mx={2}
            />
          </Tooltip>
          {value !== undefined && canDelete && <DeleteButton onClick={onDelete} isCompact />}
        </Text>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader>
            {label}
            <SaveButton onClick={saveValue} isDisabled={tempValue.length === 0 || !test(tempValue)} ml={4} />
            <CloseButton position="absolute" right={2} top={2} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <Heading size="sm">{explanation}</Heading>
            <Box w={72} mt={2}>
              <FileInputButton
                value={value}
                setValue={setTempValue}
                setFileName={setTempFilename}
                refreshId={refreshId}
                accept={acceptedFileTypes}
                isStringFile={!wantBase64}
                wantBase64={wantBase64}
              />
            </Box>
            <FormControl isInvalid={tempValue !== '' && !test(tempValue)}>
              <Textarea isDisabled defaultValue={tempValue} mt={2} />
              <FormErrorMessage mt={2}>{t('form.invalid_file_content')}</FormErrorMessage>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(FileInputModal);
