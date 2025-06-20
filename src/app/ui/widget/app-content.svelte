<svelte:options customElement="app-content" />

<script lang="ts">
  import { setContext, getContext } from 'svelte';
  import type { App } from '../base/app';
  
  export let svelteComponentTag: string | null = null;

  function getGlobalAttr<T>(key: string): T {
    const item = (window as any)[key];
    if (!item) throw new Error(key + ' context not found');
    return item;
  }

  function initContext(): void {
    const keys = [
      'app', 'modelApi', 'fileApi', 'modelApi', 'workshopApi',
      'modelFacade', 'fileFacade', 'modelFacade', 'workshopFacade',
    ];
    keys.forEach(key => setContext(key, getGlobalAttr(key)))
  }

  initContext();
  const app = getContext<App>('app');

  $: componentPromise = (() => {
    if (!svelteComponentTag || !app?.router) return null;
    
    const component = app.router.findComponentByTag(svelteComponentTag);
    
    if (component?.loader) {
      return component.loader();
    }
    return Promise.resolve({ default: component });
  })();
</script>

{#if componentPromise}
  {#await componentPromise}
    <sl-spinner>Загрузка компонента...</sl-spinner>
  {:then module}
    {#if module?.default}
      <svelte:component this={module.default} />
    {:else}
      <p style="color: red;">Некорректный формат компонента</p>
    {/if}
  {:catch error}
    {app.error('Не удалось загрузить компонент', { error, tag: svelteComponentTag })}
    <p style="color: red;">Не удалось загрузить компонент: {error.message}</p>
  {/await}
{:else}
  <slot />
{/if}

<style>
  :host { 
    display: block; 
    width: 100%; 
  }
</style>
