import { object, number, string, array, bool } from 'yup';

export const SINGLE_RADIO_SCHEMA = (t: (str: string) => string, useDefault = false, band = '2G') => {
  const shape = object().shape({
    band: string().required(t('form.required')).default(band),
    bandwidth: number().required(t('form.required')).integer().default(5),
    channel: string().required(t('form.required')).default('auto'),
    country: string().required(t('form.required')).default('US'),
    'channel-mode': string().required(t('form.required')).default('HT'),
    'require-mode': string().default(undefined),
    'channel-width': number().required(t('form.required')).integer().default(40),
    mimo: string().default(undefined),
    'tx-power': number().required(t('form.required')).moreThan(-1).lessThan(31).integer().default(0),
    'legacy-rates': bool().default(undefined),
    'allow-dfs': bool().default(true),
    'beacon-interval': number().required(t('form.required')).moreThan(14).lessThan(65535).integer().default(100),
    'maximum-clients': number().positive().integer().default(64),
    'hostadp-iface-raw': array().of(string()).default(undefined),
    rates: object()
      .shape({
        beacon: number().positive().integer().default(undefined),
        multicast: number().positive().integer().default(undefined),
      })
      .default(undefined),
    he: object()
      .shape({
        'multiple-bssid': bool().default(undefined),
        ema: bool().default(undefined),
        'bss-color': number().positive().integer().default(undefined),
      })
      .default(undefined),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const RADIOS_SCHEMA = (t: (str: string) => string, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Radio'),
    description: string().default(''),
    weight: number().required(t('form.required')).positive().integer().default(1),
    configuration: array()
      .of(SINGLE_RADIO_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

export const getSingleRadioDefault = (t: (str: string) => string) => SINGLE_RADIO_SCHEMA(t, true);
