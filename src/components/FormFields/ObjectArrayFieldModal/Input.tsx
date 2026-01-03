import React, { useCallback, useEffect, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Button,
  Box,
  Tooltip,
  IconButton,
  CloseButton,
} from '@chakra-ui/react';
import { Trash } from '@phosphor-icons/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { SaveButton } from 'components/Buttons/SaveButton';
import { DataTable } from 'components/DataTables/DataTable';
import { Column } from 'models/Table';

interface ObjectArrayFieldModalOptions {
  buttonLabel?: string;
  modalTitle?: string;
  onFormSubmit?: (value: any) => object;
}

interface ObjectArrayFieldInputProps {
  name: string;
  label: string;
  value?: object[];
  onChange: (e: unknown[]) => void;
  isError: boolean;
  error?: string | boolean;
  isRequired?: boolean;
  isHidden?: boolean;
  isDisabled?: boolean;
  hideLabel?: boolean;
  fields: React.ReactNode;
  columns: Column<object[]>[];
  options: ObjectArrayFieldModalOptions;
  schema: (t: (e: string) => string, useDefault?: boolean) => object;
  onBlur?: () => void;
  definitionKey?: string;
}

const ObjectArrayFieldInput: React.FC<ObjectArrayFieldInputProps> = ({
  name,
  label,
  value,
  onChange,
  isError,
  error,
  fields,
  isRequired = false,
  isHidden = false,
  schema,
  columns,
  isDisabled = false,
  hideLabel = false,
  options,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempValue, setTempValue] = useState<object[]>([]);
  const variableName = name.split('.')[name.split('.').length - 1];

  const removeObj = (index: number) => {
    const newArr = [...tempValue];
    newArr.splice(index, 1);
    setTempValue(newArr);
  };

  const onSave = () => {
    onChange(tempValue);
    onClose();
  };

  const removeAction = useCallback(
    (cell: { row: { index: number } }) => (
      <Tooltip hasArrow label={t('common.remove')} placement="top">
        <IconButton
          aria-label="Remove Object"
          ml={2}
          colorScheme="red"
          icon={<Trash size={20} />}
          size="sm"
          onClick={() => removeObj(cell.row.index)}
        />
      </Tooltip>
    ),
    [tempValue],
  );

  const computedButtonLabel = () => {
    if (options?.buttonLabel) return options.buttonLabel;

    return `${t('common.manage')} ${variableName} (${value?.length ?? 0}
            ${t('common.entries', { count: value?.length ?? 0 }).toLowerCase()})`;
  };

  useEffect(() => {
    if (!isOpen) {
      setTempValue(value ?? []);
    }
  }, [value, isOpen]);

  return (
    <>
      <FormControl isInvalid={isError} isRequired={isRequired} isDisabled={isDisabled} hidden={isHidden}>
        <FormLabel hidden={hideLabel} ms="4px" fontSize="md" fontWeight="normal">
          {label}
        </FormLabel>
        <Text ml={1} fontSize="sm">
          <Button colorScheme="blue" onClick={onOpen}>
            {computedButtonLabel()}
          </Button>
        </Text>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader>
            {options.modalTitle ?? name}
            <SaveButton onClick={onSave} hidden={isDisabled} ml={4} />
            <CloseButton position="absolute" right={2} top={2} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            {!isDisabled && (
              <Formik
                // @ts-ignore
                initialValues={schema(t, true).cast()}
                validationSchema={schema(t)}
                validateOnMount
                onSubmit={(data, { setSubmitting, resetForm }) => {
                  setSubmitting(true);
                  if (!options.onFormSubmit) {
                    setTempValue([...tempValue, data]);
                  } else {
                    setTempValue([...tempValue, options.onFormSubmit(data)]);
                  }
                  resetForm();
                  setSubmitting(false);
                }}
              >
                {({ resetForm, isValid, dirty, submitForm }) => (
                  <>
                    {fields}
                    <Box textAlign="right" my={4}>
                      <Button colorScheme="blue" isDisabled={!isValid} onClick={submitForm}>
                        {t('crud.add')}
                      </Button>
                      <Button colorScheme="gray" isDisabled={!dirty} ml={2} onClick={() => resetForm()}>
                        {t('common.reset')}
                      </Button>
                    </Box>
                  </>
                )}
              </Formik>
            )}
            <DataTable
              columns={
                !isDisabled
                  ? [
                      ...columns,
                      {
                        id: 'actions',
                        Header: t('common.actions'),
                        Footer: '',
                        accessor: 'Id',
                        customWidth: '80px',
                        Cell: ({ cell }: any) => removeAction(cell),
                        disableSortBy: true,
                        alwaysShow: true,
                      },
                    ]
                  : columns
              }
              data={tempValue}
              minHeight="200px"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(ObjectArrayFieldInput);
