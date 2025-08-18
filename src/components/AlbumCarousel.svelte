<script lang="ts">
  import { Marquee } from '@selemondev/svelte-marquee'
  import '@selemondev/svelte-marquee/dist/style.css'

  const images = Array.from({ length: 10 }, (_, index) => ({
    src: `https://picsum.photos/500/500?random=${index}`,
  }))

  export let onChoose: () => void
</script>

<ul class="list">
  <Marquee class="marquee">
    {#each images as { src } (src)}
      <li class="item">
        <button onclick={onChoose} class="button">
          <img {src} alt="" />
        </button>
      </li>
    {/each}
  </Marquee>
</ul>

<style>
  :global(.marquee) {
    overflow: visible;
    --duration: 8s;
  }

  .list {
    overflow: hidden;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .item {
    width: 15rem;
    height: 15rem;
    background: red;
  }

  .button {
    transition: transform 0.3s ease;
  }

  .button:hover {
    transform: scale(1.2);
    z-index: 1000;
  }
</style>
