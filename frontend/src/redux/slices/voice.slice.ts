import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULTS } from 'constant';

interface VoiceState {
  voiceURI: string;
  speed: number;
  volume: number;
  [key: string]: unknown;
}

const initialState: VoiceState = {
  voiceURI: DEFAULTS.VOICE_URI,
  speed: DEFAULTS.VOICE_SPEED,
  volume: DEFAULTS.VOICE_VOLUME,
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setVoiceItem(state, action: PayloadAction<{ key: string; value: unknown }>) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setVoice(state, action: PayloadAction<Partial<VoiceState>>) {
      return { ...state, ...action.payload };
    },
  },
});

const { reducer, actions } = voiceSlice;
export const { setVoiceItem, setVoice } = actions;
export default reducer;
