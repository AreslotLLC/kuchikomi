export type QuestionType = 'rating' | 'tags' | 'boolean' | 'text';

export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    options?: string[];
    aiUse: boolean;
    maxSelections?: number;
    required?: boolean;
    multiple?: boolean;
}

export interface ClientColorTheme {
    primary: string; // 600
    secondary: string; // 700
    light: string; // 50
    accent: string; // 400
}

export interface ClientConfig {
    id: string;
    name: string;
    googleMapLink: string;
    themeColor: 'emerald' | 'blue' | 'rose' | 'amber' | 'indigo';
    questions: Question[];
}

export const THEMES: Record<ClientConfig['themeColor'], ClientColorTheme> = {
    emerald: {
        primary: '#059669',
        secondary: '#047857',
        light: '#ecfdf5',
        accent: '#34d399',
    },
    blue: {
        primary: '#2563eb',
        secondary: '#1d4ed8',
        light: '#eff6ff',
        accent: '#60a5fa',
    },
    rose: {
        primary: '#e11d48',
        secondary: '#be123c',
        light: '#fff1f2',
        accent: '#fb7185',
    },
    amber: {
        primary: '#d97706',
        secondary: '#b45309',
        light: '#fffbeb',
        accent: '#fbbf24',
    },
    indigo: {
        primary: '#4f46e5',
        secondary: '#4338ca',
        light: '#eef2ff',
        accent: '#818cf8',
    },
};
