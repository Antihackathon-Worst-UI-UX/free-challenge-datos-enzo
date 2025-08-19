<script lang="ts">
  import type Album from '@types/album'

  import { onMount, onDestroy } from 'svelte'

  import { Marquee } from '@selemondev/svelte-marquee'
  import '@selemondev/svelte-marquee/dist/style.css'

  export let albums: Album[] = []

  export let onchoose: (album: Album) => void = () => {}

  const createHandleClick = (album: Album) => () => onchoose(album)

  onMount(() => {
    document.body.classList.add('album-carousel-open')
  })

  onDestroy(() => {
    document.body.classList.remove('album-carousel-open')
  })
</script>

<ul class="list">
  <Marquee class="marquee">
    {#each albums as album (album.name)}
      {@const { name, image, description } = album}

      <li class="item">
        <button onclick={createHandleClick(album)} class="item__button">
          <img class="item__image" src={image} alt="" />
          <span class="item__name">{name}</span>
          <span class="item__description">{description}</span>
        </button>
      </li>
    {/each}
  </Marquee>
</ul>

<style>
  :global(.album-carousel-open) {
    overflow-x: hidden;
  }

  :global(.marquee) {
    overflow: visible;
    --duration: 8s;
  }

  .item,
  .item__button {
    width: 15rem;
    height: 15rem;
  }

  .item__button {
    position: relative;
    transition: transform 0.3s ease;
  }

  .item__button:hover {
    transform: scale(1.2);
    z-index: 1000;
  }

  .item__image {
    object-fit: cover;
  }

  .item__description {
    background: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .item__button:hover .item__description {
    opacity: 1;
  }
</style>
