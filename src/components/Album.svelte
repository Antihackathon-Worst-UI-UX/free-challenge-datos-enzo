<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import WaveSurfer from 'wavesurfer'

  export let delay = 50
  export let radius = 100

  let duration = 0

  const tracks = Array.from({ length: 10 }, (_, i) => ({
    title: `Track ${i + 1}`,
  }))

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
    })

    wavesurfer.load('/song.mp3')

    wavesurfer.on('ready', () => {
      duration = wavesurfer.getDuration()
    })
  }

  onDestroy(() => {
    wavesurfer.destroy()
  })

  let angle = { value: 0, time: Date.now() }

  let targetPlaybackRate = 1
  let currentPlaybackRate = 1

  let lastUpdate = 0

  const updateAudio = (time: DOMHighResTimeStamp) => {
    if (time - lastUpdate > delay) {
      currentPlaybackRate += (targetPlaybackRate - currentPlaybackRate) * 0.1
      wavesurfer.setPlaybackRate(currentPlaybackRate)
      lastUpdate = time
    }
    requestAnimationFrame(updateAudio)
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

    const handleDrag = (event: PointerEvent) => {
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

      const speedFactor = 0.1
      targetPlaybackRate = Math.max(
        -1.25,
        Math.min(1.25, angularSpeed * speedFactor),
      )

      angle = { value: newValue, time: now }

      updatePosition()
    }

    node.addEventListener('pointerdown', () => {
      if (!wavesurfer.isPlaying()) wavesurfer.play()
      requestAnimationFrame(updateAudio)

      const handleStopDrag = () => {
        wavesurfer.pause()
        window.removeEventListener('pointermove', handleDrag)
        window.removeEventListener('pointerup', handleStopDrag)
      }

      window.addEventListener('pointermove', handleDrag)
      window.addEventListener('pointerup', handleStopDrag)
    })
  }
</script>

<div class="container">
  <ul class="tracks" transition:fly={{ duration: 300, x: -100 }}>
    {#each tracks as track}
      <li class="track">{track.title}</li>
    {/each}
  </ul>

  <div transition:fly={{ duration: 1000, y: -100 }}>
    <h1>{tracks[0].title}</h1>

    <div class="player" transition:fade={{ duration: 3000 }}>
      <div use:waveform></div>
    </div>

    <div class="crank-container" style="--radius: {radius}px">
      <div class="crank" use:setupCrank></div>
    </div>
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
  .crank-container {
    position: fixed;
    bottom: 10rem;
    right: 10rem;
    width: 150px;
    height: 150px;
    background-color: #fff;
    border-radius: 50%;
  }

  .crank {
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

  .crank::after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    background: #222;
    border-radius: 50%;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
</style>
