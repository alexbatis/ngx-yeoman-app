import { MetaReducer, ActionReducer, State } from '@ngrx/store';
import { AppConfig } from '@env/environment';
import { debug } from './debug.reducer';

// const commonService = new CommonService();

// TODO: make class/interface to model FormGroupState as json2typescript deserializeable
// function modelslDeserializer(storedState: any): Array<any> {
//   return commonService.deserializeArray<Model>(storedState, Model);
// }

// function configurationsDeserializer(storedState: any): Array<any> {
//   return commonService.deserializeArray<Configuration>(
//     storedState,
//     Configuration
//   );
// }

// export function localStorageSyncReducer(
//   reducer: ActionReducer<State<any>>
// ): ActionReducer<any> {
//   return localStorageSync({
//     keys: [
//       { models: { deserialize: modelslDeserializer } },
//       { configurations: { deserialize: configurationsDeserializer } },
//       { modelForm: {} },
//       { configurationForm: {} }
//     ],
//     rehydrate: true,
//     removeOnUndefined: true
//   })(reducer);
// }

export const metaReducers: MetaReducer<any>[] = [];

if (!AppConfig.production) {
  // metaReducers.unshift(storeFreeze);
  if (AppConfig.debug) {
    metaReducers.unshift(debug);
  }
}

// metaReducers.unshift(localStorageSyncReducer);
