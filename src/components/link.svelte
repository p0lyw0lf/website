<script>
    // Usage: <link href="https://example.com">The Thing Inside The Link</link>
    // This is preferred over raw <a> tags for linking to external sites
    export let href;
</script>
<a {href} rel="noopener" target="_blank"><slot /></a>