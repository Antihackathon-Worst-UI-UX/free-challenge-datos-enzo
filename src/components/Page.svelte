<script lang="ts">
  import { fade } from 'svelte/transition'

  import Light from '@components/Light.svelte'
  import AlbumCarousel from '@components/AlbumCarousel.svelte'
  import Album from '@components/Album.svelte'

  let route = 'home'

  const navigate = (event: CustomEvent<string>) => {
    const { detail } = event
    route = detail
  }
</script>

<!-- {#if route === 'home'}
  <Light />
{/if} -->

{#if route === 'album'}
  <Album />
{/if}

{#if route == 'home'}
  <div transition:fade={{ duration: 1000 }}>
    <h1 class="title">★🎸 Selecciona un Album 🎧 ⋆｡ °⋆</h1>

    <section class="albums">
      <h2 class="albums__title">Albumes Destacados</h2>
      <AlbumCarousel on:navigate={navigate} />
    </section>

    <section class="albums">
      <h2 class="albums__title">Albumes Recomendados</h2>
      <AlbumCarousel on:navigate={navigate} />
    </section>
  </div>
{/if}

<style>
  :global(.album-view) {
    height: 100vh;
    overflow: hidden;
  }

  .title {
    font-size: 3rem;
    font-weight: bold;
  }

  .albums {
    margin-top: 3rem;
  }

  .albums__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }
</style>
