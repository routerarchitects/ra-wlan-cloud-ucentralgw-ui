import { useMutation } from '@tanstack/react-query';

type AiAgentControlPayload = {
  enabled: boolean;
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
const AI_AGENT_CONTROL_PATH = getEnvValue('REACT_APP_AI_AGENT_CONTROL_PATH') ?? '/api/v1/ai-agent/control';
const TARGET = AI_BASE_URL
  ? `${AI_BASE_URL.replace(/\/$/, '')}${AI_AGENT_CONTROL_PATH.startsWith('/') ? AI_AGENT_CONTROL_PATH : `/${AI_AGENT_CONTROL_PATH}`}`
  : AI_AGENT_CONTROL_PATH;

const postAiAgentControl = async (payload: AiAgentControlPayload) => {
  const token = getAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(TARGET, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const serverDetail =
      data?.error ??
      data?.detail ??
      data?.ErrorDescription ??
      (Array.isArray(data?.detail) ? JSON.stringify(data.detail) : undefined);
    const error: any = new Error(serverDetail ?? `AI agent control failed (${response.status})`);
    error.response = {
      data: {
        ErrorDescription: serverDetail ?? `AI agent control failed (${response.status})`,
      },
    };
    throw error;
  }

  return data;
};

export const useSetAiAgentControl = () => useMutation((payload: AiAgentControlPayload) => postAiAgentControl(payload));
