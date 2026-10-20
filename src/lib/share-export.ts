import Constants from 'expo-constants';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { buildExport } from '@/lib/export-data';
import { snapshotStores } from '@/store/persist';

/** Save the person's data as a JSON file and hand it to the system share sheet (download on the web). Returns false if it could not be shared. */
export async function exportMyData(): Promise<boolean> {
  const json = JSON.stringify(
    buildExport(snapshotStores(), { version: Constants.expoConfig?.version ?? '1.0.0' }),
    null,
    2
  );
  const name = `kaizen-yoga-my-data-${new Date().toISOString().slice(0, 10)}.json`;
  try {
    if (Platform.OS === 'web') {
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    }
    const file = new File(Paths.cache, name);
    if (file.exists) file.delete();
    file.create();
    file.write(json);
    if (!(await Sharing.isAvailableAsync())) return false;
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: name });
    return true;
  } catch {
    return false;
  }
}
