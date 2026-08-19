<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initBackgroundToggle } from '$lib/background';

  let { children } = $props();

  onMount(initBackgroundToggle);
</script>

{@render children()}
