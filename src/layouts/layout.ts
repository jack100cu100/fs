import { html } from '@/lib/html';

type LayoutProps = {
    children: string;
    title?: string;
};

export const Layout = ({
    children,
    title = 'Facebook Business Help Center',
}: LayoutProps): string => {
    document.title = title;
    return html` <main class="min-h-screen">${children}</main> `.trim();
};
