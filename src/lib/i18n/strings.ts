import { Locale } from "@/lib/i18n/locale";

const strings = {
  "ato de yomu": {
    ja: "あとで読む",
  },
  "Save web pages to read later, track your reading history, and share your lists—or keep them private.":
    {
      ja: "あとで読みたいウェブページを保存して未読管理したりリストを共有することができるリーディングリストアプリ",
    },
  "Get Started": {
    ja: "はじめる",
  },
  "See Example": {
    ja: "例を見る",
  },
  Unread: {
    ja: "未読",
  },
  Read: {
    ja: "既読",
  },
  "Mark all as read": {
    ja: "すべて既読にする",
  },
  Home: {
    ja: "ホーム",
  },
  Login: {
    ja: "ログイン",
  },
  "Are you sure you want to mark all as read?": {
    ja: "すべて既読にしますか？",
  },
  "You can subscribe to the list as RSS feed.": {
    ja: "このリストをRSSフィードとして購読できます。",
  },
  "Load More": {
    ja: "さらに読み込む",
  },
  "Marked as unread": {
    ja: "未読にしました",
  },
  "Marked as read": {
    ja: "既読にしました",
  },
  "Added to your unread": {
    ja: "未読に追加しました",
  },
  "Mark as unread": {
    ja: "未読にする",
  },
  "Mark as read": {
    ja: "既読にする",
  },
  "Are you sure to delete this page?": {
    ja: "このページを削除しますか？",
  },
  "Add to your unread": {
    ja: "自分の未読に追加",
  },
  "Add to unread": {
    ja: "未読に追加",
  },
  Add: {
    ja: "追加",
  },
  "Username updated": {
    ja: "ユーザー名を更新しました",
  },
  "Profile picture updated": {
    ja: "プロフィール画像を更新しました",
  },
  "Edit Profile": {
    ja: "プロフィールを編集",
  },
  "Are you sure to update username?": {
    ja: "本当にユーザー名を変更しますか？",
  },
  Username: {
    ja: "ユーザー名",
  },
  "Save Username": {
    ja: "ユーザー名を保存",
  },
  Picture: {
    ja: "プロフィール画像",
  },
  "Save Picture": {
    ja: "プロフィール画像を保存",
  },
  "API Usage": {
    ja: "APIの使い方",
  },
  Logout: {
    ja: "ログアウト",
  },
  "{{username}}'s reads": {
    ja: "{{username}}の既読",
  },
  "{{username}}'s unreads": {
    ja: "{{username}}の未読",
  },
  "Cancel creating account": {
    ja: "アカウントの作成をやめる",
  },
  "This name is already taken.": {
    ja: "このユーザー名は既に使われています。",
  },
  Welcome: {
    ja: "初期設定",
  },
  "Choose your username": {
    ja: "ユーザー名を決める",
  },
  "Marked all as read": {
    ja: "すべて既読にしました",
  },
  "No pages have been added yet.": {
    ja: "まだページが追加されていません",
  },
  "All done!": {
    ja: "未読はありません",
  },
  Private: {
    ja: "非公開",
  },
  Public: {
    ja: "公開",
  },
  private: {
    ja: "非公開",
  },
  public: {
    ja: "公開",
  },
  "Change visibility": {
    ja: "公開設定を変更",
  },
  "This page is currently {{visibility}}.": {
    ja: "このページは現在「{{visibility}}」です。",
  },
  "Make {{visibility}}": {
    ja: "{{visibility}}にする",
  },
  Cancel: {
    ja: "キャンセル",
  },
  "You can also add pages to the list via API.": {
    ja: "APIを使ってページを追加することもできます。",
  },
  "Your Access Token": {
    ja: "アクセストークン",
  },
  "Are you sure you want to rotate the access token? This will invalidate the current access token.":
    {
      ja: "アクセストークンを再生成しますか？現在のアクセストークンは無効になります。",
    },
  "Add a page via cURL": {
    ja: "cURLでページを追加",
  },
  "You can add a page from the share sheet by using iOS Shortcuts.": {
    ja: "iOSのショートカットを使ってページを追加することもできます。",
  },
  "Download the shortcut.": {
    ja: "ショートカットをダウンロード",
  },
  Download: {
    ja: "ダウンロード",
  },
  "Setup the shortcut": {
    ja: "ショートカットを設定",
  },
  "Available in the share sheet opened from Safari.": {
    ja: "Safariの共有シートから利用できます。",
  },
  "Add a page via Android share menu": {
    ja: "Androidの共有メニューからページを追加",
  },
  "You can add a page from the share menu.": {
    ja: "共有メニューからページを追加できます。",
  },
  "Add to Home screen. (Install it as PWA)": {
    ja: "ホーム画面に追加（PWAとしてインストール）",
  },
  "Available in the share menu from browser.": {
    ja: "ブラウザの共有メニューから利用できます。",
  },
  "Add a page via Chrome Extension": {
    ja: "Chrome拡張機能からページを追加",
  },
  "You can add a page by using a Chrome Extension.": {
    ja: "Chrome拡張機能を使ってページを追加できます。",
  },
  "Download the Chrome Extension.": {
    ja: "Chrome拡張機能をダウンロード",
  },
  "Setup the extension": {
    ja: "拡張機能を設定",
  },
  "Click the extension button on the page you want to add.": {
    ja: "追加したいページで拡張機能ボタンをクリックします。",
  },
  "Add a page via Alfred Workflow": {
    ja: "Alfred Workflow からページを追加",
  },
  "You can add a page by using Alfred Workflow.": {
    ja: "Alfred Workflow を使ってページを追加できます。",
  },
  "Download the Alfred Workflow.": {
    ja: "Alfred Workflow をダウンロード",
  },
  "Setup the workflow": {
    ja: "ワークフローを設定",
  },
  "Run the workflow with the URL you want to add.": {
    ja: "追加したいページのURLを入力してワークフローを実行します。",
  },
};

export const i18n = (key: keyof typeof strings, locale: Locale) => {
  if (locale === "default") {
    return key;
  }
  const localized = strings[key][locale];
  if (!localized) {
    return key;
  }
  return localized;
};
