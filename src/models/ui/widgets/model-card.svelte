<script lang="ts">
  import type { ModelAttrs } from '#models/domain/struct/attrs';
  import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
  import { SKILL_LEVEL_TITLES } from '#app/domain/constants';
  
  
  // Получаем контекст приложения
  import { getContext } from 'svelte';
    import { App } from '#app/ui/base/app';
  const app = getContext<App>('app');
  
  const navigateToDetails = () => {
    app.router.navigate(`/models/${model.id}`);
  };
  
  let { model } = $props<{
    model: ModelAttrs;
  }>();
  
  const previewUrl = $derived(model.imageIds[0]);
  const categories = $derived(model.categories.map(cat => MODEL_CATEGORY_TITLES[cat]));
  const difficulty = $derived(SKILL_LEVEL_TITLES[model.difficultyLevel]);
</script>

<style>
  :host {
    display: block;
    width: 100%;
  }

  sl-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .preview {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .content {
    padding: 1rem;
  }

  .title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: 0.95rem;
    color: var(--sl-color-neutral-700);
    margin-bottom: 1rem;
  }

  .tags-row {
    display: flex;
    gap: 1rem;
  }

  .categories {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .difficulty {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 1rem;
  }

  sl-button {
    white-space: nowrap;
  }
</style>

<sl-card>
  {#if previewUrl}
    <img slot="image" class="preview" src={previewUrl} alt="preview" />
  {/if}

  <div class="content">
    <div class="title">{model.title}</div>
    <div class="description">{model.description}</div>
    <div class="tags-row">
      <div class="categories">
        {#each categories as cat}
          <sl-tag size="small" variant="primary">{cat}</sl-tag>
        {/each}
      </div>
      <div class="difficulty">
        <sl-tag size="small" variant="warning">{difficulty}</sl-tag>
      </div>
    </div>
  </div>

  <div class="footer">
    <sl-button size="small" variant="primary" on:click={navigateToDetails}>
      Подробнее
    </sl-button>
    <span><strong>{model.pricePerAccess} ₸</strong></span>
  </div>
</sl-card>
