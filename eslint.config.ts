import globals from 'globals';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tseslint.config(
    includeIgnoreFile(gitignorePath),
    globalIgnores([
        '**/node_modules/',
        '**/dist/',
        '**/.git/',
        '**/.vscode/',
        '**/build/',
        '!**/.eslintrc.js',
    ]),
    {
        files: ['**/*.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: __dirname,
            },
        },
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                ecmaVersion: 'latest',
            },
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-var': 'error',

            quotes: ['error', 'single'],
            semi: ['error', 'always'],

            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',

            'prefer-const': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],

            'no-inline-comments': 'error',
        },
    },
    ...tseslint.configs.recommended
) satisfies FlatConfig.Config[];
