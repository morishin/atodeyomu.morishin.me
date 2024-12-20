import { Window } from "happy-dom";

type PageInfo = {
  title: string | null;
  description: string | null;
  image: string | null;
};

const PageInfo = {
  fetch: async (url: string) => {
    let nextUrl: string = url;
    let html: string | null = null;
    let cookies: string[] = [];
    const redirectLimit = 20;
    for (
      let redirectCount = 0;
      redirectCount < redirectLimit;
      redirectCount++
    ) {
      const res = await fetch(nextUrl, {
        headers: { Accept: "text/html", Cookie: cookies.join("; ") },
        redirect: "manual", // To follow redirects with cookies
      });
      if (res.redirected || (res.status >= 300 && res.status < 400)) {
        nextUrl = res.url;
        cookies = res.headers.getSetCookie();
      } else {
        html = await res.text();
        break;
      }
    }
    if (!html) {
      throw new Error("Failed to fetch HTML");
    }

    const happyDOMWindow = new Window({
      url,
      settings: {
        disableComputedStyleRendering: true,
        disableCSSFileLoading: true,
        disableJavaScriptEvaluation: true,
        disableJavaScriptFileLoading: true,
      },
    });
    happyDOMWindow.document.write(html);

    const getMetaContent = (key: string, value: string): string | null =>
      happyDOMWindow.document.head
        .querySelector(`meta[${key}="${value}"]`)
        ?.getAttribute("content") ?? null;

    const title =
      happyDOMWindow.document.head.querySelector("title")?.textContent ??
      getMetaContent("property", "og:title");
    const description =
      getMetaContent("name", "description") ??
      getMetaContent("property", "og:description");

    const absoluteIconImageUrl = (
      baseUrl: string,
      targetUrl: string | undefined
    ) => {
      if (!targetUrl) return null;
      return new URL(targetUrl, baseUrl).href;
    };

    const image =
      absoluteIconImageUrl(
        url,
        happyDOMWindow.document
          .querySelector('link[rel="icon"]')
          ?.getAttribute("href")
      ) ?? getMetaContent("property", "og:image");

    await happyDOMWindow.happyDOM.close();

    return {
      title,
      description,
      image,
    };
  },
};

export { PageInfo };
