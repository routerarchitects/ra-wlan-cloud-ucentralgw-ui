import * as React from 'react';

export const UI_FLAG_KEYS = {
  aiAssistant: 'owgw.ui.aiAssistant.enabled',
  grafanaTab: 'owgw.ui.grafana.enabled',
} as const;

const UI_SETTINGS_UPDATED_EVENT = 'owgw-ui-settings-updated';

const parseBoolean = (value: string | null, fallback: boolean) => {
  if (value === null) return fallback;
  return value === 'true';
};

const getStoredFlags = () => ({
  aiAssistantEnabled: parseBoolean(localStorage.getItem(UI_FLAG_KEYS.aiAssistant), false),
  grafanaEnabled: parseBoolean(localStorage.getItem(UI_FLAG_KEYS.grafanaTab), false),
});

const emitUpdatedEvent = () => window.dispatchEvent(new Event(UI_SETTINGS_UPDATED_EVENT));

const setStoredFlag = (key: string, value: boolean) => {
  localStorage.setItem(key, String(value));
  emitUpdatedEvent();
};

export const useUiFeatureFlags = () => {
  const [flags, setFlags] = React.useState(getStoredFlags);

  React.useEffect(() => {
    const onAnyStorageChange = () => setFlags(getStoredFlags());
    window.addEventListener('storage', onAnyStorageChange);
    window.addEventListener(UI_SETTINGS_UPDATED_EVENT, onAnyStorageChange);

    return () => {
      window.removeEventListener('storage', onAnyStorageChange);
      window.removeEventListener(UI_SETTINGS_UPDATED_EVENT, onAnyStorageChange);
    };
  }, []);

  const setAiAssistantEnabled = React.useCallback(
    (value: boolean) => setStoredFlag(UI_FLAG_KEYS.aiAssistant, value),
    [],
  );

  const setGrafanaEnabled = React.useCallback((value: boolean) => setStoredFlag(UI_FLAG_KEYS.grafanaTab, value), []);

  return {
    ...flags,
    setAiAssistantEnabled,
    setGrafanaEnabled,
  };
};
