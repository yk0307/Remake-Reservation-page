# Vercelプレビュー運用手順

1. `git checkout -b feat/preview-<slug>`
2. `public/data/hubs.json` の `default_slug` を対象スラッグへ変更。
3. `npm run lint && npm run test` を実行。
4. コミット (`feat(preview): default_slugを<slug>に変更`) してプッシュ。
5. VercelプレビューURLを共有し、`/slug/` 直リンクも確認。
6. 不要になったブランチはクローズする。
