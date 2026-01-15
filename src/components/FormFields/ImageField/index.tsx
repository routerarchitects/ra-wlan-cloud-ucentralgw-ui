/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import ImageFieldInput from './Input';
import { useFastField } from 'hooks/useFastField';

type Props = {
  name: string;
  typeName: string;
  heightName: string;
  widthName: string;
  label?: string;
  isDisabled?: boolean;
  displayImage?: boolean;
  isRequired?: boolean;
  emptyIsUndefined?: boolean;
  isHidden?: boolean;
  definitionKey?: string;
  hideLabel?: boolean;
};
const ImageField = (props: Props) => {
  const image = useFastField<string | undefined>({
    name: props.name,
  });
  const imageType = useFastField<string | undefined>({
    name: props.typeName,
  });
  const height = useFastField<number | undefined>({
    name: props.heightName,
  });
  const width = useFastField<string | undefined>({
    name: props.widthName,
  });

  const onChange = (value: string) => {
    image.onChange(value);
  };
  const onTypeChange = (fileType: string) => {
    if (props.typeName) {
      imageType.onChange(fileType);
    }
  };

  return (
    <ImageFieldInput
      {...props}
      value={image.value}
      onChange={onChange}
      onTypeChange={onTypeChange}
      typeValue={imageType.value}
      height={height.value}
      width={width.value}
    />
  );
};

export default React.memo(ImageField);
