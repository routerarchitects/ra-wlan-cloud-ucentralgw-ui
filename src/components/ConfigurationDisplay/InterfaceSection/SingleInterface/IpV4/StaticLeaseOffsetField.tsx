import * as React from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NumberField } from 'components/Form/Fields/NumberField';
import { testIpv4 } from '../../../utils/formTests';
import { useFastField } from 'hooks/useFastField';

type Props = {
  subnet?: string;
  isDisabled?: boolean;
};

const StaticLeaseOffsetField = ({ subnet, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { onChange: onOffsetChange } = useFastField<number>({ name: 'static-lease-offset' });
  const { value, onChange, onBlur } = useFastField<string>({ name: '__temp_ip' });

  const isSubnetValid = testIpv4(subnet);
  const onIpChange = (v: string) => {
    onChange(v);

    if (testIpv4(v)) {
      const ipEnding = v.split('.').pop()?.split('/')[0];
      const newOffset = Number(ipEnding) - Number(subnet?.split('.').pop()?.split('/')[0]);

      if (newOffset > 0) {
        onOffsetChange(newOffset);
      } else {
        onOffsetChange(-newOffset);
      }
    }
  };

  React.useEffect(() => {
    if (!value && subnet && isSubnetValid) {
      onIpChange(`${subnet?.split('.').slice(0, 3).join('.')}.${Number(subnet.split('.').pop()?.split('/')[0]) + 1}`);
    }
  }, [value]);

  if (!subnet || !isSubnetValid) {
    return (
      <NumberField
        name="static-lease-offset"
        label="dhcp-lease.static-lease-offset"
        definitionKey="interface.ipv4.dhcp-lease.static-lease-offset"
        isDisabled={isDisabled}
        isRequired
        w="200px"
      />
    );
  }

  const currOffset = value
    ? Number(value.split('.').pop()?.split('/')[0]) - Number(subnet.split('.').pop()?.split('/')[0])
    : NaN;
  const isIpValid = testIpv4(value);

  return (
    <FormControl isRequired isDisabled={isDisabled} isInvalid={!testIpv4(value) || currOffset <= 0}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        IP Address
      </FormLabel>
      <Input
        value={value}
        onChange={(e) => onIpChange(e.target.value)}
        onBlur={onBlur}
        borderRadius="15px"
        fontSize="sm"
        autoComplete="off"
        border="2px solid"
        _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        w="160px"
      />
      <FormErrorMessage>
        {isIpValid && currOffset <= 0
          ? `Offset${Number.isNaN(currOffset) ? '' : ` (${currOffset})`} with subnet needs to be bigger than 0`
          : t('form.invalid_ipv4')}
      </FormErrorMessage>
    </FormControl>
  );
};

export default React.memo(StaticLeaseOffsetField);
