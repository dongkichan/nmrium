import type { Draft } from 'immer';

import type {
  ChangeExportSettingsAction,
  PreferencesState,
} from '../preferencesReducer.js';
import { getActiveWorkspace } from '../utilities/getActiveWorkspace.js';

export function changeExportSettings(
  draft: Draft<PreferencesState>,
  action: ChangeExportSettingsAction,
) {
  const currentWorkspacePreferences = getActiveWorkspace(draft);
  const { key, options } = action.payload;
  currentWorkspacePreferences.export[key] = options;
}
