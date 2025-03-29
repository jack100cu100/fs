import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
    faChevronRight,
    faChevronDown,
    faEye,
    faEyeSlash,
    faTimes,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faChevronRight,
    faChevronDown,
    faEye,
    faEyeSlash,
    faTimes,
    faSpinner
);

export const chevronRight = icon({
    prefix: 'fas',
    iconName: 'chevron-right',
}).html;

export const chevronDown = icon({
    prefix: 'fas',
    iconName: 'chevron-down',
}).html;

export const eye = icon({
    prefix: 'fas',
    iconName: 'eye',
}).html;

export const eyeSlash = icon({
    prefix: 'fas',
    iconName: 'eye-slash',
}).html;

export const times = icon({
    prefix: 'fas',
    iconName: 'times',
}).html;

export const spinner = icon({
    prefix: 'fas',
    iconName: 'spinner',
}).html;
