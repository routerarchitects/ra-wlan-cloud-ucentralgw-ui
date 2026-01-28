export interface ConfigurationSection {
    data: any;
    invalidValues: {
        key: string;
        error: string | object;
    }[];
    isDirty: boolean;
    shouldValidate?: boolean;
    warnings?: {
        warning: string;
        explanation: string;
    }[];
}

export interface ConfigurationDisplayProps {
    configuration: Record<string, any>;
    onConfigChange: (config: Record<string, any>) => void;
    isLoading?: boolean;
    renderModals?: (modals: React.ReactNode) => void;
}
