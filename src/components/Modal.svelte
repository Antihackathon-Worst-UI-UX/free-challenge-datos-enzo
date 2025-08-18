<script lang="ts">
  import { fade, scale } from 'svelte/transition'

  export let open = false
  export let delay = 0
  export let closeButton = true
  export let containerBackground = true

  $: {
    if (open) document.body.classList.add('modal-open')
    else document.body.classList.remove('modal-open')
  }

  const handleClick = () => {
    open = false
  }
</script>

{#if open}
  <div
    class="modal"
    in:fade={{ duration: 100, delay }}
    out:fade={{ duration: 100 }}
  >
    <div
      class="modal__container"
      class:modal__container--no-background={!containerBackground}
      transition:scale={{ duration: 200, delay }}
    >
      {#if closeButton}
        <button class="modal__button" onclick={handleClick} aria-label="Cerrar"
          >❌
        </button>
      {/if}
      <slot />
    </div>
  </div>
{/if}

<style>
  :global(.modal-open) {
    overflow: hidden;
  }

  .modal {
    display: grid;
    place-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 1000000;
  }

  .modal__container {
    display: flex;
    flex-direction: column;
    background-color: white;
    color: #000;
    padding: 1rem;
    max-height: 20rem;
    max-width: 80vw;
    overflow: auto;
    transition: background-color 0.5s;
  }

  .modal__container--no-background {
    background-color: transparent;
  }

  .modal__button {
    padding: 0.25rem;
    align-self: flex-end;
    font-size: 2rem;
  }
</style>
