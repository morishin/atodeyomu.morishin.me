import { Window } from "happy-dom";

type PageInfo = {
  title: string | null;
  description: string | null;
  image: string | null;
};

const PageInfo = {
  fetch: async (url: string) => {
    const html = await fetch(url, { headers: { Accept: "text/html" } }).then(
      (res) => res.text()
    );

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
    null;

    await happyDOMWindow.happyDOM.close();

    return {
      title,
      description,
      image,
    };
  },
};

export { PageInfo };
