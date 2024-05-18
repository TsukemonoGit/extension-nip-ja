import { storage } from "wxt/storage";

export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],

  main() {
    async function modifyElement(target: Element) {
      const href = target.getAttribute("href");

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

    // すべてのリンクを処理
    function processLinks() {
      const links = document.querySelectorAll("a");
      links.forEach((link) => {
        modifyElement(link);
      });
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // 新しく追加された要素自体をチェック
            if (element.tagName === "A") {
              modifyElement(element);
            }
            // 追加された要素の子要素を再帰的にチェック
            element.querySelectorAll("a").forEach((link) => {
              modifyElement(link);
            });
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

      // ページの初期ロード時にすべてのリンクをチェック
      document.addEventListener("DOMContentLoaded", processLinks);
      // 初期ロード後もすぐにすべてのリンクをチェック
      processLinks();
    }
  },
});
