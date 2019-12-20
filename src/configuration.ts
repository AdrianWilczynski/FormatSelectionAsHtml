export interface Configuration {
    formatter: 'prettier' | 'js-beautify';
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
    printWidth: number;
}