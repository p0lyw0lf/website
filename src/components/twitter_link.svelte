<script>
    import Link from './link.svelte';
    export let username;
</script>

<Link href="https://twitter.com/{username}">{`@${username}`}</Link>