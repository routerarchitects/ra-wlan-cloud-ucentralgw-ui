import { array, bool, number, object, string } from 'yup';

export const DEFAULT_NAT_CONFIGURATION = {
  snat: {
    rules: [],
  },
  dnat: {
    rules: [],
  },
};

const GROUP_SCHEMA = object()
  .shape({
    'port-group': string().default(undefined),
    'network-group': string().default(undefined),
    'mac-group': string().default(undefined),
    'domain-group': string().default(undefined),
    'address-group': string().default(undefined),
  })
  .default(undefined);

const PORT_SCHEMA = number().moreThan(0).lessThan(65536).integer().default(undefined);

const BASE_RULE_SHAPE = (t: (k: string) => string) => ({
  'rule-id': number().required(t('form.required')).min(1, t('form.required')).integer().default(1),
  disable: bool().default(undefined),
  protocol: string().oneOf(['all', 'tcp', 'udp']).default(undefined),
  source: object()
    .shape({
      address: string().default(undefined),
      port: PORT_SCHEMA,
      fqdn: string().default(undefined),
      group: GROUP_SCHEMA,
    })
    .default(undefined),
  destination: object()
    .shape({
      address: string().default(undefined),
      port: PORT_SCHEMA,
      fqdn: string().default(undefined),
      group: GROUP_SCHEMA,
    })
    .default(undefined),
});

export const NAT_RULE_SCHEMA = (t: (k: string) => string, useDefault = false) => {
  const shape = object().shape({
    ...BASE_RULE_SHAPE(t),
    'out-interface': object()
      .shape({
        name: string().required(t('form.required')).default(''),
        group: string().default(undefined),
      })
      .required(t('form.required'))
      .default({ name: '' }),
    translation: object()
      .shape({
        address: string().required(t('form.required')).default(''),
        port: PORT_SCHEMA,
      })
      .required(t('form.required'))
      .default({ address: '' }),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const DNAT_RULE_SCHEMA = (t: (k: string) => string, useDefault = false) => {
  const shape = object().shape({
    ...BASE_RULE_SHAPE(t),
    'in-interface': object()
      .shape({
        name: string().required(t('form.required')).default(''),
        group: string().default(undefined),
      })
      .required(t('form.required'))
      .default({ name: '' }),
    translation: object()
      .shape({
        address: string().required(t('form.required')).default(''),
        port: PORT_SCHEMA,
      })
      .required(t('form.required'))
      .default({ address: '' }),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const NAT_SCHEMA = (t: (k: string) => string) =>
  object().shape({
    name: string().required(t('form.required')).default('Nat'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object()
      .shape({
        snat: object()
          .shape({
            rules: array().of(NAT_RULE_SCHEMA(t, true)).default([]),
          })
          .required(t('form.required'))
          .default({ rules: [] }),
        dnat: object()
          .shape({
            rules: array().of(DNAT_RULE_SCHEMA(t, true)).default([]),
          })
          .required(t('form.required'))
          .default({ rules: [] }),
      })
      .default(DEFAULT_NAT_CONFIGURATION),
  });
