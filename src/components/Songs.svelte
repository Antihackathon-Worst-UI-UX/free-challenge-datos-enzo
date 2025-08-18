<script lang="ts">
  import type Song from '@types/song'

  interface Props {
    songs: Song[]
    select: (song: Song) => void
  }

  import Modal from '@components/Modal.svelte'

  import Key from '@components/Key.svelte'

  export let songs: Song[]
  export let select: (song: Song) => void

  let slug: string = ''
  let openModal: boolean = false

  const handleSubmit = (event: Event) => {
    event.preventDefault()

    const selectedSong = songs.find((song: Song) => song.slug === slug.trim())

    if (!selectedSong) return

    slug = ''
    select(selectedSong)
  }

  const handleOpenModal = (event: Event) => {
    event.preventDefault()
    openModal = true
  }
</script>

<form class="form" onsubmit={handleSubmit}>
  <label class="form__label" for="song-slug">
    Escribe la ruta de la canción que quieres seleccionar:
  </label>

  <button class="form__button">
    <Key>Seleccionar</Key>
  </button>

  <input class="form__input" id="song-slug" type="text" bind:value={slug} />

  <button class="form__button" onclick={handleOpenModal}>
    <Key>Ver canciones</Key>
  </button>
</form>
<Modal bind:open={openModal}>
  <p class="dummy">
    {#each Array(10) as _, i}
      <span class="dummy__arrow">⬇️</span>
    {/each}
  </p>
  <ul class="songs">
    {#each songs as song}
      <li class="song">
        <section>
          <h2>{song.name}</h2>
          <p>Ruta: <strong class="song__slug">{song.slug}</strong></p>
        </section>
      </li>
    {/each}
  </ul>
</Modal>

<style>
  .form {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    font-size: 1.25rem;
    font-weight: bold;
    padding: 0.5rem 1.5rem;
    width: 100%;
  }

  .form__label {
    font-size: 2rem;
  }

  .form__input {
    width: 100%;
    border: 0.2rem solid #fff;
    padding: 0.25rem 1rem;
    color: #000;

    background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
    border-radius: 0.5rem;
    border: 0.0625rem solid var(--key-color);

    box-shadow:
      0 0.6rem 0 #bbb,
      0 0.375rem 0.75rem rgba(0, 0, 0, 0.25);

    transition:
      transform 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
  }

  .form__input:focus {
    outline: none;
    transform: translateY(20%);
    background: linear-gradient(145deg, #e8e8e8, #d8d8d8);
    box-shadow:
      0 0.25rem 0 #aaa,
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  .form__button {
    display: inline-block;
    font-size: 0.75rem;
  }

  .song {
    width: max-content;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .song__slug {
    user-select: none;
  }

  .dummy {
    text-align: center;
    font-size: 3rem;
  }

  .dummy__arrow {
    display: block;
    min-height: 10rem;
  }
</style>
