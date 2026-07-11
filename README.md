# Portfolio Site

制作実績（Works）と個人プロジェクト（Projects）を掲載するポートフォリオサイトです。案件詳細は [microCMS](https://microcms.io/) から取得し、モーダルで表示します。サイト全体は Basic 認証で保護されています。

## 🚀 Project Structure

```text
/
├── public/
├── src
│   ├── components
│   │   ├── Header.astro       # 共通ヘッダー・ナビゲーション
│   │   ├── CaseGrid.astro     # 一覧カード + モーダル用テンプレート
│   │   └── CaseModal.astro    # 案件詳細モーダル本体
│   ├── layouts
│   │   └── Layout.astro       # 共通レイアウト
│   ├── lib
│   │   └── microcms.ts        # microCMS クライアント・型定義
│   ├── styles
│   │   └── global.css
│   ├── middleware.ts          # サイト全体の Basic 認証
│   └── pages
│       ├── index.astro        # トップページ
│       ├── works.astro        # 制作実績一覧
│       └── projects.astro     # 個人プロジェクト一覧
└── package.json
```

## 環境変数

`.env.example` をコピーして `.env` を作成し、値を設定してください。

```sh
cp .env.example .env
```

| 変数名                    | 説明                                                          |
| :------------------------- | :------------------------------------------------------------ |
| `MICROCMS_SERVICE_DOMAIN`  | microCMS のサービスドメイン                                   |
| `MICROCMS_API_KEY`         | microCMS の API キー                                           |
| `BASIC_AUTH_USER`          | サイト全体の Basic 認証ユーザー名（未設定時は認証をスキップ） |
| `BASIC_AUTH_PASSWORD`      | サイト全体の Basic 認証パスワード                              |

デプロイ先（Vercel）でも同じ環境変数を Project Settings > Environment Variables に設定してください。

### microCMS のスキーマ

`projects` という単一のAPI（リスト形式）に、制作実績・個人プロジェクトの両方を登録します。`type` フィールドの値で振り分けます。

| フィールドID       | 型                             | 説明                               |
| :------------------ | :------------------------------ | :---------------------------------- |
| `project_name`      | テキストフィールド              | 案件名                              |
| `site_url`          | テキストフィールド（任意・URL） | サイトURL                           |
| `site_image`        | 画像                             | サムネイル・詳細用の画像            |
| `overview`          | テキストエリア                  | 概要（一覧カード・詳細モーダル共通） |
| `type`              | セレクトフィールド              | `案件実績` / `個人プロジェクト`      |
| `technologies`      | セレクトフィールド（複数選択可） | 使用技術                            |
| `responsibilities`  | テキストフィールド（任意）       | 担当領域                            |
| `note`               | テキストエリア（任意）          | 備考                                |

`works` ページは `type` が `案件実績`、`projects` ページは `個人プロジェクト` のコンテンツのみを `filters` クエリで絞り込んで表示します（[src/lib/microcms.ts](src/lib/microcms.ts)）。フィールドIDや選択肢のラベルを変更した場合は同ファイルの `Project` 型と `getList` の `filters` を合わせて調整してください。

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`              | Installs dependencies                            |
| `npm run dev`               | Starts local dev server at `localhost:4321`      |
| `npm run build`             | Build your production site to `./dist/`          |
| `npm run preview`           | Preview your build locally, before deploying     |
| `npm run astro ...`         | Run CLI commands like `astro add`, `astro check` |

## Basic 認証について

`src/middleware.ts` で全リクエストを検証しています。`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` が未設定の場合は認証をスキップするため、ローカル開発では `.env` を空のままにしても閲覧できます。本番公開前に必ず値を設定してください。
