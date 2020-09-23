import { CdkAny } from 'lib/types';
import { App } from 'vue';
import {getClassToken} from '../tools'
import { UniqueSelectionDispatcher } from './unique_selection_dispatcher';

export * from './unique_selection_dispatcher';

export const uniqueSelectionDispatcherToken = getClassToken(UniqueSelectionDispatcher);


export const collectionsPlugin = {
  install(app: App, ...options: CdkAny[]) {
    app.provide(uniqueSelectionDispatcherToken, new UniqueSelectionDispatcher());
  }
}
