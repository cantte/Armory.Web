import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../common/store';
import { UiStatus } from '../../common/types';
import { Squadron } from './Models/Squadron';

export interface SquadronState {
  ui: UiStatus;
  error: string;
  wasRegistered: boolean;
  data: Squadron[];
}

const initialState: SquadronState = {
  ui: 'idle',
  error: '',
  wasRegistered: false,
  data: [],
};

export const squadronSlice = createSlice({
  name: 'squadron',
  initialState,
  reducers: {
    notRegister: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    registeredCorrectly: state => {
      state.wasRegistered = true;
    },
    resetRegister: state => {
      state.wasRegistered = false;
      state.error = '';
    },
    loadingSquadrons: state => {
      state.ui = 'loading';
    },
    loadSquadrons: (state, action: PayloadAction<Squadron[]>) => {
      state.ui = 'loaded';
      state.data = action.payload;
    },
  },
});

export const {
  notRegister,
  registeredCorrectly,
  resetRegister,
  loadingSquadrons,
  loadSquadrons,
} = squadronSlice.actions;

export const selectError = (state: RootState): string => state.squadron.error;
export const selectWasRegistered = (state: RootState): boolean =>
  state.squadron.wasRegistered;
export const selectSquadrons = (state: RootState): Squadron[] =>
  state.squadron.data;
export const selectUiStatus = (state: RootState): UiStatus => state.squadron.ui;

export default squadronSlice.reducer;
