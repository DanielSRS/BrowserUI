import { observable } from '@legendapp/state';

export interface Tab {
  name: string;
  url: 'browser://newTab' | 'browser://config' | (string & {});
  id: number;
  order: number;
  // selected: boolean;
}

export interface Workspace {
  name: string;
  id: number;
  selectedTabId: number;
  nextNewTabId: number;
  tabs: Array<Tab>;
  openNewTab: () => void;
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
  tabs: [
    {
      name: 'New Tab',
      url: 'browser://newTab',
      id: 0,
      order: 0,
    },
  ],
  openNewTab: () => {
    const newid = workspace.nextNewTabId.get();
    const nextId = newid + 1;
    const newOrder = workspace.tabs.get().length;
    workspace.tabs.push({
      name: 'New Tab',
      id: newid,
      order: newOrder,
      url: 'browser://newTab',
    });
    workspace.selectedTabId.set(newid);
    workspace.nextNewTabId.set(nextId);
  },
  selectTab: (id: number) => {
    workspace.selectedTabId.set(id);
  },
  openNewConfigTab: () => {
    const newid = workspace.nextNewTabId.get();
    const nextId = newid + 1;
    const newOrder = workspace.tabs.get().length;
    workspace.tabs.push({
      name: 'Settings',
      id: newid,
      order: newOrder,
      url: 'browser://config',
    });
    workspace.selectedTabId.set(newid);
    workspace.nextNewTabId.set(nextId);
  },
  focusConfigTab: () => {
    const opened = workspace.tabs
      .get()
      .find(tab => tab.url === 'browser://config');
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
    const lastTabIndex = workspace.tabs.length - 1;
    const selectedTabId = workspace.selectedTabId.peek();
    const tabToDeleteIndex = workspace.tabs.findIndex(
      v => v.id.peek() === idToFind,
    );
    if (tabToDeleteIndex === -1) {
      console.error('no tab');
      return;
    }
    const tabToDelete = workspace.tabs[tabToDeleteIndex];
    const deletedTabData = tabToDelete.peek();
    if (deletedTabData === undefined) {
      console.error('tab data is missing');
      return;
    }
    const id = deletedTabData.id;
    workspace.closedTabs.push(deletedTabData);
    const isCurrentSelected = selectedTabId === id;
    if (isCurrentSelected) {
      const isTheLastTabInList = tabToDeleteIndex >= lastTabIndex;
      const toFocus = isTheLastTabInList
        ? workspace.tabs[tabToDeleteIndex - 1]
        : workspace.tabs[tabToDeleteIndex + 1];
      workspace.selectedTabId.set(toFocus.peek()?.id ?? 0);
    }
    tabToDelete.delete();
    const deletedLastTab = lastTabIndex === 0;
    if (deletedLastTab) {
      workspace.openNewTab();
    }
  },
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