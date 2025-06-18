<script lang="ts">
  import { setContext } from 'svelte';
  import type { App } from './base/app';

  export let app: App;

  export let resolves: Record<string, any>;

  setContext('app', app);
  setContext('currentUser', app.getState().currentUser);

  Object.keys(resolves).forEach(key => {
    setContext(key, resolves[key]);
  })
</script>

<slot />
