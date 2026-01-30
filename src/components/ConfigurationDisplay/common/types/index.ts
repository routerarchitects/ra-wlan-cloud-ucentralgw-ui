import type React from 'react';

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

export type SectionComponentProps = {
    editing: boolean;
    setSection: (section: ConfigurationSection) => void;
    sectionInformation: ConfigurationSection;
    removeSub: (sub: string) => void;
};

export type SectionDef = {
    key: string;
    tabLabel: string;
    name: string;
    schema: (t: (k: string) => string, useDefault?: boolean) => any;
    Component: React.FC<SectionComponentProps>;
};
