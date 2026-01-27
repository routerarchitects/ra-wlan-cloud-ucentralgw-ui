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
