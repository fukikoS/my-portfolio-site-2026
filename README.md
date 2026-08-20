# FS Portfolio Site

Astro + microCMS + Vercel を使ったポートフォリオサイトです。トップページにプロフィール、制作実績、個人プロジェクトを表示し、案件の詳細はモーダルで確認できます。

## 概要

- トップページで「About」「Skills」「Projects」「Works」を表示
- microCMS からコンテンツを取得して一覧と詳細を表示
- Vercel 向けのサーバー出力設定でデプロイ
- 全体に Basic 認証を適用可能

## プロジェクト構成

```text
/
├── .env.example               # 環境変数テンプレート
├── astro.config.mjs           # Astro設定（server output + Vercel adapter）
├── package.json               # npm scripts / dependencies
├── public/                    # 静的アセット
├── src/
│   ├── assets/                # 画像などの静的ファイル
│   ├── components/
│   │   ├── CaseGrid.astro     # 案件一覧カード
│   │   ├── CaseModal.astro    # 詳細モーダル
│   │   ├── Footer.astro       # フッター
│   │   ├── Header.astro       # ヘッダー / ナビゲーション
│   │   └── ScrollToTop.astro  # 画面上部に戻るボタン
│   ├── constants.ts           # サイト名などの定数
│   ├── layouts/
│   │   └── Layout.astro       # 共通レイアウト
│   ├── lib/
│   │   └── microcms.ts        # microCMS クライアントと型定義
│   ├── middleware.ts          # Basic 認証ミドルウェア
│   ├── pages/
│   │   └── index.astro        # トップページ
│   ├── scripts/
│   │   ├── scrollToTop.ts     # トップへ戻る実装
│   │   └── smoothAnchorNav.ts # スムーススクロール補助
│   ├── styles/
│   │   └── global.css         # 共通スタイル
│   └──
├── tsconfig.json
├── vercel.json
├── README.md
└── package-lock.json
```

## 必要環境

- Node.js 22.x
- npm

## セットアップ

```bash
npm install
cp .env.example .env
npm run dev
```

ローカル開発サーバーは通常 `http://localhost:4321` で起動します。

## 環境変数

`.env.example` を元に `.env` を作成し、必要な値を設定します。

```bash
cp .env.example .env
```

| 変数名 | 必須 | 説明 |
| :--- | :--- | :--- |
| `MICROCMS_SERVICE_DOMAIN` | 必須 | microCMS のサービスドメイン |
| `MICROCMS_API_KEY` | 必須 | microCMS の API キー |
| `BASIC_AUTH_USER` | 任意 | Basic 認証のユーザー名。未設定時は認証をスキップ |
| `BASIC_AUTH_PASSWORD` | 任意 | Basic 認証のパスワード |

Vercelへデプロイする場合は、Project Settings > Environment Variables に同じ値を登録する。

## microCMS の利用方法

本サイトは microCMS の `projects` と `profile` を利用しています。

### `projects` のフィールド

`type` フィールドで掲載区分を分けており、`案件実績` と `個人プロジェクト` の両方を同じ API に保存します。

| フィールドID | 型 | 説明 |
| :--- | :--- | :--- |
| `project_name` | テキストフィールド | 作品名 / 案件名 |
| `site_url` | テキストフィールド（任意） | 公開URL |
| `github` | テキストフィールド（任意） | GitHub URL |
| `site_image` | 画像 | サムネイル・詳細画像 |
| `overview` | テキストエリア | 概要 |
| `type` | セレクトフィールド | `案件実績` / `個人プロジェクト` |
| `technologies` | セレクトフィールド（複数選択可） | 使用技術 |
| `responsibilities` | テキストフィールド（任意） | 担当領域 |
| `note` | テキストエリア（任意） | 補足メモ |

`src/lib/microcms.ts` では `type[contains]${type}` の `filters` で対象を絞り込み、`getWorks()` と `getProjects()` に分けて表示しています。

### `profile` のフィールド

プロフィール情報は `profile` というオブジェクト形式 API から取得します。

| フィールドID | 型 | 説明 |
| :--- | :--- | :--- |
| `introduction` | テキストエリア | 自己紹介 |
| `hobbies` | テキストエリア | 趣味 |
| `skills` | テキストエリア | スキル一覧 |
| `career_vision` | テキストエリア | キャリアビジョン |

## 利用コマンド

| Command | 説明 |
| :--- | :--- |
| `npm install` | 依存関係をインストール |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを実行 |
| `npm run preview` | ビルド済みサイトをローカルで確認 |
| `npm run astro -- --help` | Astro CLI のヘルプを表示 |

## Basic 認証について

`src/middleware.ts` で全リクエストを検証しています。`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` が未設定の場合は認証をスキップするため、ローカル開発では簡単に確認できます。一方で、本番公開前に必ず認証用の値を設定してください。

## デプロイ

このプロジェクトはVercel向けに設定されており、`astro.config.mjs` で `output: 'server'` と `@astrojs/vercel` を使用しています。
