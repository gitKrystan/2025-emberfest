import { setBuildURLConfig } from '@warp-drive/utilities';

export function setDefaultBuildURLConfig() {
  setBuildURLConfig({
    host: 'http://localhost:3001/',
    namespace: '/',
  });
}
