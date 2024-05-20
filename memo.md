# firefox

- zip にする前に、build した firefox 用の manifest.json に以下を追加

```
  "browser_specific_settings": {
    "gecko": {
      "id": "{adc991bf-b4eb-4f90-8395-578928701606}",
      "strict_min_version": "57.0"
    }
  }
```

"id": <py newGuid.py で取得した ID>,

## 検証する

- Mozilla で https://addons.mozilla.org/ja/developers/addon/submit/upload-unlisted にログインして
  検証テストを行う

## 未検証のままアドオンをインストールする

(Developer Edition か Nightly でしか未検証アドオンはインストールできないらしい)

- アドレスバーに「about:config」と入力

- 検索欄に「xpinstall.signatures.required」と入力して「false」にする

- 取り扱いに注意する
