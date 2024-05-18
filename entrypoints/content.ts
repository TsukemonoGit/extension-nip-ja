import { storage } from "wxt/storage";

export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],

  main() {
    // 指定された要素の href 属性を変更する関数
    async function modifyElement(target: Element) {
      const href = target.getAttribute("href");

      // GitHubの特定のパターンに一致するリンクを探す
      const numberMatch = href?.match(
        /https:\/\/github\.com\/nostr-protocol\/nips\/blob\/master\/(\d+)\.md/
      );

      if (href && numberMatch) {
        const number = parseInt(numberMatch[1]);
        console.log(number);

        // ストレージから除外リストを取得
        const excludeList: number[] =
          (await storage.getItem<number[]>("local:ExcludeList")) || [];

        console.log(excludeList);

        // 除外リストに含まれていない場合にリンクを変更
        if (!excludeList.includes(number)) {
          const newHref = href.replace(
            "https://github.com/nostr-protocol/nips/blob/master/",
            "https://github.com/nostr-jp/nips-ja/blob/main/"
          );
          target.setAttribute("href", newHref);
        }
      }
    }

    // ページ内のすべてのリンクを処理する関数
    function processLinks() {
      const links = document.querySelectorAll("a");
      links.forEach((link) => {
        modifyElement(link);
      });
    }

    // MutationObserverを使用してDOMの変更を監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // 追加された要素がアンカータグの場合に変更
            if (element.tagName === "A") {
              modifyElement(element);
            }
            // 追加された要素の子要素も再帰的にチェック
            element.querySelectorAll("a").forEach((link) => {
              modifyElement(link);
            });
          }
        });
      });
    });

    // 現在のURLを取得し、GitHubのページかどうかを確認
    const currentUrl = window.location.href;
    const isGitHubUrl = currentUrl.includes("github.com");

    if (!isGitHubUrl) {
      // GitHub以外のページの場合にMutationObserverを開始
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // ページの初期ロード時にすべてのリンクを処理
      document.addEventListener("DOMContentLoaded", processLinks);
      // 初期ロード後もすぐにすべてのリンクを処理
      processLinks();
    }
  },
});
