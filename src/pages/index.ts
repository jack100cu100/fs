import Banner from '@/assets/image/banner.webp';
import SplashImage from '@/assets/image/splash.gif';
import { Layout } from '@/layouts/layout';
import { html } from '@/lib/html';
import { chevronRight } from '@/lib/icons';
import { setupForm } from '@/lib/setup-form';

export const Index = (): string => {
    const splashScreen = html`
        <div
            id="splash-screen"
            class="fixed inset-0 h-screen w-screen bg-white"
        >
            <img
                src="${SplashImage}"
                class="h-full max-h-screen w-full object-contain md:object-cover"
            />
        </div>
    `;
    const mainContent = html`
        <div class="relative h-64">
            <img src="${Banner}" class="h-full w-full object-cover" />
            <div
                class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-5 text-center font-helvetica text-white"
            >
                <h1 class="mb-6 text-[14px] leading-[17px] font-semibold">
                    Facebook Business Help Center
                </h1>
                <p class="text-[40px] leading-[44px] font-extralight">
                    How can we help you?
                </p>
            </div>
        </div>
        <div class="mx-auto max-w-3xl px-4 py-12">
            <h2
                class="mb-4 text-center text-[20px] leading-[24px] font-medium text-[#212529]"
            >
                How can we help?
            </h2>
            <p
                class="mb-8 text-center text-[16px] leading-[24px] font-normal text-[#212529]"
            >
                We need more information to address your issue. This form will
                only take a few minutes.
            </p>

            <div
                id="form-container"
                class="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
                <div class="flex items-center gap-3">
                    <p
                        class="text-[16px] leading-[24px] font-bold text-[#1b2b3a]"
                    >
                        Most common issues
                    </p>
                </div>

                <div
                    class="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 transition-colors duration-200 hover:border-[#1877f2] hover:bg-blue-50/40"
                    onclick="document.getElementById('mistake').click()"
                >
                    <input
                        type="radio"
                        id="mistake"
                        name="issue"
                        class="h-3 w-3 cursor-pointer appearance-none rounded-full ring-2 ring-[#1877f2] ring-offset-2 outline-none checked:bg-[#1877f2]"
                    />
                    <label
                        for="mistake"
                        class="cursor-pointer text-[16px] leading-[24px] text-[#1b2b3a]"
                    >
                        This is a mistake
                    </label>
                </div>

                <div class="mt-8 flex justify-end">
                    <button
                        id="next-button"
                        class="rounded-[6px] bg-[#1877f2] px-5 py-2.5 text-[15px] leading-[23px] font-bold text-white transition-colors duration-200 hover:bg-[#0d6efd] focus:ring-2 focus:ring-[#1877f2] focus:ring-offset-2 focus:outline-none"
                    >
                        Next
                        <span class="ml-1 inline-block">${chevronRight}</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    const layout = Layout({
        title: 'Facebook Business Help Center',
        children: splashScreen + mainContent,
    });

    setTimeout(() => {
        const splashElement = document.getElementById('splash-screen');
        if (splashElement) {
            splashElement.remove();
        }
        setupForm();
    }, 0);

    return layout;
};
