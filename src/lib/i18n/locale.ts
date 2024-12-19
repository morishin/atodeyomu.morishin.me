import { headers } from "next/headers";

export type Locale = "default" | "ja";

// Use it in server contexts
export const locale = () => {
  // 検索エンジンには日本語のコンテンツを返したいが、ユーザーにはユーザーの使用言語に応じたコンテンツを返したい。

  const acceptLanguage = headers().get("accept-language");
  if (!acceptLanguage) {
    // Google クローラーは Accept-Language ヘッダーを送信しないため、クローラーの場合は日本語を返す。
    return "ja";
  }

  // ユーザーの使用言語が日本語の場合は日本語を返す。
  const [primary] = acceptLanguage.split(",");
  if (primary.startsWith("ja")) {
    return "ja";
  }

  // ユーザーの使用言語が日本語以外の場合はデフォルトの言語(英語)を返す。
  return "default";
};
