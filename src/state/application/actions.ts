import { createAction } from '@reduxjs/toolkit'
import { AllToken } from './reducer';

export const toggleSettingsMenu = createAction<void>('app/toggleSettingsMenu');

export const address = createAction<string>('app/address')
export const balance = createAction<AllToken>('app/balance');

