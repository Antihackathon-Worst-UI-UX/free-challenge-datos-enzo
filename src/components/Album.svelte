<script>
  import { fly } from 'svelte/transition'

  const tracks = Array.from({ length: 10 }, (_, i) => ({
    title: `Track ${i + 1}`,
  }))
</script>

<div class="container">
  <ul class="tracks" transition:fly={{ duration: 300, x: -100 }}>
    {#each tracks as track}
      <li class="track">{track.title}</li>
    {/each}
  </ul>

  <div class="album" transition:fly={{ duration: 300, y: -100 }}>
    <h2 class="album__title">Album Title</h2>
    <p class="album__description">Album Description</p>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
