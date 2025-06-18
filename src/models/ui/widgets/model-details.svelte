<svelte:options customElement="model-details"/>

<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import ModelImages from '../entity/model-images.svelte';
  import type { ModelAttrs } from '#models/domain/struct/attrs';
  import { ModelPolicy } from '#models/domain/policy';
  import { App } from '#app/ui/base/app';
  import { ModelsBackendApi } from '#models/ui/models-api';

  const REORDER_DEBAUNCE = 3000;

  const app = (window as any).app as App;
  const modelApi = (window as any).modelApi as ModelsBackendApi;
  setContext('app', app);
  setContext('modelApi', modelApi);
  setContext('fileFacade', (window as any).fileFacade);

  export let modelId: string = app.router.getParams().modelId;

  let model: ModelAttrs | null = null;
  let canEdit = false;
  let reorderTimeout: number | null = null;
  let pendingReorder: string[] | null = null;

  async function loadModel() {
    const result = await modelApi.getModel(modelId);
    if (result.isFailure()) {
      app.error('Не удалось загрузить модель', { result, modelId });
      return;
    }
    model = result.value;
    canEdit = new ModelPolicy(app.getState().currentUser).canEdit(model);
  }

  async function handleAddImages(event: CustomEvent<string[]>) {
    const result = await modelApi.addModelImages(modelId, event.detail);
    if (result.isFailure()) {
      app.error('Ошибка обновления модели с новыми изображениями', { result, ids: event.detail });
    } else {
      model.imageIds = [...model.imageIds, ...event.detail];
    }
  }

  async function handleRemoveImage(event: CustomEvent<string>) {
    const result = await modelApi.deleteImage(modelId, event.detail);
    if (result.isFailure()) {
      app.error('Ошибка удаления изображения', { result, id: event.detail });
    } else {
      model.imageIds = model.imageIds.filter(id => id !== event.detail);
    }
  }

  function handleReorderImages(event: CustomEvent<string[]>) {
    // Отменяем предыдущий таймаут, если он есть
    if (reorderTimeout) {
      clearTimeout(reorderTimeout);
    }
    
    // Сохраняем новый порядок
    pendingReorder = event.detail;
    
    // Устанавливаем таймаут на 1 секунду
    reorderTimeout = setTimeout(async () => {
      try {
        const result = await modelApi.reorderModelImages(modelId, pendingReorder);
        if (result.isFailure()) {
          app.error('Ошибка изменения порядка изображений', { result, ids: pendingReorder });
        } else {
          model.imageIds = [...pendingReorder];
        }
      } finally {
        reorderTimeout = null;
        pendingReorder = null;
      }
    }, REORDER_DEBAUNCE) as unknown as number;
  }

  onMount(() => {
    loadModel();
    
    return () => {
      // Очищаем таймаут при размонтировании
      if (reorderTimeout) {
        clearTimeout(reorderTimeout);
      }
    };
  });
</script>

<style>
  :global(.model-details) {
    max-width: 800px;
    margin: 16px auto;
    padding: 24px;
    display: block;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 1.8rem;
    font-weight: 700;
  }

  .main-section {
    margin-bottom: 2rem;
  }

  .description {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .middle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .column h4 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  ul {
    padding-left: 1.2rem;
    margin: 0;
  }

  li {
    margin-bottom: 0.25rem;
  }
</style>

{#if !model}
  <sl-spinner label="Загрузка..." style="width:48px; height:48px;"></sl-spinner>
{:else}
  <div class="model-details">
    <div class="header">
      <h1 class="title">{model.title}</h1>
    </div>

    <ModelImages
      imageIds={model.imageIds}
      canEdit={canEdit}
      on:addImages={handleAddImages}
      on:deleteImage={handleRemoveImage}
      on:reorderImages={handleReorderImages}
    />

    <div class="main-section">
      <p class="description">{model.description}</p>
      <div class="middle">
        <div>
          <strong>Категория:</strong>
          {#each model.categories as cat}
            <sl-tag size="small" variant="primary">{cat}</sl-tag>
          {/each}
          <strong>Уровень:</strong>
          <sl-tag size="small" variant="warning">{model.difficultyLevel}</sl-tag>
        </div>
        <div>
          <strong>Время изготовления:</strong>
          <sl-tag size="small" variant="neutral">{model.estimatedTime}</sl-tag>
          <strong>Цена за доступ:</strong>
          <sl-tag size="small" variant="success">{model.pricePerAccess} ₸</sl-tag>
        </div>
      </div>

      <div class="bottom">
        <div class="column">
          <h4>Инструменты</h4>
          <ul>
            {#each model.toolsRequired as t}<li>{t}</li>{/each}
          </ul>
        </div>
        <div class="column">
          <h4>Материалы</h4>
          <ul>
            {#each model.materialsList as m}<li>{m}</li>{/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}

