<script>
	export let item;

	let contentSnippet;
	let showAllContent = false;

	$: contentSnippet = (item?.contentSnippet || '').split('\n')[0];
</script>

<li>
	<h3>{item.title}</h3>
	<p>
		{#if contentSnippet !== item.content}
			<button on:click|preventDefault={() => (showAllContent = !showAllContent)}
				>{showAllContent ? 'Read Less' : 'Read More'}</button
			>
			{' | '}
		{/if}
		<a href={item.link} target="_blank">{'Open Link'}</a>
	</p>
	{#if showAllContent}
		<p>{@html item.content || ''}</p>
	{/if}
	{#if !showAllContent}
		<p>{showAllContent ? item.contentSnippet : contentSnippet}</p>
	{/if}
</li>

<style>
	p:nth-child(n + 1) {
		padding-left: 2rem;
		border-left: 2px solid #333;
	}
</style>
