import { CdkAny } from 'lib/types';
import { App } from 'vue';
import {getClassToken} from '../tools'
import { UniqueSelectionDispatcher } from './unique_selection_dispatcher';

export * from './unique_selection_dispatcher';

let collectionInstalled = false;

export const uniqueSelectionDispatcherToken = getClassToken(UniqueSelectionDispatcher);

export const collectionsPlugin = {
  install(app: App, ...options: CdkAny[]) {
    if (collectionInstalled) {
      return;
    }
    app.provide(uniqueSelectionDispatcherToken, new UniqueSelectionDispatcher());
    collectionInstalled = true;
  }
}
