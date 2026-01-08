import React, { useCallback } from 'react';
import { useField } from 'formik';
import FileInputModal from './FileInputModal';

interface FileInputFieldModalProps {
  name: string;
  fileName: string;
  explanation: string;
  test?: (value: string) => boolean;
  label: string;
  acceptedFileTypes: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isHidden?: boolean;
  definitionKey?: string | null;
  canDelete?: boolean;
  wantBase64?: boolean;
}

const FileInputFieldModal: React.FC<FileInputFieldModalProps> = ({
  name,
  fileName,
  explanation,
  test = () => true,
  acceptedFileTypes,
  isDisabled = false,
  label,
  isRequired = false,
  isHidden = false,
  definitionKey = null,
  canDelete = false,
  wantBase64 = false,
}) => {
  const [{ value }, { touched, error }, { setValue }] = useField<string>(name);
  const [{ value: fileNameValue }, , { setValue: setFile }] = useField<string>(fileName);

  const onDelete = useCallback(() => {
    setValue(undefined as any);
    setFile(undefined as any);
  }, [setValue, setFile]);

  const onChange = useCallback(
    (newValue: string, newFilename: string) => {
      setValue(newValue);
      setFile(newFilename);
    },
    [setValue, setFile],
  );

  return (
    <FileInputModal
      value={value}
      fileNameValue={fileNameValue}
      label={label}
      acceptedFileTypes={acceptedFileTypes}
      explanation={explanation}
      onChange={onChange}
      test={test}
      error={error}
      touched={touched}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isHidden={isHidden}
      definitionKey={definitionKey}
      canDelete={canDelete}
      onDelete={onDelete}
      wantBase64={wantBase64}
    />
  );
};

export default React.memo(FileInputFieldModal);
