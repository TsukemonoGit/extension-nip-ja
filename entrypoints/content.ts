import { storage } from "wxt/storage";
export default defineContentScript({
  matches: ["<all_urls>"],
  exclude: ["*://*github*"],

  main() {
    console.log("Hello content.");

    // ページがロードされたときにonPageLoad関数を呼び出す
    document.body.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A") {
        const href = target.getAttribute("href");
        const targetAttribute = target.getAttribute("target");
        const relAttribute = target.getAttribute("rel");
        const isBlankTarget =
          targetAttribute && targetAttribute.includes("_blank");
        const isNoopenerNoopener =
          relAttribute && relAttribute.includes("noopener");
        const isNoopenerNoreferrer =
          relAttribute && relAttribute.includes("noreferrer");
        const numberMatch = href?.match(
          /https:\/\/github\.com\/nostr-protocol\/nips\/blob\/master\/(\d+)\.md/
        );
        if (href && numberMatch) {
          if (numberMatch) {
            const number = parseInt(numberMatch[1]);
            console.log(number);

            const excludeList: number[] =
              (await storage.getItem<number[]>("local:ExcludeList")) || [];

            console.log(excludeList);
            if (excludeList.includes(number)) {
              return;
            }
          }

          const newHref = href.replace(
            "https://github.com/nostr-protocol/nips/blob/master/",
            "https://github.com/nostr-jp/nips-ja/blob/main/"
          );
          let op = isNoopenerNoopener
            ? "noopener "
            : "" + isNoopenerNoreferrer
            ? "noreferrer"
            : "";
          op === "" ? undefined : op;

          event.preventDefault(); // デフォルトのリンク遷移を防止
          window.open(newHref, isBlankTarget ? "_blank" : undefined, op); // 新しいタブで開く
        }
      }
    });
  },
});
