import { object, number, string } from 'yup';
import { testIpv4, testIpv6 } from '../utils/formTests';
import { TFunction } from 'i18next';

export const DEFAULT_GLOBALS = {
  name: 'Globals',
  description: '',
  weight: 0,
  configuration: {
    'ipv4-network': '',
    'ipv6-network': '',
  },
};

export const GLOBALS_SCHEMA = (t: TFunction) =>
  object().shape({
    name: string().required(t('form.required')).default('Globals'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      'ipv4-network': string()
        .required(t('form.required'))
        .test('test-ipv4-network', t('form.invalid_ipv4'), testIpv4)
        .default(''),
      'ipv6-network': string()
        .required(t('form.required'))
        .test('test-ipv6-network', t('form.invalid_ipv6'), testIpv6)
        .default(''),
    }),
  });
