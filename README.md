# WXT + SolidJS

This template should help get you started developing with SolidJS in WXT.

---

## extension-nips-ja

ブラウザ中の NOSTR の本家 NIP へのリンク( https://github.com/nostr-protocol/nips )を Nostr Japan の NIP 翻訳リンク( https://github.com/nostr-jp/nips-ja/ )に飛ばすブラウザ拡張機能

zip を解凍してパッケージ化されていない拡張機能を読み込むで
解凍したフォルダを選択

日本語化されていないものなど、ja に飛んでほしくないものは
拡張機能のアイコンクリックして NIP 番号をいれる

firefox では読み込めないﾅｧ

#### firefox (Developer Edition か Nightly でしか未検証アドオンはインストールできないらしい)

- zip にする前に、build した firefox 用の manifest.json に

````
  "browser_specific_settings": {
    "gecko": {
      "id": "addon@example.com",
      "strict_min_version": "42.0"
    }
  }```
  を追加

-
- 未検証のアドオンをインストールするために
- アドレスバーに「about:config」と入力

- 検索欄に「xpinstall.signatures.required」と入力して「false」にする

````

- 取り扱いに注意する
