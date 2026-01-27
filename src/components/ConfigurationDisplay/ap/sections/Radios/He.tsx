import React, { useEffect } from 'react';
import { NumberField } from 'components/Form/Fields/NumberField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { useFastField } from 'hooks/useFastField';

type Props = {
  namePrefix: string;
  isDisabled?: boolean;
};

const He = ({ namePrefix, isDisabled }: Props) => {
  const { value, onChange } = useFastField({ name: `${namePrefix}.he` });

  useEffect(() => {
    if (value && Object.keys(value).length === 0) {
      onChange(undefined);
    }
  }, [value]);

  return (
    <>
      <ToggleField
        name={`${namePrefix}.he.ema`}
        label="ema"
        definitionKey="radio.he.ema"
        isDisabled={isDisabled}
        falseIsUndefined
      />
      <NumberField
        name={`${namePrefix}.he.bss-color`}
        label="bss-color"
        definitionKey="radio.he.bss-color"
        isDisabled={isDisabled}
        w={24}
        acceptEmptyValue
      />
    </>
  );
};

export default React.memo(He);
