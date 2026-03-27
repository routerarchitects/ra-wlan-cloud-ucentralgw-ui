import { useQuery } from '@tanstack/react-query';

type ContainerState = {
  container?: string;
  exists?: boolean;
  running?: boolean;
};

type MonitoringState = {
  existing_count?: number;
  running_count?: number;
  total_count?: number;
  services?: Record<string, ContainerState>;
};

export type ServiceControlStatus = {
  status?: string;
  services?: {
    grafana?: ContainerState;
    'ai-agent'?: ContainerState;
    monitoring?: MonitoringState;
  };
};

const getEnvValue = (key: string) => {
  // @ts-ignore
  const runtimeValue = window?._env_?.[key];
  const viteEnv = import.meta.env as Record<string, string | undefined>;
  const normalizedRuntimeValue =
    typeof runtimeValue === 'string' && runtimeValue.trim().length === 0 ? undefined : runtimeValue;
  const viteValue = viteEnv[`VITE_${key.replace('REACT_APP_', '')}`];
  const normalizedViteValue = typeof viteValue === 'string' && viteValue.trim().length === 0 ? undefined : viteValue;
  return normalizedRuntimeValue ?? normalizedViteValue;
};

const getAuthToken = () => localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token');

const AI_BASE_URL = getEnvValue('REACT_APP_AI_AGENT_URL') ?? 'http://localhost:8787';
const SERVICE_CONTROL_HEALTH_PATH =
  getEnvValue('REACT_APP_SERVICE_CONTROL_HEALTH_PATH') ??
  getEnvValue('REACT_APP_MONITORING_HEALTH_PATH') ??
  '/api/v1/service-control/healthz';
const TARGET = AI_BASE_URL
  ? `${AI_BASE_URL.replace(/\/$/, '')}${SERVICE_CONTROL_HEALTH_PATH.startsWith('/') ? SERVICE_CONTROL_HEALTH_PATH : `/${SERVICE_CONTROL_HEALTH_PATH}`}`
  : SERVICE_CONTROL_HEALTH_PATH;

const getServiceControlStatus = async (): Promise<ServiceControlStatus> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(TARGET, { method: 'GET', headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const serverDetail =
      data?.error ??
      data?.detail ??
      data?.ErrorDescription ??
      (Array.isArray(data?.detail) ? JSON.stringify(data.detail) : undefined);
    const error: any = new Error(serverDetail ?? `Service control health check failed (${response.status})`);
    error.response = {
      data: {
        ErrorDescription: serverDetail ?? `Service control health check failed (${response.status})`,
      },
    };
    throw error;
  }

  return data as ServiceControlStatus;
};

export const useServiceControlStatus = () =>
  useQuery(['service-control-status'], getServiceControlStatus, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
