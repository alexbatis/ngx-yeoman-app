import { MetaReducer } from '@ngrx/store';
import { AppConfig } from '@env/environment';
import { debug } from './debug.reducer';

export const metaReducers: MetaReducer<any>[] = [];

if (!AppConfig.production) {
  // metaReducers.unshift(storeFreeze);
  if (AppConfig.debug) {
    metaReducers.unshift(debug);
  }
}

