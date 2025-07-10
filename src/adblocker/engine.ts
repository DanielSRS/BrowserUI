import { FiltersEngine } from '@ghostery/adblocker';

export let adblockerEngine: FiltersEngine | undefined;

FiltersEngine.fromLists(fetch, ['https://easylist.to/easylist/easylist.txt'])
  .then(engine => {
    adblockerEngine = engine;
    console.log('Adblocker engine initialized with filters:');
  })
  .catch(error => {
    console.error('Failed to initialize adblocker engine:', error);
  });

export function loadAdblockerFilters() {}
