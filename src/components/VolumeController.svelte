<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  import Key from '@components/Key.svelte'

  export let active = false
  export let value = 0

  const handleIncrease = () => {
    if (!active) return
    value = Math.min(value + 25, 100)
  }

  const handleSelect = () => {
    active = !active
  }

  onMount(() => {
    const interval = setInterval(() => {
      if (!active) return

      value = Math.max(value - 10, 0)
    }, 100)

    return () => clearInterval(interval)
  })
</script>

<section
  class="container"
  aria-label="Controlador de volumen"
  transition:fly={{ duration: 500, x: 100 }}
>
  <button on:click={handleIncrease}><Key>Aumentar</Key></button>

  <p
    class="progress"
    style="--size: {value}%"
    aria-label="Volumen: {value}%"
    role="progressbar"
    aria-live="polite"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
  ></p>

  <button on:click={handleSelect}>
    <Key>
      {#if active}
        Establecer volumen
      {:else}
        Cambiar volumen
      {/if}
    </Key>
  </button>
</section>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.75rem;
    grid-column-start: 3;
    grid-row: span 2;
  }

  .progress {
    border-radius: 0.5rem;
    width: 0.75rem;
    background: #eee;
    overflow: hidden;
    position: relative;
    min-height: 5rem;
    height: 17.5rem;
  }

  .progress::before {
    background: #007bff;
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: height 0.1s ease-in-out;
    height: var(--size);
  }
</style>
