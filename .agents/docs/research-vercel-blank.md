# 調査: Vercelプレビューで画面が空白になる

## 事象
- プレビューURLにアクセスすると何も表示されない。
- DevTools(MCP)でアクセスしたところ、対象URLはログイン画面にリダイレクトされ可視データ取得は不可（プライベート設定の可能性）。

## 推測原因
- `vercel.json` の `routes` が `/(.*)` で全パスを `index.html` にリライトしており、`/app.js` や `/styles.css` といった静的アセットも `index.html` へ書き換わる。
- その結果、JSが読み込まれずSPAが描画されない（空白に見える）。

## 対応
- `vercel.json` に `{ "handle": "filesystem" }` を追加し、静的アセットを先に配信させるよう修正。
- 同修正を `develop` および各プレビューブランチに反映。

## 変更
- コミット: fix(vercel): SPAのcatch-allが静的アセットを上書きしないようfilesystemハンドラを追加
- 反映ブランチ: develop / feat/preview-remake / feat/preview-ichibanboshi / feat/preview-moteiku / feat/preview-mabi / feat/preview-kuroashi

## 期待結果
- プレビューURLにアクセス時、`/app.js` と `/.css` が正しく200で配信され、SPAが描画される。

