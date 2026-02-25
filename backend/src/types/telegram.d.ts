export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: ThemeParams;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    bottomBarColor: string;
    isClosingConfirmationEnabled: boolean;
    isFullscreen: boolean;
    safeAreaInset: SafeAreaInset;
    contentSafeAreaInset: ContentSafeAreaInset;
    BackButton: BackButton;
    MainButton: BottomButton;
    SecondaryButton: BottomButton;
    SettingsButton: SettingsButton;
    HapticFeedback: HapticFeedback;
    CloudStorage: CloudStorage;
    LocationManager: LocationManager;

    ready(): void;
    expand(): void;
    close(): void;
    sendData(data: string): void;
    switchInlineQuery(query: string, chooseChatTypes?: string[]): void;
    openLink(url: string, options?: { try_instant_view?: boolean }): void;
    openTelegramLink(url: string): void;
    openInvoice(url: string, callback?: (status: string) => void): void;
    showPopup(params: PopupParams, callback?: (buttonId: string) => void): void;
    showAlert(message: string, callback?: () => void): void;
    showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
    showScanQrPopup(params: ScanQrPopupParams, callback?: (text: string) => boolean): void;
    closeScanQrPopup(): void;
    readTextFromClipboard(callback?: (text: string) => void): void;
    requestWriteAccess(callback?: (granted: boolean) => void): void;
    requestContact(callback?: (shared: boolean) => void): void;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    setBottomBarColor(color: string): void;
    enableClosingConfirmation(): void;
    disableClosingConfirmation(): void;
    requestFullscreen(): void;
    exitFullscreen(): void;
    onEvent(eventType: string, eventHandler: (...args: any[]) => void): void;
    offEvent(eventType: string, eventHandler: (...args: any[]) => void): void;
}

export interface WebAppInitData {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    chat?: WebAppChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date: number;
    hash: string;
    signature?: string;
}

export interface WebAppUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
}

export interface WebAppChat {
    id: number;
    type: string;
    title: string;
    username?: string;
    photo_url?: string;
}

export interface ThemeParams {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    header_bg_color?: string;
    bottom_bar_bg_color?: string;
    accent_text_color?: string;
    section_bg_color?: string;
    section_header_text_color?: string;
    section_separator_color?: string;
    subtitle_text_color?: string;
    destructive_text_color?: string;
}

export interface SafeAreaInset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ContentSafeAreaInset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface BackButton {
    isVisible: boolean;
    show(): BackButton;
    hide(): BackButton;
    onClick(callback: () => void): BackButton;
    offClick(callback: () => void): BackButton;
}

export interface BottomButton {
    type: 'main' | 'secondary';
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    hasShineEffect: boolean;
    position: string;
    isProgressVisible: boolean;
    setText(text: string): BottomButton;
    show(): BottomButton;
    hide(): BottomButton;
    enable(): BottomButton;
    disable(): BottomButton;
    showProgress(leaveActive?: boolean): BottomButton;
    hideProgress(): BottomButton;
    setParams(params: {
        text?: string;
        color?: string;
        text_color?: string;
        has_shine_effect?: boolean;
        position?: string;
        is_active?: boolean;
        is_visible?: boolean;
    }): BottomButton;
    onClick(callback: () => void): BottomButton;
    offClick(callback: () => void): BottomButton;
}

export interface SettingsButton {
    isVisible: boolean;
    show(): SettingsButton;
    hide(): SettingsButton;
    onClick(callback: () => void): SettingsButton;
    offClick(callback: () => void): SettingsButton;
}

export interface HapticFeedback {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): HapticFeedback;
    notificationOccurred(type: 'error' | 'success' | 'warning'): HapticFeedback;
    selectionChanged(): HapticFeedback;
}

export interface CloudStorage {
    setItem(key: string, value: string, callback?: (error: Error | null, success: boolean) => void): CloudStorage;
    getItem(key: string, callback?: (error: Error | null, value: string) => void): CloudStorage;
    getItems(keys: string[], callback?: (error: Error | null, values: Record<string, string>) => void): CloudStorage;
    removeItem(key: string, callback?: (error: Error | null, success: boolean) => void): CloudStorage;
    removeItems(keys: string[], callback?: (error: Error | null, success: boolean) => void): CloudStorage;
    getKeys(callback?: (error: Error | null, keys: string[]) => void): CloudStorage;
}

export interface LocationManager {
    isInited: boolean;
    isLocationAvailable: boolean;
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    init(callback?: () => void): LocationManager;
    getLocation(callback?: (data: LocationData | null) => void): LocationManager;
    openSettings(): LocationManager;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    altitude?: number;
    course?: number;
    speed?: number;
    horizontal_accuracy?: number;
    vertical_accuracy?: number;
    course_accuracy?: number;
    speed_accuracy?: number;
}

export interface PopupParams {
    title?: string;
    message: string;
    buttons?: PopupButton[];
}

export interface PopupButton {
    id?: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text?: string;
}

export interface ScanQrPopupParams {
    text?: string;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}
