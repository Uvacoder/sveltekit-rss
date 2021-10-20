<script context="module" type="ts">
	import Parser from 'rss-parser/dist/rss-parser.js';

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
			const feedFetch = await fetch(`/feed.xml?feed=${feedParam}`);

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

<script type="ts">
	import { browser } from '$app/env';

	import FeedItem from '../components/FeedItem.svelte';

	export let feed;

	interface Fave {
		uri: string
		title: string
	}

	let favorites: Fave[] = browser ? JSON.parse(localStorage.getItem('recentRssFeeds') ||  '[]') : [];

	$: browser && localStorage.setItem('recentRssFeeds', JSON.stringify(favorites));

	$: {
		if (feed && browser) {
			const query = new URLSearchParams(location.search);
			const feedQuery = query.get('feed');

			const newFavorites = favorites.filter(({uri}) => uri !== feedQuery);

			newFavorites.unshift({uri: feedQuery, title: feed.title});

			favorites = newFavorites.slice(0, 9);
		}
	}
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
	{#if favorites.length}
		<h3>Recents</h3>
		<ul>
			{#each favorites as favorite}
				<li>
					<a href={`/?feed=${favorite.uri}`}>{favorite.title}</a>
				</li>
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
