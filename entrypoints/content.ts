import { storage } from "wxt/storage";
export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],

  main() {
    // ページがロードされたときにonPageLoad関数を呼び出す
    document.body.addEventListener("click", async (event) => {
      if (!event.cancelable) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.tagName !== "A") {
        return;
      }
      const currentUrl = window.location.href;
      const isGitHubUrl = currentUrl.includes("github.com");

      if (isGitHubUrl) {
        // 現在のページがGitHubの場合はスキップして元のページに飛ばす
        return;
      }
      event.preventDefault(); // デフォルトのリンク遷移を防止
      const href = target.getAttribute("href");
      const targetAttribute = target.getAttribute("target");
      const relAttribute = target.getAttribute("rel");
      const isBlankTarget =
        targetAttribute && targetAttribute.includes("_blank");
      const isNoopenerNoopener =
        relAttribute && relAttribute.includes("noopener");
      const isNoopenerNoreferrer =
        relAttribute && relAttribute.includes("noreferrer");
      let op = isNoopenerNoopener
        ? "noopener "
        : "" + isNoopenerNoreferrer
        ? "noreferrer"
        : "";
      op === "" ? undefined : op;

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
          if (!excludeList.includes(number)) {
            const newHref = href.replace(
              "https://github.com/nostr-protocol/nips/blob/master/",
              "https://github.com/nostr-jp/nips-ja/blob/main/"
            );

            window.open(newHref, isBlankTarget ? "_blank" : undefined, op); // 新しいタブで開く
          } else {
            //元のページに飛ばす
            window.open(href, isBlankTarget ? "_blank" : undefined, op); // 新しいタブで開く
          }
        } else if (href) {
          //元のページに飛ばす
          window.open(href, isBlankTarget ? "_blank" : undefined, op); // 新しいタブで開く
        }
      } else if (href) {
        //元のページに飛ばす
        window.open(href, isBlankTarget ? "_blank" : undefined, op); // 新しいタブで開く
      }
    });
  },
});
