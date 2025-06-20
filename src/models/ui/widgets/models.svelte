<svelte:options customElement="model-list"/>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { ModelAttrs } from '#models/domain/struct/attrs';
  import ModelCard from './model-card.svelte';
  
  let { models } = $props<{
    models: ModelAttrs[];
  }>();
  
  import { getContext } from 'svelte';
  import { App } from '#app/ui/base/app';
  import { ModelsBackendApi } from '../models-api';
  const app = getContext<App>('app');
  const modelApi = getContext<ModelsBackendApi>('modelApi');

  onMount(async () => {
    const result = await modelApi.getModels();
    if (result.isFailure()) {
      app.error('Не удалось загрузить модели. Попробуйте позже.', { details: { result: result.value } });
      return;
    }
    models = result.value;
  });
</script>

<style>
  :host {
    display: block;
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .grid {
    display: grid;
    gap: 16px;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  @media (min-width: 1150px) {
    .grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (min-width: 900px) and (max-width: 1149px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 650px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  model-card {
    width: 100%;
    min-width: 0;
  }
</style>

<div class="grid">
  {#each models as model}
    <ModelCard {model} />
  {/each}
</div>
