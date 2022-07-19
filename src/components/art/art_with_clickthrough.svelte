<script>
  import TwitterLink from '../twitter_link.svelte';

  export let src;
  export let artist;
</script>

<p>
  {#if artist }Comm by <TwitterLink username={artist} />. {/if}<a href={src.src}>Click Through To See</a>
  <slot />
</p>