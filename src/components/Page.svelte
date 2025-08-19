<script lang="ts">
  import type Album from '@types/album'

  import albums from '@data/musicfiles.json'

  const reversedAlbums = [...albums].reverse()

  import { fade } from 'svelte/transition'

  import Light from '@components/Light.svelte'
  import AlbumCarousel from '@components/AlbumCarousel.svelte'
  import Player from '@components/Player.svelte'
  import AskYesNo from '@components/AskYesNo.svelte'

  let selectedAlbum: Album | null = null

  let route = 'home'

  // const navigate = () => {
  //   route = 'ask'
  // }

  const handleYes = () => {
    route = 'album'
  }

  const backHome = () => {
    route = 'home'
  }

  const handleChoose = (album: Album) => {
    selectedAlbum = album
    route = 'ask'
  }
</script>

{#if route === 'home'}
  <Light />
{/if}

<AskYesNo open={route == 'ask'} onYes={handleYes} onNo={backHome}>
  ¿Estás seguro de que quieres elegir ese album?
</AskYesNo>

{#if route === 'album'}
  <Player album={selectedAlbum} onExit={backHome} />
{/if}

{#if route == 'home'}
  <div transition:fade={{ duration: 1000, delay: 1000 }}>
    <h1 class="title">★🎸 Selecciona un Album 🎧 ⋆｡ °⋆</h1>

    <section class="albums">
      <h2 class="albums__title">Albumes Destacados</h2>
      <AlbumCarousel {albums} onchoose={handleChoose} />
    </section>

    <section class="albums">
      <h2 class="albums__title">Albumes Recomendados</h2>
      <AlbumCarousel albums={reversedAlbums} onchoose={handleChoose} />
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
