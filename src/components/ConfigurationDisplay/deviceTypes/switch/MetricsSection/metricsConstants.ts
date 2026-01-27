import { object, number, string, array, bool } from 'yup';

const EVENT_TYPES = [
  'ssh',
  'health',
  'health.dns',
  'health.dhcp',
  'health.radius',
  'health.memory',
  'client',
  'client.join',
  'client.leave',
  'client.key-mismatch',
  'wifi',
  'wifi.start',
  'wifi.stop',
  'wired',
  'wired.carrier-up',
  'wired.carrier-down',
  'unit',
  'unit-boot-up',
];

export const EVENT_TYPES_OPTIONS = EVENT_TYPES.map((type) => ({
  label: type,
  value: type,
}));

export const METRICS_WIFISCAN_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
      })
    : object()
        .shape({
          interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
        })
        .nullable()
        .default(undefined);

export const METRICS_REALTIME_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_TELEMETRY_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
        types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
          types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_STATISTICS_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
        types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
          types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_HEALTH_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
        'dhcp-local': bool().default(true),
        'dhcp-remote': bool().default(false),
        'dns-local': bool().default(true),
        'dns-remote': bool().default(true),
      })
    : object()
        .shape({
          interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
          'dhcp-local': bool().default(true),
          'dhcp-remote': bool().default(false),
          'dns-local': bool().default(true),
          'dns-remote': bool().default(true),
        })
        .nullable()
        .default(undefined);

export const METRICS_WIFI_FRAMES_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_DHCP_SNOOPING_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_SCHEMA = (t, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Metrics'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      statistics: METRICS_STATISTICS_SCHEMA(t, useDefault),
      health: METRICS_HEALTH_SCHEMA(t, useDefault),
      'wifi-frames': METRICS_WIFI_FRAMES_SCHEMA(t, useDefault),
      'dhcp-snooping': METRICS_DHCP_SNOOPING_SCHEMA(t, useDefault),
      realtime: METRICS_REALTIME_SCHEMA(t, useDefault),
      telemetry: METRICS_TELEMETRY_SCHEMA(t, useDefault),
      'wifi-scan': METRICS_WIFISCAN_SCHEMA(t, useDefault),
    }),
  });

export const getSubSectionDefaults = (t, sub) => {
  switch (sub) {
    case 'statistics':
      return METRICS_STATISTICS_SCHEMA(t, true).cast();
    case 'health':
      return METRICS_HEALTH_SCHEMA(t, true).cast();
    case 'wifi-frames':
      return METRICS_WIFI_FRAMES_SCHEMA(t, true).cast();
    case 'dhcp-snooping':
      return METRICS_DHCP_SNOOPING_SCHEMA(t, true).cast();
    case 'telemetry':
      return METRICS_TELEMETRY_SCHEMA(t, true).cast();
    case 'realtime':
      return METRICS_REALTIME_SCHEMA(t, true).cast();
    case 'wifi-scan':
      return METRICS_WIFISCAN_SCHEMA(t, true).cast();
    default:
      return null;
  }
};
