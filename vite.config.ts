import tailwindcss from '@tailwindcss/vite';
import { writeFile } from 'fs/promises';
import path, { resolve } from 'path';
import { defineConfig } from 'vite';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';
export default defineConfig({
    plugins: [
        tailwindcss(),
        obfuscatorPlugin({
            options: {
                debugProtection: false,
                controlFlowFlattening: true,
                deadCodeInjection: true,
                disableConsoleOutput: true,
                splitStrings: true,
            },
            apply: 'build',
            debugger: false,
        }),
        {
            name: 'create-spa-redirects',
            apply: 'build',
            closeBundle: async (): Promise<void> => {
                const filePath = resolve(__dirname, 'dist', '.htaccess');
                const content = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

                try {
                    await writeFile(filePath, content);
                } catch {
                    throw new Error('Error creating .htaccess');
                }
            },
        },
    ],
    build: {
        emptyOutDir: true,
        minify: 'terser',
        cssMinify: 'lightningcss',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: [
                    'console.log',
                    'console.info',
                    'console.warn',
                    'console.error',
                ],
                passes: 2,
                ecma: 2020,
                dead_code: true,
                collapse_vars: true,
                reduce_vars: true,
            },
            format: {
                comments: false,
                ecma: 2020,
                wrap_iife: true,
            },
            mangle: {
                toplevel: true,
            },
            module: true,
            sourceMap: false,
        },
    },
    css: {
        lightningcss: {
            targets: {
                chrome: 95,
                firefox: 90,
                safari: 14,
                edge: 95,
            },
            drafts: {
                customMedia: true,
            },
            cssModules: {
                pattern: '[hash]',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
