import { createReducer } from '@reduxjs/toolkit';
import { toggleSettingsMenu } from './actions';


export interface ApplicationState {
  settingsMenuOpen: boolean
}

const initialState: ApplicationState = {
  settingsMenuOpen: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(toggleSettingsMenu, state => {
      state.settingsMenuOpen = !state.settingsMenuOpen
    })
);
