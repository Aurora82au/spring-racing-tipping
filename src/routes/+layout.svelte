<script>
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
	import Header from './Header.svelte';
	import './styles.css';
	import './app.css';
	
	/** @type {import('./$types').LayoutData} */
	export let data;

    // Create a store and update it when necessary...
	const user = writable();
    $: user.set(data.user);

    // ...and add it to the context for child components to access
	setContext('user', user);
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	
</style>
