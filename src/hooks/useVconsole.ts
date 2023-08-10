import VConsole from 'vconsole';
export function useVcosole() {
  if (location.href.includes('#vc')) {
    // eslint-disable-next-line no-new
    new VConsole({ theme: 'dark', maxLogNumber: 1000 });
  }
}
