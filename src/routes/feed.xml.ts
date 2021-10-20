import fetch from 'isomorphic-unfetch';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	const feedParam = query.get('feed');
	const feedFetch = await fetch(feedParam);

	if (feedFetch.ok) {
		const feedXml = await feedFetch.text();

		return {
			body: feedXml
		}
	}

	return {
		status: feedFetch.status
	}
}
