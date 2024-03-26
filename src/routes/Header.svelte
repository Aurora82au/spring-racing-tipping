<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import horseLogo from '$lib/images/horse.png';

	const loggedIn = false;
	const selectedCompetition = {
		name: 'Dave Test Comp'
	};
</script>


<header>
	{#if loggedIn}
		<TopMenu
			path={path}
			user={user}
			competitions={competitions}
			selectedCompetition={selectedCompetition}
			handleCompetitionSelect={handleCompetitionSelect}
			isAdmin={isAdmin}
		/>
		<img class="profile-pic" src={'pics/' + user.image} alt="profile-pic" title={`${user.name.first} ${user.name.last}`} />
		<button class="reload-btn" title="Reload data" on:click={onReloadData}>
			<span class="icon-reload" />
		</button>
	{/if}

	<h2>
		Spring Racing Tipping <img src={horseLogo} alt="Title logo" />
		<span class="beta">BETA</span>
	</h2>

	{#if loggedIn}
		<span class="comp-name">{selectedCompetition.name}</span>
	{/if}



	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
				<a href="/sverdle">Sverdle</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a href="https://github.com/sveltejs/kit">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	
</style>
