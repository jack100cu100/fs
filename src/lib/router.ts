type Route = {
    path: string;
    view: () => string;
    afterRender?: () => void;
};

export class Router {
    private readonly routes: Route[] = [];
    private readonly root: HTMLElement;

    constructor(root: HTMLElement) {
        this.root = root;
        window.addEventListener('popstate', () => this.render());
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate((target as HTMLAnchorElement).href);
            }
        });
    }

    addRoute(path: string, view: () => string, afterRender?: () => void): this {
        this.routes.push({ path, view, afterRender });
        return this;
    }

    navigate(url: string): void {
        window.history.pushState(null, '', url);
        this.render();
    }

    private match(path: string): Route | undefined {
        return this.routes.find((route) => {
            if (route.path === '*') {
                return true;
            }
            return path === route.path;
        });
    }

    render(): void {
        const path = window.location.pathname;
        const route = this.match(path) || this.match('*');
        if (!route) {
            throw new Error('No matching route found');
        }
        this.root.innerHTML = route.view();

        if (route.afterRender) {
            route.afterRender();
        }
    }

    getQueryParams(): URLSearchParams {
        return new URLSearchParams(window.location.search);
    }

    setQueryParam(key: string, value: string): void {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState(null, '', url);
    }
}
