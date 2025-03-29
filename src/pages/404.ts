import { Layout } from '@/layouts/layout';
import { html } from '@/lib/html';

export const NotFoundPage = (): string =>
    Layout({
        title: '404 - Không tìm thấy trang',
        children: html`
            <p>Trang bạn đang tìm kiếm không tồn tại.</p>
            <a href="/" data-link class="text-blue-500 hover:underline"
                >Quay về trang chủ</a
            >
        `,
    });
