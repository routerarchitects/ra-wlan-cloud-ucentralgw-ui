import React, { useMemo } from 'react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useField } from 'formik';

interface Props {
  editing: boolean;
  subsections: string[];
  onSubsectionsChange: (subsections: string[]) => void;
}

const SubSectionPicker = ({ editing, subsections, onSubsectionsChange }: Props) => {
  const [{ value }, , { setTouched }] = useField<Record<string, any>>('configuration');
  
  const onChange = (option: readonly { value: string; label: string }[] | null) => {
    if (option) {
      onSubsectionsChange(option.map((val) => val.value));
    }
  };
  
  const activeSubsections = useMemo(
    () => subsections.map((sub) => ({ value: sub, label: sub })).filter((opt) => value[opt.value] !== undefined),
    [value, subsections],
  );
  
  const options = useMemo(() => subsections.map((sub) => ({ value: sub, label: sub })), [subsections]);

  return (
    <FormControl isDisabled={!editing}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        Subsections
      </FormLabel>
      <Select
        chakraStyles={{
          control: (provided) => ({
            ...provided,
            borderRadius: '15px',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            backgroundColor: 'unset',
            border: 'unset',
          }),
        }}
        isMulti
        closeMenuOnSelect={false}
        options={options}
        value={activeSubsections}
        onChange={onChange}
        onBlur={() => setTouched('configuration')}
      />
    </FormControl>
  );
};

export default React.memo(SubSectionPicker);
