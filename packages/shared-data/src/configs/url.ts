import { setBuildURLConfig } from '@warp-drive/utilities/json-api';

export function setDefaultBuildURLConfig() {
  setBuildURLConfig({
    host: '/',
    namespace: 'api',
  });
}
