import {
    GetHelpForm,
    initDateInput,
    initPhoneInput,
    validateForm,
} from '@/components/get-help-form';
import { initPasswordModal, showModal } from '@/components/password-modal';
import { router } from '@/routes/routes';

export const setupForm = (): void => {
    const mistakeRadio = document.getElementById('mistake');
    const nextButton = document.getElementById('next-button');
    const formContainer = document.getElementById('form-container');

    if (
        !(mistakeRadio instanceof HTMLInputElement) ||
        !(nextButton instanceof HTMLButtonElement) ||
        !formContainer
    ) {
        return;
    }

    const initHelpForm = (): void => {
        formContainer.innerHTML = GetHelpForm();
        initPhoneInput();
        initDateInput();
        initPasswordModal();
        document
            .getElementById('submit-help-form')
            ?.addEventListener('click', () => {
                if (validateForm()) {
                    showModal();
                }
            });
    };

    const params = router.getQueryParams();
    if (params.get('step') === 'help-form') {
        mistakeRadio.checked = true;
        initHelpForm();
    } else {
        localStorage.clear();
    }

    nextButton.addEventListener('click', () => {
        if (mistakeRadio.checked) {
            initHelpForm();
            router.setQueryParam('step', 'help-form');
        }
    });
};
