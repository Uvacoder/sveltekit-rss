<script context="module" type="ts">
	import Parser from 'rss-parser/dist/rss-parser';

	interface IFeedItem {
		title: string;
		contentSnippet?: string;
		content: string;
		link: string;
	}

	interface IFeed {
		title: string;
		description: string;
		image?: {
			url: string;
		};
		items: IFeedItem[];
	}

	const parser = new Parser();
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch }): Promise<{ props: { feed?: IFeed } }> {
		let props = {};

		const feedParam = page.query.get('feed');

		if (feedParam) {
			const feedFetch = await fetch(feedParam);

			if (feedFetch.ok) {
				const feedXml = await feedFetch.text();
				const feed = await parser.parseString(feedXml);
				props = {
					feed
				};
			}
		}

		return { props };
	}
</script>

<script>
	import FeedItem from '../components/FeedItem.svelte';

	export let feed;
</script>

<h1>RSS Reader</h1>
<form method="get" action="/">
	<label>{'RSS Feed:'} <input type="text" name="feed" /></label>
	<button type="submit">{'Go'}</button>
</form>
<div>
	{#if feed}
		<a href="/">{'< Return Home'}</a>
		<h2>{feed.title}</h2>
		<h4>{feed.description}</h4>
		{#if feed.image}
			<img alt={`${feed.title} logo`} style="max-width: 600px;" src={feed.image.url} />
		{/if}

		<ul>
			{#each feed.items as item}
				<FeedItem {item} />
			{/each}
		</ul>
	{/if}
</div>

<style>
	h1,
	form,
	div {
		max-width: 800px;
		margin: 0 auto 2rem;
	}
</style>
