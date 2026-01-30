import { object, string, number, bool } from 'yup';


export const SERVICES_HTTP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_HTTPS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_SNMP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_SSH_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(true),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_TELNET_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_LLDP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    describe: string().required(t('form.required')).default(''),
    location: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_SCHEMA = (t, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Services'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      http: SERVICES_HTTP_SCHEMA(t, useDefault),
      https: SERVICES_HTTPS_SCHEMA(t, useDefault),
      lldp: SERVICES_LLDP_SCHEMA(t, useDefault),
      snmp: SERVICES_SNMP_SCHEMA(t, useDefault),
      ssh: SERVICES_SSH_SCHEMA(t, useDefault),
      telnet: SERVICES_TELNET_SCHEMA(t, useDefault),
    }),
  });

export const getSubSectionDefaults = (t, sub) => {
  switch (sub) {
    case 'http':
      return SERVICES_HTTP_SCHEMA(t, true).cast();
    case 'https':
      return SERVICES_HTTPS_SCHEMA(t, true).cast();
    case 'lldp':
      return SERVICES_LLDP_SCHEMA(t, true).cast();
    case 'snmp':
      return SERVICES_SNMP_SCHEMA(t, true).cast();
    case 'ssh':
      return SERVICES_SSH_SCHEMA(t, true).cast();
    case 'telnet':
      return SERVICES_TELNET_SCHEMA(t, true).cast();
    default:
      return null;
  }
};
