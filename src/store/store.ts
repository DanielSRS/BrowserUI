import { batch, observable } from '@legendapp/state';
import type { ReactNode } from 'react';

export interface Tab {
  name: string;
  id: number;
  order: number;
  icon?: {
    component: () => ReactNode;
  };
  state: {
    url: 'browser://newTab' | 'browser://config' | (string & {});
    // url: string;
    loading: boolean;
    title: string;
    canGoBack: boolean;
    canGoForward: boolean;
    // lockIdentifier: number;
  };
  // selected: boolean;
}

export interface Workspace {
  name: string;
  id: number;
  selectedTabId: number;
  nextNewTabId: number;
  tabs: Record<number, Tab>;
  tabIds: string[];
  openNewTab: () => void;
  openUrl: () => void;
  openNewConfigTab: () => void;
  focusConfigTab: () => boolean;
  selectTab: (id: number) => void;
  closeTab: (id: number) => void;
  closedTabs: Array<Tab>;
}

export const workspace = observable<Workspace>({
  name: 'default',
  id: 1,
  selectedTabId: 0,
  nextNewTabId: 1,
  closedTabs: [],
  tabs: {
    0: {
      name: 'New Tab',
      id: 0,
      order: 0,
      state: {
        url: 'browser://newTab',
        canGoBack: false,
        canGoForward: false,
        loading: false,
        title: 'New Tab',
      },
    },
  },
  tabIds: () => Object.keys(workspace.tabs.get(true)),
  openNewTab: () => {
    const newid = workspace.nextNewTabId.get();
    const nextId = newid + 1;
    const newOrder = Object.keys(workspace.tabs.peek()).length;
    batch(() => {
      workspace.selectedTabId.set(newid);
      workspace.nextNewTabId.set(nextId);
      workspace.tabs[newid].set({
        name: 'New Tab',
        id: newid,
        order: newOrder,
        state: {
          url: 'browser://newTab',
          canGoBack: false,
          canGoForward: false,
          loading: false,
          title: 'New Tab',
        },
      });
    });
  },
  openUrl: () => {
    const newid = workspace.nextNewTabId.get();
    const nextId = newid + 1;
    const newOrder = Object.keys(workspace.tabs.peek()).length;
    batch(() => {
      workspace.selectedTabId.set(newid);
      workspace.nextNewTabId.set(nextId);
      workspace.tabs[newid].set({
        name: 'Showcase',
        id: newid,
        order: newOrder,
        state: {
          url: 'browser://showcase',
          canGoBack: false,
          canGoForward: false,
          loading: false,
          title: 'Showcase',
        },
      });
    });
  },
  selectTab: (id: number) => {
    workspace.selectedTabId.set(id);
  },
  openNewConfigTab: () => {
    const newid = workspace.nextNewTabId.get();
    const nextId = newid + 1;
    const newOrder = Object.keys(workspace.tabs.peek()).length;
    batch(() => {
      workspace.tabs[newid].set({
        name: 'Settings',
        id: newid,
        order: newOrder,
        state: {
          url: 'browser://config',
          canGoBack: false,
          canGoForward: false,
          loading: false,
          title: 'Settings',
        },
      });
      workspace.selectedTabId.set(newid);
      workspace.nextNewTabId.set(nextId);
    });
  },
  focusConfigTab: () => {
    const opened = Object.values(workspace.tabs.get()).find(
      v => v.state.url === 'browser://config',
    );
    if (opened) {
      // focus on tab
      workspace.selectedTabId.set(opened.id);
      return true;
    }
    return false;
  },
  // closeTab: (withID: number) => {
  //   const tabs = workspace.tabs.get();
  //   const index = tabs.findIndex(tab => {
  //     return tab.id === withID;
  //   });
  //   if (index === -1) {
  //     return;
  //   }
  //   console.log('close: ', withID);

  //   const tode = workspace.tabs[index];
  //   const ggg = tode.get();
  //   const isSelected = ggg.id === workspace.selectedTabId.get();
  //   if (isSelected) {
  //     const nn = tabs.find(t => t.id !== workspace.selectedTabId.get());
  //     workspace.selectedTabId.set(nn?.id ?? 0);
  //   }

  //   workspace.closedTabs.push(ggg);
  //   tode.delete();

  //   // workspace.tabs[index].delete();
  //   // workspace.selectedTabId.set(0);
  // },
  closeTab: (idToFind: number) => {
    const ids = Object.keys(workspace.tabs.peek());
    const lastTabIndex = ids.length - 1;
    const selectedTabId = workspace.selectedTabId.get();
    const tabToDelete = workspace.tabs[idToFind];
    if (!tabToDelete) {
      console.error('no tab');
      return;
    }
    const deletedTabData = tabToDelete.peek();
    if (deletedTabData === undefined) {
      console.error('tab data is missing');
      return;
    }
    const id = deletedTabData.id;
    workspace.closedTabs.push(deletedTabData);
    const isCurrentSelected = selectedTabId === id;
    if (isCurrentSelected) {
      let tabToDeleteIndex = ids.findIndex(v => v === idToFind + '');
      const idToFocus = ids[tabToDeleteIndex + 1] ?? ids[tabToDeleteIndex - 1];
      // console.debug('sdf', lastTabIndex, idToFocus, tabToDeleteIndex);
      if (idToFocus) {
        workspace.selectedTabId.set(+idToFocus);
      }
    }
    tabToDelete.delete();
    const deletedLastTab = lastTabIndex === 0;
    if (deletedLastTab) {
      workspace.openNewTab();
    }
  },
});

export const settings = observable({
  isTopBarExpanded: true,
});

// export const CLOSEE = observable((idToFind: number) => {
//   const maxIndex = workspace.tabs.length - 1;
//   const selectedTabId = workspace.selectedTabId.peek();
//   const _tab = workspace.tabs.findIndex(v => v.id.peek() === idToFind);
//   if (_tab === -1) {
//     console.log('no tab');
//     return;
//   }
//   const tab = workspace.tabs[_tab];
//   const closed = tab.peek();
//   if (closed === undefined) {
//     console.error('tab data is missing');
//     return;
//   }
//   const id = closed.id;
//   workspace.closedTabs.push(tab.peek());
//   const isCurrentSelected = selectedTabId === id;
//   if (isCurrentSelected) {
//     const isTheLastTabInList = _tab >= maxIndex;
//     const toFocus = isTheLastTabInList
//       ? workspace.tabs[_tab - 1]
//       : workspace.tabs[_tab + 1];
//     workspace.selectedTabId.set(toFocus.peek().id);
//   }
//   tab.delete();
// });
