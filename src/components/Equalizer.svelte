<script lang="ts">
  import type WaveSurfer from 'wavesurfer'
  import SlotReel from 'slot-reel'

  import { onMount } from 'svelte'

  import Key from '@components/Key.svelte'
  import randomNumber from '@utils/randomNumber'
  import Modal from '@components/Modal.svelte'

  export let wavesurfer: WaveSurfer
  export let key: string

  const SLOT_MACHINE_SOUND = new Audio('/assets/slot-machine.mp3')

  let openInfo = false

  const VALUES = {
    DIAMOND: 1,
    LEMON: 2,
    WATERMELON: 3,
    BAR: 4,
    SEVEN: 5,
  }

  const EFFECTS = {
    [VALUES.DIAMOND]: -12,
    [VALUES.LEMON]: -6,
    [VALUES.WATERMELON]: 0,
    [VALUES.BAR]: 6,
    [VALUES.SEVEN]: 12,
  }

  let id = `slot-machine-equalize-${key}`
  let buttonId = `button-${key}`

  interface Option {
    name: string
    gain: number
    frequency: number
    type: string
  }

  let configuration: Option[] = [
    { name: 'Bajos', gain: 1, frequency: 60, type: 'lowshelf' },
    { name: 'Medios', gain: 1, frequency: 1700, type: 'peaking' },
    { name: 'Altos', gain: 1, frequency: 12000, type: 'highshelf' },
  ]

  const getGains = () => configuration.map(({ gain }) => gain)

  const setNewGains = (...gains: number[]) => {
    configuration = configuration.map((option, index) => ({
      ...option,
      gain: gains[index],
    }))
  }

  const generateState = () =>
    Array.from({ length: 3 }, () => randomNumber(1, 5))

  const allEqualEffect = (value: keyof typeof EFFECTS) => {
    if (value == VALUES.SEVEN) return setNewGains(1, 1, 1)

    const negatives = getGains().reduce(
      (count, gain) => count + Number(gain < 0),
      0,
    )

    const change = Math.abs(EFFECTS[value]) * (negatives > 1 ? 1 : -1)

    setNewGains(...getGains().map((gain) => gain + change))
  }

  const generateSpinState = () => {
    const state = Array.from({ length: 3 }, () => randomNumber(1, 5))

    const callback = () => {
      if (state.every((value) => value === state[0])) {
        allEqualEffect(state[0])
        return
      }

      setNewGains(
        ...getGains().map((gain, index) => gain + EFFECTS[state[index]]),
      )
    }

    return {
      stopAtSegments: state,
      callback,
    }
  }

  const getFilters = (configuration: Option[]) => {
    return configuration.map(({ type, gain, frequency }) => {
      const filter = wavesurfer.backend.ac.createBiquadFilter()
      filter.type = type
      filter.gain.value = parseFloat(`${gain}`)
      filter.Q.value = 1
      filter.frequency.value = frequency
      return filter
    })
  }

  $: if (wavesurfer) wavesurfer.backend.setFilters(getFilters(configuration))

  const handleOpenInfo = () => {
    openInfo = true
  }

  onMount(() => {
    const slotReel = new SlotReel({
      containerElSelector: `#${id}`,
      spinButtonSelector: `#${buttonId}`,
      textureUrls: [
        '/assets/drum/one.webp',
        '/assets/drum/one.webp',
        '/assets/drum/one.webp',
      ],
      cylindersCount: 3,
      geometryDimensions: [0.75, 0.75, 1],
      radialSegments: 35,
      symbolsPerReel: 5,
      cylinderSpacingRatio: 0.1,
      baseSpinSpeed: 1.5,
      initialSegments: generateState(),
      queuedSpinStates: Array.from({ length: 1e4 }, generateSpinState),
    })

    slotReel.init()
  })

  const handleClick = () => {
    SLOT_MACHINE_SOUND.currentTime = 0
    SLOT_MACHINE_SOUND.volume = 0.35
    SLOT_MACHINE_SOUND.play()
  }
</script>

<section class="equalizer" aria-label="Equalizador">
  <div class="equalizer__top">
    <div class="slot-reel-container">
      <div class="slot-reel" {id}></div>
    </div>

    <ul>
      {#each configuration as { name, gain }}
        <li>{name}: {gain} dB</li>
      {/each}
    </ul>
  </div>

  <div class="equalizer__buttons">
    <button onclick={handleOpenInfo}><Key>Cómo usar</Key></button>
    <button onclick={handleClick} id={buttonId}><Key>Girar</Key></button>
  </div>
</section>

<Modal bind:open={openInfo}>
  <section>
    <h2 class="title">Cómo usar el Equalizador</h2>

    <ul class="list">
      <li>Limón quita -6 dB</li>
      <li>Sandía no hace nada</li>
      <li>BAR suma 6 dB</li>
      <li>Siete suma 12 dB</li>
    </ul>
    <br />
    Si hay 3 iguales se suma, si hay más de 1 negativo se suma, en caso contrario
    se resta.<br /><br />Caso especial: 777 resetea a 1.
  </section>
</Modal>

<style>
  .equalizer {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .equalizer__top {
    display: flex;
    gap: 1rem;
  }

  .slot-reel-container {
    position: relative;
    width: min(60%, 15rem);
    aspect-ratio: 11 / 5;
    margin-bottom: auto;
    margin-top: auto;
    margin-left: 1rem;
  }

  .slot-reel {
    width: 100%;
    height: 100%;
  }

  .equalizer__buttons {
    display: flex;
  }

  .list {
    list-style: disc;
    padding-left: 1rem;
  }

  .title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
</style>
