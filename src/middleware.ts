import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((_context, next) => {
	const user = process.env.BASIC_AUTH_USER;
	const password = process.env.BASIC_AUTH_PASSWORD;

	// 環境変数が未設定の場合は認証をスキップ（ローカル初期セットアップ時に締め出されないようにする）
	if (!user || !password) {
		return next();
	}

	const authHeader = _context.request.headers.get('authorization');

	if (authHeader) {
		const [scheme, encoded] = authHeader.split(' ');
		if (scheme === 'Basic' && encoded) {
			const decoded = atob(encoded);
			const separatorIndex = decoded.indexOf(':');
			const inputUser = decoded.slice(0, separatorIndex);
			const inputPassword = decoded.slice(separatorIndex + 1);

			if (inputUser === user && inputPassword === password) {
				return next();
			}
		}
	}

	return new Response('Authentication required.', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic realm="Restricted", charset="UTF-8"',
		},
	});
});
