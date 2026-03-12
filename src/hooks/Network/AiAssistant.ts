import { useMutation } from '@tanstack/react-query';

export type AiChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AiChatRequest = {
  message: string;
  conversation: AiChatMessage[];
  context?: {
    route?: string;
    title?: string;
  };
  provider?: 'auto' | 'gemini' | 'openai';
};

export type AiChatResponse = {
  reply: string;
  model?: string;
  provider?: string;
  conversationId?: string;
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
const AI_PATH = getEnvValue('REACT_APP_AI_AGENT_PATH') ?? '/ai/chat';
const AI_MOCK_ENABLED = String(getEnvValue('REACT_APP_AI_AGENT_MOCK') ?? 'false').toLowerCase() === 'true';
const AI_TARGET = AI_BASE_URL
  ? `${AI_BASE_URL.replace(/\/$/, '')}${AI_PATH.startsWith('/') ? AI_PATH : `/${AI_PATH}`}`
  : AI_PATH;
const AI_TIMEOUT_MS = 45000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockResponse = async ({ message }: AiChatRequest): Promise<AiChatResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `Mock assistant response for: "${message}"`,
        model: 'mock-model',
      });
    }, 600);
  });

const postAiChat = async (payload: AiChatRequest): Promise<AiChatResponse> => {
  if (AI_MOCK_ENABLED) return mockResponse(payload);

  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const attempt = async () => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
    try {
      return await fetch(AI_TARGET, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timer);
    }
  };

  let response: Response;
  try {
    response = await attempt();
  } catch {
    await sleep(350);
    response = await attempt();
  }
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const serverDetail =
      data?.error ??
      data?.detail ??
      data?.ErrorDescription ??
      (Array.isArray(data?.detail) ? JSON.stringify(data.detail) : undefined);
    const error: any = new Error(serverDetail ?? `AI request failed (${response.status})`);
    error.response = {
      data: {
        ErrorDescription: serverDetail ?? `AI request failed (${response.status})`,
      },
    };
    throw error;
  }

  return {
    reply: data?.reply ?? data?.message ?? '',
    model: data?.model,
    provider: data?.provider,
    conversationId: data?.conversationId,
  };
};

export const useAiAssistantChat = () => useMutation((payload: AiChatRequest) => postAiChat(payload));
