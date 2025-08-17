<script lang="ts">
  import { onMount } from 'svelte'
  import { Tween } from 'svelte/motion'
  import { linear } from 'svelte/easing'
  import { fade } from 'svelte/transition'

  import Key from '@components/Key.svelte'

  let x = 0
  let y = 0

  let size = new Tween(0, { duration: 300, easing: linear })

  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    x = clientX
    y = clientY
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    // Space key
    if (event.key != ' ') return

    event.preventDefault()
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    // Space key
    if (event.key != ' ') return

    event.preventDefault()

    size.set(Math.min(1, size.current + 0.5))
  }

  let active = true

  onMount(() => {
    const interval = setInterval(() => {
      size.set(Math.max(0, size.current - 0.1))
    }, 150)

    return () => {
      active = false
      clearInterval(interval)
      size.set(5)
    }
  })
</script>

<svelte:window
  on:mousemove={handleMouseMove}
  on:keyup={handleKeyUp}
  on:keypress={handleKeyPress}
/>

<p
  class="instructions"
  class:instructions--hide={size.current > 0.5}
  out:fade={{ duration: 1000 }}
>
  <Key eventKey=" ">Espacio</Key>
  <span> Presiona la tecla para iluminar el área alrededor del cursor. </span>
</p>

<div
  out:fade={{ duration: 1000 }}
  class="light"
  class:light--active={size.current > 0.1}
  style="--position-x: {x}px; --position-y: {y}px;--size:{size.current};"
></div>

<style lang="scss">
  .light {
    position: fixed;
    left: -100%;
    top: -100%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      transparent,
      #000 calc(350px * var(--size))
    );
    transform: translate(var(--position-x), var(--position-y));
    overflow: hidden;
    z-index: 100000;
  }

  .light--active {
    user-select: none;
    pointer-events: none;
  }

  .instructions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    position: fixed;
    top: 10%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    transition: opacity 0.5s ease-in-out;
    z-index: 1000000;
    user-select: none;
    pointer-events: none;

    &--hide {
      opacity: 0;
    }
  }
</style>
