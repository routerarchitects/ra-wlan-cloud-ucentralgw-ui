import { array, number, object, string } from 'yup';
import { TFunction } from 'i18next';

export const DEFAULT_CONFIG_RAW = {
  name: 'Config Raw',
  description: '',
  weight: 0,
  configuration: [],
};

export const CONFIG_RAW_SCHEMA = (t: TFunction) =>
  object().shape({
    name: string().required(t('form.required')).default('Config Raw'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(0),
    configuration: array().default([]),
  });
