<script lang="ts">
  export let eventKey: string | null = null

  let pressed = false

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (key === eventKey) pressed = true
  }

  const handleKeyUp = ({ key }: KeyboardEvent) => {
    if (key === eventKey) pressed = false
  }
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<span
  class="key"
  class:key--pressed={pressed}
  class:key--button={eventKey == null}
>
  <span>
    <slot></slot>
  </span>
</span>

<style>
  :root {
    --key-color: #ccc;
  }

  .key {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    margin: 1rem;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #222;
    background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
    border-radius: 0.5rem;
    border: 0.0625rem solid var(--key-color);
    width: max-content;

    box-shadow:
      0 0.6rem 0 #bbb,
      0 0.375rem 0.75rem rgba(0, 0, 0, 0.25);

    transition:
      transform 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
  }

  .key--pressed,
  .key--button:active {
    transform: translateY(20%);
    background: linear-gradient(145deg, #e8e8e8, #d8d8d8);
    box-shadow:
      0 0.25rem 0 #aaa,
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  .key span {
    text-transform: uppercase;
    letter-spacing: 0.05rem;
  }
</style>
