import { storage } from "wxt/storage";
export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],

  main() {
    async function modifyElement(target: Element) {
      const href = target.getAttribute("href"); // ここで要素の内容を変更

      const numberMatch = href?.match(
        /https:\/\/github\.com\/nostr-protocol\/nips\/blob\/master\/(\d+)\.md/
      );
      if (href && numberMatch) {
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
          target.setAttribute("href", newHref);
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Node.ELEMENT_NODE
            const targetElement = (node as Element).querySelector("A");
            if (targetElement) {
              modifyElement(targetElement);
            }
          }
        });
      });
    });

    const currentUrl = window.location.href;
    const isGitHubUrl = currentUrl.includes("github.com");

    if (!isGitHubUrl) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // ページの初期ロード時にもチェック
      document.addEventListener("DOMContentLoaded", () => {
        const targetElement = document.querySelector("A");
        if (targetElement) {
          modifyElement(targetElement);
        }
      });
    }
  },
});
