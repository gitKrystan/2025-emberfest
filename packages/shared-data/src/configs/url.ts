import { setBuildURLConfig } from '@warp-drive/utilities';

export function setDefaultBuildURLConfig() {
  setBuildURLConfig({
    host: '/',
    namespace: 'api',
  });
}
