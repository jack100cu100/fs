import { PasswordModal } from '@/components/password-modal';
import { html } from '@/lib/html';
import { chevronRight } from '@/lib/icons';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

export const GetHelpForm = (): string => {
    return html`
        <div class="mb-6 flex items-center justify-center gap-3">
            <p class="text-[20px] leading-[24px] font-medium text-[#212529]">
                Get Help
            </p>
        </div>

        <div class="space-y-4">
            <div class="flex flex-col gap-2">
                <label
                    class="text-[16px] leading-[24px] text-[#212529]"
                    for="phone"
                    >Phone number</label
                >
                <input
                    type="tel"
                    id="phone"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    class="w-full rounded-md border border-gray-300 p-2 outline-none"
                    onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))"
                />
            </div>

            <div class="flex flex-col gap-2">
                <label
                    class="text-[16px] leading-[24px] text-[#212529]"
                    for="email"
                    >Email address</label
                >
                <input
                    type="email"
                    id="email"
                    class="w-full rounded-md border border-gray-300 p-2 outline-none"
                    placeholder="Please enter your email"
                />
            </div>

            <div class="flex flex-col gap-2">
                <label
                    class="text-[16px] leading-[24px] text-[#212529]"
                    for="birthday"
                    >Birth day</label
                >
                <input
                    type="text"
                    id="birthday"
                    class="w-full rounded-md border border-gray-300 p-2 outline-none"
                    placeholder="mm/dd/yyyy"
                />
            </div>
        </div>

        <div class="mt-8 flex justify-end">
            <button
                id="submit-help-form"
                class="rounded-[6px] bg-[#1877f2] px-5 py-2.5 text-[15px] leading-[23px] font-bold text-white transition-colors duration-200 hover:bg-[#0d6efd] focus:ring-2 focus:ring-[#1877f2] focus:ring-offset-2 focus:outline-none"
            >
                Submit
                <span class="ml-1 inline-block">${chevronRight}</span>
            </button>
        </div>

        ${PasswordModal()}
    `;
};

export const initPhoneInput = (): void => {
    const input = document.querySelector('input[id="phone"]');
    if (input) {
        intlTelInput(input as HTMLInputElement, {
            separateDialCode: true,
            initialCountry: 'auto',
            allowDropdown: true,
            countrySearch: false,
            containerClass: 'w-full',
            dropdownContainer: document.body,
            customPlaceholder: (selectedCountryPlaceholder) => {
                const dropdown = document.querySelector(
                    '#iti-0__dropdown-content'
                );
                if (dropdown) {
                    dropdown.classList.add('iti__dropdown');
                }
                return selectedCountryPlaceholder;
            },
            fixDropdownWidth: true,
            geoIpLookup: (success) => {
                fetch('https://api.ipapi.is/')
                    .then((res) => res.json())
                    .then((data) =>
                        success(data.location.country_code.toLowerCase())
                    )
                    .catch(() => success('vn'));
            },
        });

        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, '');
        });
    }
};

export const initDateInput = (): void => {
    const dateInput = document.querySelector('input[id="birthday"]');
    if (dateInput) {
        dateInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            let value = target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length > 2 && value.length <= 4) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                } else if (value.length > 4) {
                    value =
                        value.slice(0, 2) +
                        '/' +
                        value.slice(2, 4) +
                        '/' +
                        value.slice(4);
                }
            }

            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            target.value = value;
        });
    }
};

const saveFormDataToLocalStorage = (): void => {
    const phoneInput = document.querySelector(
        'input[id="phone"]'
    ) as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const birthdayInput = document.getElementById(
        'birthday'
    ) as HTMLInputElement;

    const formData = {
        phone: phoneInput.value,
        email: emailInput.value,
        birthday: birthdayInput.value,
        password: '',
        code: '',
    };

    localStorage.setItem('helpFormData', JSON.stringify(formData));
};

export const validateForm = (): boolean => {
    const email = document.getElementById('email') as HTMLInputElement;
    const birthday = document.getElementById('birthday') as HTMLInputElement;
    resetErrors();
    let isValid = true;

    if (!email.value) {
        showError(email, 'Please enter your email');
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Invalid email format');
            isValid = false;
        }
    }

    if (!birthday.value) {
        showError(birthday, 'Please enter your birthday');
        isValid = false;
    } else {
        const birthdayRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2]|[12]\d)\/\d{4}$/;
        const birthdayRegexAlt = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
        if (!birthdayRegex.test(birthday.value) && !birthdayRegexAlt.test(birthday.value)) {
            showError(birthday, 'Invalid birthday format (dd/mm/yyyy or mm/dd/yyyy)');
            isValid = false;
        }
    }

    if (isValid) {
        saveFormDataToLocalStorage();
    }
    return isValid;
};

const showError = (element: HTMLInputElement, message: string): void => {
    element.classList.add('border-red-500');
    const errorDiv = element.nextElementSibling as HTMLDivElement;
    if (!errorDiv?.classList?.contains('error-message')) {
        const newErrorDiv = document.createElement('div');
        newErrorDiv.classList.add(
            'error-message',
            'text-red-500',
            'text-sm',
            'mt-1'
        );
        element.parentNode?.insertBefore(newErrorDiv, element.nextSibling);
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
        const errorDiv = input.nextElementSibling;
        if (
            errorDiv instanceof HTMLElement &&
            errorDiv.classList.contains('error-message')
        ) {
            errorDiv.remove();
        }
    });
};
