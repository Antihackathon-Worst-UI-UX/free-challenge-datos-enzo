<script lang="ts">
  import albums from '@data/musicfiles.json'

  import { fade } from 'svelte/transition'

  import Light from '@components/Light.svelte'
  import AlbumCarousel from '@components/AlbumCarousel.svelte'
  import Album from '@components/Album.svelte'
  import AskYesNo from '@components/AskYesNo.svelte'

  let route = 'album'

  const navigate = () => {
    route = 'ask'
  }

  const handleYes = () => {
    route = 'album'
  }

  const backHome = () => {
    route = 'home'
  }
</script>

{#if route === 'home'}
  <Light />
{/if}

<AskYesNo open={route == 'ask'} onYes={handleYes} onNo={backHome}>
  ¿Estás seguro de que quieres elegir ese album?
</AskYesNo>

{#if route === 'album'}
  <Album data={albums[0]} onExit={backHome} />
{/if}

{#if route == 'home'}
  <div transition:fade={{ duration: 1000, delay: 1000 }}>
    <h1 class="title">★🎸 Selecciona un Album 🎧 ⋆｡ °⋆</h1>

    <section class="albums">
      <h2 class="albums__title">Albumes Destacados</h2>
      <AlbumCarousel onChoose={navigate} />
    </section>

    <section class="albums">
      <h2 class="albums__title">Albumes Recomendados</h2>
      <AlbumCarousel onChoose={navigate} />
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
