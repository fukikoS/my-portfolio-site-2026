import {
	createClient,
	type MicroCMSImage,
	type MicroCMSListContent,
	type MicroCMSObjectContent,
} from 'microcms-js-sdk';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

export const isMicroCMSConfigured = Boolean(serviceDomain && apiKey);

const client = isMicroCMSConfigured
	? createClient({ serviceDomain, apiKey })
	: null;

type ProjectType = '案件実績' | '個人プロジェクト';

function sortByPublishedAtDesc(items: Project[]) {
	return [...items].sort((a, b) => {
		const timeA = new Date(a.publishedAt ?? a.revisedAt ?? a.createdAt).getTime();
		const timeB = new Date(b.publishedAt ?? b.revisedAt ?? b.createdAt).getTime();
		return timeB - timeA;
	});
}

/** 「projects」ブログを type で「案件実績」「個人プロジェクト」に振り分けた案件データ構造 */
export type Project = {
	project_name: string;
	site_url?: string;
	github?: string;
	site_image: MicroCMSImage;
	overview: string;
	// microCMS のセレクトフィールドは単一選択でも配列で返る
	type: ProjectType[];
	technologies: string[];
	responsibilities?: string;
	note?: string;
} & MicroCMSListContent;

async function getList(type: ProjectType): Promise<Project[]> {
	if (!client) return [];

	const { contents } = await client.getList<Project>({
		endpoint: 'projects',
		queries: { orders: '-publishedAt', limit: 100, filters: `type[contains]${type}` },
	});
	return sortByPublishedAtDesc(contents);
}

export function getWorks() {
	return getList('案件実績');
}

export function getProjects() {
	return getList('個人プロジェクト');
}

/** トップページに表示するプロフィール情報（オブジェクト形式API） */
export type Profile = {
	introduction: string;
	hobbies: string;
	skills: string;
	career_vision: string;
} & MicroCMSObjectContent;

export async function getProfile(): Promise<Profile | null> {
	if (!client) return null;

	return client.getObject<Profile>({ endpoint: 'profile' });
}
