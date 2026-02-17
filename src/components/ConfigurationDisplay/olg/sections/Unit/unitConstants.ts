import { bool, object, number, string } from 'yup';
import { testFqdnHostname } from '../../../common/utils/formTests';
import { TFunction } from 'i18next';

export const DEFAULT_UNIT = {
  name: 'Unit',
  description: '',
  weight: 0,
  configuration: {
    name: '',
    location: '',
    'leds-active': true,
    'random-password': false,
  },
};

export const UNIT_BEACON_ADVERTISEMENT_SCHEMA = (t: TFunction) =>
  object().shape({
    'device-name': string().required(t('form.required')).default(''),
    'device-serial': string().required(t('form.required')).default(''),
    'network-id': number().required(t('form.required')).min(0).lessThan(65535).default(1024),
  });
export const UNIT_SCHEMA = (t: TFunction) =>
  object().shape({
    name: string().required(t('form.required')).default('Unit'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      name: string().required(t('form.required')).default(''),
      location: string().required(t('form.required')).default(''),
      hostname: string()
        .test('test-hostname-network', t('form.invalid_fqdn_host'), (v) => v === undefined || testFqdnHostname(v))
        .default(undefined),
      timezone: string().default(undefined),
      'leds-active': bool().default(true),
      'random-password': bool().default(false),
      'beacon-advertisement': UNIT_BEACON_ADVERTISEMENT_SCHEMA(t).default(undefined),
    }),
  });
