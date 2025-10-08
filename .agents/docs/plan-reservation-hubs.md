# 予約ハブページ整備計画

## 目的
静的SPAでhub設定を表示し、スラッグ単位でVercelプレビューを確認できる体制を整える。

## スコープ
- `public/data/hubs.json` をSSOT化しUI共通値を保持。
- `index.html`+`app.js` でスラッグ解決・テーマ反映・エラー処理を行う。
- `vercel.json` のcatch-allで `/slug/` アクセスを `index.html` へ誘導。
- lint/testで設定と出力ファイルの整合性を担保。

## タスクリスト
1. データとスタイルの初期整備。
2. `app.js` 実装（テーマ・slug・fallback）。
3. `index.html` をSPAエントリ化。
4. `vercel.json` と lint/test スクリプトを追加。
5. `session.md`・運用ドキュメント更新。

## テスト
`npm run lint` で設定妥当性を、`npm run test` で default_slug と必須ファイルを確認。

## ブランチ運用
`feat/preview-<slug>` で `public/data/hubs.json` の `default_slug` を切替え、`npm run lint && npm run test` 後にプレビューURLを共有。

## リスク
JSON手編集とルーティング変更の漏れに注意し、スクリプト実行で検知する。
