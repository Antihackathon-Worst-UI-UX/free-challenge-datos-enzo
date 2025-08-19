<script lang="ts">
  import type Album from '@types/album'
  import type Song from '@types/song'

  import { fly, fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import WaveSurfer from 'wavesurfer'

  import Songs from '@components/Songs.svelte'
  import Key from '@components/Key.svelte'
  import VolumeController from '@components/VolumeController.svelte'
  import Modal from '@components/Modal.svelte'
  import Advertisement from '@components/Advertisement.svelte'
  import Equalizer from '@components/Equalizer.svelte'

  export let onExit = () => {}

  export let delay = 50
  export let radius = 75

  export let album: Album

  let { songs } = album

  let angle = { value: 0, time: Date.now() }
  let targetPlaybackRate = 0
  let currentPlaybackRate = 0
  let lastUpdate = 0
  let lastDrag = 0
  let currentSong: null | Song = null
  let duration = 0
  let volume: number = 0
  let showAdvertisement = false

  let wavesurfer: WaveSurfer

  const waveform = (node: HTMLElement) => {
    wavesurfer = WaveSurfer.create({
      container: node,
      waveColor: 'white',
      progressColor: 'yellow',
      cursorWidth: 2,
      cursorColor: 'red',
      barWidth: 2,
      responsive: true,
      interact: false,
      autoScroll: true,
      autoCenter: true,
    })

    if (currentSong) wavesurfer.load(currentSong.file)

    wavesurfer.on('ready', () => {
      duration = wavesurfer.getDuration()
      wavesurfer.seekTo(0)
    })

    wavesurfer.on('error', (error: Error) => {
      console.error(error)
      wavesurfer.seekTo(0)
    })
  }

  onDestroy(() => {
    if (wavesurfer) wavesurfer.destroy()
  })

  const updateAudio = (time: DOMHighResTimeStamp) => {
    try {
      if (wavesurfer) wavesurfer.setVolume(volume / 100)

      if (
        wavesurfer &&
        !wavesurfer.isPlaying() &&
        wavesurfer.backend.playbackRate > 0
      )
        wavesurfer.play()

      if (Date.now() - lastDrag > 1000) {
        currentPlaybackRate = targetPlaybackRate = 0
        if (wavesurfer) wavesurfer.pause()
        lastUpdate = time
      } else if (time - lastUpdate > delay) {
        currentPlaybackRate +=
          (targetPlaybackRate - currentPlaybackRate - 0.01) * 0.1
        if (wavesurfer) wavesurfer.setPlaybackRate(currentPlaybackRate)
        lastUpdate = time
      }

      requestAnimationFrame(updateAudio)
    } catch (error) {
      wavesurfer.pause()
      wavesurfer.seekTo(0)
    }
  }

  const setupCrank = (node: HTMLElement) => {
    const container = node.parentElement!

    const updatePosition = () => {
      const rect = container.getBoundingClientRect()
      const x = rect.width / 2 + radius * Math.cos(angle.value)
      const y = rect.height / 2 + radius * Math.sin(angle.value)
      node.style.setProperty('--position-x', `${x}px`)
      node.style.setProperty('--position-y', `${y}px`)
      node.style.setProperty('--angle', `${angle.value}rad`)
    }

    updatePosition()

    let accumulatedAngles = 0
    let angleToShowAdvertisement = 10000

    const handleDrag = (event: PointerEvent) => {
      if (showAdvertisement) return

      lastDrag = Date.now()

      const rect = container.getBoundingClientRect()

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const newValue = Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX,
      )

      const now = Date.now()

      let deltaAngle = newValue - angle.value

      if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI
      if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI

      const deltaTime = (now - angle.time) / 1000
      const angularSpeed = deltaAngle / deltaTime

      accumulatedAngles = accumulatedAngles + Math.abs(angularSpeed)

      if (accumulatedAngles > angleToShowAdvertisement) {
        showAdvertisement = true
        accumulatedAngles = 0
        angleToShowAdvertisement = 5000000
      }
      const speedFactor = -0.25
      targetPlaybackRate = Math.max(
        -1.25,
        Math.min(1.25, angularSpeed * speedFactor),
      )

      angle = { value: newValue, time: now }

      updatePosition()
    }

    node.addEventListener('pointerdown', () => {
      if (wavesurfer && !wavesurfer.isPlaying()) {
        wavesurfer.play()
        requestAnimationFrame(updateAudio)
      }

      const handleStopDrag = () => {
        if (wavesurfer) wavesurfer.pause()

        window.removeEventListener('pointermove', handleDrag)
        window.removeEventListener('pointerup', handleStopDrag)
      }

      window.addEventListener('pointermove', handleDrag)
      window.addEventListener('pointerup', handleStopDrag)
    })
  }

  const handleSelect = (song: Song) => {
    currentSong = song

    if (!wavesurfer) return

    wavesurfer.load(song.file)
  }
</script>

<div class="container" style="--radius: {radius}px">
  <button
    class="back-button"
    on:click={onExit}
    aria-label="Retroceder"
    transition:fly={{ duration: 1500, y: 200, x: -200, delay: 1000 }}
  >
    <Key>🔙</Key></button
  >

  <div class="songs" transition:fly={{ duration: 1000, y: -100, delay: 1000 }}>
    <Songs {songs} select={handleSelect} />
  </div>

  <div class="player" transition:fly={{ duration: 1000, x: -200, delay: 1000 }}>
    <h1>
      {album.name}

      {#if currentSong}
        - {currentSong.name}
      {/if}
    </h1>
    <p class="player__description">{album.description}</p>
    {#if currentSong}
      <p class="player__info">Velocidad: {currentPlaybackRate.toFixed(1)}</p>
      <p class="player__info">Volumen: {volume}</p>
      <div use:waveform></div>
    {/if}
  </div>

  {#if currentSong}
    <div class="crank" transition:fly={{ duration: 500, y: 200, x: 2000 }}>
      <div class="crank__circle-center">
        <div class="crank__handle" use:setupCrank></div>
      </div>
    </div>

    <VolumeController bind:value={volume} />

    <Equalizer {wavesurfer} />
  {/if}
</div>

<Modal bind:open={showAdvertisement}>
  <Advertisement />
</Modal>

<style>
  .container {
    display: grid;
    grid-template-columns: 3fr calc(4 * var(--radius)) 1fr;
    grid-auto-rows: max-content;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
  }

  .back-button {
    position: fixed;
    right: 0;
    bottom: 0;
    font-size: 2rem;
  }

  .songs {
    grid-column: span 3;
    width: 100%;
  }

  .player {
    padding: 1.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .player__info {
    font-size: 1.2rem;
  }

  .crank {
    display: grid;
    place-content: center;
    position: relative;
    width: calc(4 * var(--radius));
    height: calc(4 * var(--radius));
  }

  .crank__circle-center {
    width: 100px;
    height: 100px;
    background-color: #fff;
    border-radius: 50%;
  }

  .crank__handle {
    position: absolute;
    width: calc(1.5 * var(--radius));
    height: 10px;
    background: #555;
    transform-origin: left center;
    top: 50%;
    left: 50%;
    transform: rotate(var(--angle));
    cursor: grab;
  }

  .crank__handle::after {
    content: '';
    width: 50px;
    height: 50px;
    background: #222;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
</style>
