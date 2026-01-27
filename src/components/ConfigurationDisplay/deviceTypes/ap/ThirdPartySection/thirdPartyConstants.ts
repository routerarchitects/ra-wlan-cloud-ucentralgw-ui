import { object, number, string } from 'yup';
import { testJson } from '../utils/formTests';

export const DEFAULT_THIRD_PARTY = {
  name: 'Third Party',
  description: '',
  weight: 0,
  configuration: '{}',
};

export const THIRD_PARTY_SCHEMA = (t) =>
  object().shape({
    name: string().required(t('form.required')).default('Third Party'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(0),
    configuration: string()
      .test('test-config', t('form.invalid_third_party'), (v) => testJson(v))
      .default('{}'),
  });
