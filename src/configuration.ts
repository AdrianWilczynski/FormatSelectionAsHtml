export interface Configuration {
    formatter: 'prettier' | 'js-beautify';
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
    preserveNewlines: boolean;
    maxPreserveNewlines: number | null;
    printWidth: number;
}