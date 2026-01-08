/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import { Box, FormControl, FormLabel, Image, Input } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

type Props = {
  name: string;
  height?: number;
  width?: number;
  typeName: string;
  typeValue: string;
  label?: string;
  isDisabled?: boolean;
  displayImage?: boolean;
  isRequired?: boolean;
  emptyIsUndefined?: boolean;
  isHidden?: boolean;
  definitionKey?: string;
  hideLabel?: boolean;
  value?: string;
  onChange: (value: string) => void;
  onTypeChange: (fileType: string) => void;
};
const ImageFieldInput = (props: Props) => {
  const [fileKey, setFileKey] = React.useState(uuid());

  let fileReader: FileReader | undefined;

  const handleStringFileRead = () => {
    if (fileReader) {
      const content = fileReader.result;
      if (content && typeof content === 'string') {
        const split = content.split('base64,');
        if (split[1]) {
          props.onChange(split[1] as string);
        }
      }
    }
  };

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      props.onTypeChange(file.type);
      fileReader = new FileReader();
      fileReader.onloadend = handleStringFileRead;
      fileReader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (props.value === '') setFileKey(uuid());
  }, [props.value]);

  return (
    <>
      <Box mb={2}>
        <FormControl hidden={props.isHidden} isDisabled={props.isDisabled} w="50%">
          <FormLabel>{props.label ?? props.name}</FormLabel>
          <Input borderRadius="15px" pt={1} fontSize="sm" type="file" onChange={changeFile} key={fileKey} />
        </FormControl>
      </Box>
      <Box mb={2}>
        {props.value && (
          <Image
            height={props.height !== undefined ? `${props.height}px` : 200}
            width={props.width !== undefined ? `${props.width}px` : 200}
            ml="auto"
            mr="auto"
            src={`data:${props.typeValue ?? 'image/png'};base64,${props.value}`}
            alt="New Image"
          />
        )}
      </Box>
    </>
  );
};

export default React.memo(ImageFieldInput);
