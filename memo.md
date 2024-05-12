# firefox

- zip にする前に、build した firefox 用の manifest.json に以下を追加

```
  "browser_specific_settings": {
    "gecko": {
      "id": <py newGuid.pyで取得したID>,
      "strict_min_version": "48.0"
    }
  }

```

## 検証する

- Mozilla で https://addons.mozilla.org/ja/developers/addon/submit/upload-unlisted にログインして
  検証テストを行う

## 未検証のままアドオンをインストールする

(Developer Edition か Nightly でしか未検証アドオンはインストールできないらしい)

- zip にする前に、build した firefox 用の manifest.json に以下を追加

```
  "browser_specific_settings": {
    "gecko": {
      "id": "addon@example.com",
      "strict_min_version": "48.0"
    }
  }

```

- 未検証のアドオンをインストールするために
- アドレスバーに「about:config」と入力

- 検索欄に「xpinstall.signatures.required」と入力して「false」にする

- 取り扱いに注意する
