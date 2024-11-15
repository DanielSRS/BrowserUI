export const BUTTON_ICON_SIZE = 16;
export const BUTTUN_SIZE = 36;
export const ICON_PADDING = (BUTTUN_SIZE - BUTTON_ICON_SIZE) / 2;
export const WINDOW_BORDER_SIZE = 6;
/**
 * When titlebar is hidden, its size seem to still be accoutable and
 * all flatlist seems to inherit some sort of padding
 */
export const TITLEBAR_SIZE = 21;

export const TABLIST_GAP = 3;

/**
 * When this value is used, sidebar is absolute positioned, so
 * its needed compensate right padding not being aplied with
 * WINDOW_BORDER_SIZE
 */
export const TABBAR_COLAPSED_WIDTH = BUTTUN_SIZE + WINDOW_BORDER_SIZE * 2;

export const DELAY_TO_OPEN_TABBAR = 150; // in milisseconds
