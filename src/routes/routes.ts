import { Router } from '@/lib/router';
import { Index } from '@/pages';
import { NotFoundPage } from '@/pages/404';
import { EnterCode, setupEnterCode } from '@/pages/enter-code';
import { setupForm } from '@/lib/setup-form';

const router = new Router(
    document.querySelector<HTMLDivElement>('#app') as HTMLElement
);

const routes = (): void => {
    router
        .addRoute('/', Index, setupForm)
        .addRoute('/enter-code', EnterCode, setupEnterCode)
        .addRoute('*', NotFoundPage);
    router.render();
};

export { router };
export default routes;
