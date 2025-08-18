<script lang="ts">
  import Modal from '@components/Modal.svelte'
  import { onDestroy, onMount } from 'svelte'

  import slashImage from '@utils/slashImage'
  import randomChoose from '@utils/randomChoose'
  import randomNumber from '@utils/randomNumber'
  import sleep from '@utils/sleep'

  export let open: boolean
  export let onYes: () => void
  export let onNo: () => void

  const ATTACK_SOUND = new Audio('/assets/slash.mp3')
  const ATTACK_AND_DAMAGE_SOUND = new Audio('/assets/slash-and-damage.mp3')
  const START_BATTLE_SOUND = new Audio('/assets/yellow-undertale.mp3')
  const HEAVY_HIT_SOUND = new Audio('/assets/heavy-hit.mp3')
  const KILL_SOUND = new Audio('/assets/kill.mp3')

  const BACKGROUND_MUSICS = [
    new Audio('/assets/stronger-monsters.mp3'),
    new Audio('/assets/anticipation.mp3'),
    new Audio('/assets/enemy-approaching.mp3'),
    new Audio('/assets/wrong-enemy.mp3'),
  ]

  const AUDIOS = [
    ATTACK_SOUND,
    ATTACK_AND_DAMAGE_SOUND,
    START_BATTLE_SOUND,
    HEAVY_HIT_SOUND,
    KILL_SOUND,
  ]

  let health = 100
  let isMoving = false
  let showHealth = false
  let isButtonBlue = false
  let animationFrame: number
  let buttonContainer: HTMLDivElement
  let slashesContainer: HTMLDivElement
  let isHit = false

  const reset = () => {
    health = 100
    isMoving = false
    showHealth = false
    isHit = false
    isButtonBlue = false

    if (slashesContainer) slashesContainer.textContent = ''

    AUDIOS.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  const handleYes = async () => {
    if (!isMoving && !showHealth) {
      try {
        showHealth = true

        health -= 5

        await sleep(1500)

        await START_BATTLE_SOUND.play()
        isButtonBlue = true

        await sleep(1000)

        const backgroundMusic = randomChoose(BACKGROUND_MUSICS)

        backgroundMusic.volume = 0.35
        backgroundMusic.play()
      } catch (error) {
        console.error(error)
      } finally {
        isButtonBlue = true
        isMoving = true
        startMoving()
      }

      return
    }

    if (!isMoving) return

    health = health - randomNumber(15, 25)

    if (health > 0) return

    BACKGROUND_MUSICS.forEach((music) => {
      music.pause()
      music.currentTime = 0
    })

    HEAVY_HIT_SOUND.play().catch(console.error)
    stopMoving()

    await sleep(2000)

    health = 0

    KILL_SOUND.play().catch(console.error)

    await sleep(1000)

    onYes()

    reset()
  }

  let x = 0
  let y = 0

  const startMoving = async () => {
    let last = Date.now()

    const rect = buttonContainer.getBoundingClientRect()
    x = rect.x
    y = rect.y

    const moveButton = () => {
      if (!isMoving) return

      if (Date.now() - last > 1000) {
        const deltaX = randomNumber(-750, 750)
        const deltaY = randomNumber(-750, 750)

        x = Math.max(100, Math.min(window.innerWidth - 300, x + deltaX))
        y = Math.max(100, Math.min(window.innerHeight - 300, y + deltaY))

        last = Date.now()
      }

      animationFrame = requestAnimationFrame(moveButton)
    }

    moveButton()
  }

  const stopMoving = () => {
    cancelAnimationFrame(animationFrame)
  }

  const handleClick = (event: MouseEvent) => {
    if (!showHealth || !slashesContainer) return

    const { clientX, clientY } = event

    const image = document.createElement('img')
    image.src = `data:image/gif;base64,${slashImage}`
    image.draggable = true
    image.classList.add('slash')
    image.style.setProperty('--position-x', `${clientX}px`)
    image.style.setProperty('--position-y', `${clientY}px`)
    slashesContainer.appendChild(image)

    const rect = buttonContainer.lastElementChild!.getBoundingClientRect()
    const miss =
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom

    if (health > 0) {
      if (miss) {
        ATTACK_SOUND.currentTime = 0
        ATTACK_SOUND.play().catch(console.error)
      } else {
        ATTACK_AND_DAMAGE_SOUND.currentTime = 0
        ATTACK_AND_DAMAGE_SOUND.play().catch(console.error)
      }

      isHit = true

      setTimeout(() => {
        isHit = false
      }, 300)
    }

    setTimeout(() => {
      if (slashesContainer.contains(image)) slashesContainer.removeChild(image)
    }, 500)
  }

  const handleNo = () => {
    reset()
    onNo()
  }

  onDestroy(() => {
    stopMoving()
    slashesContainer.textContent = ''
  })

  onMount(() => {
    AUDIOS.forEach((audio) => {
      audio.volume = 0.5
    })
  })
</script>

<svelte:window onclick={handleClick} />

<Modal
  bind:open
  delay={500}
  closeButton={false}
  containerBackground={!isMoving}
>
  <section class="container">
    <h2 class="title" class:title--hide={isMoving}>
      <slot />
    </h2>

    <button
      class="button button--no"
      class:button--destroy={isMoving}
      disabled={showHealth}
      on:click={handleNo}>No</button
    >

    <div
      class="button-yes-container"
      class:button-yes-container--moving={isMoving}
      class:button-yes-container--dissapearing={health == 0}
      style={`--position-x: ${x}px; --position-y: ${y}px;`}
      bind:this={buttonContainer}
    >
      <p
        class="health-bar"
        class:health-bar--hidden={!showHealth}
        style={`--health: ${health}%`}
        aria-label="Salud: {health}%"
        role="progressbar"
        aria-live="assertive"
        aria-valuenow={health}
        aria-valuemin={0}
        aria-valuemax={100}
      ></p>

      <button
        class="button button--yes"
        class:button--blue={isButtonBlue}
        class:button--hit={isHit}
        on:click={handleYes}>Sí</button
      >
    </div>
  </section>
  <div bind:this={slashesContainer}></div>
</Modal>

<style>
  .container {
    padding: 1rem;
    max-width: 500px;
    position: relative;
    min-height: 200px;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
    transition: opacity 1s ease-out forwards;
  }

  .title--hide {
    opacity: 0;
  }

  .button {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    font-size: 2rem;
    color: white;
    width: 7.5rem;
    cursor: pointer;
  }

  .button--destroy {
    animation: destroy 1s ease-out forwards 0.5s;
    pointer-events: none;
  }

  .button--yes {
    background-color: #f44336;
    z-index: 10000000;
  }

  .button--no {
    background-color: #4caf50;
    margin-right: 1rem;
  }

  .button--blue {
    background-color: #0000ff;
  }

  .button--hit {
    animation: hit 0.3s ease;
  }

  .button-yes-container {
    display: inline-block;
    position: fixed;
  }

  .button-yes-container--moving {
    display: inline-block;
    top: var(--position-y);
    left: var(--position-x);
    transition:
      left 1s,
      top 1s,
      opacity 1s;
  }

  .button-yes-container--dissapearing {
    opacity: 0;
  }

  .health-bar {
    position: absolute;
    top: 0;
    left: 50%;
    background-color: #333;
    width: 12rem;
    height: 0.75rem;
    transform: translate(-50%, -200%);
  }

  .health-bar::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    width: var(--health, 100%);
    background-color: #4caf50;
    transition: width 0.3s;
  }

  .health-bar--hidden {
    opacity: 0;
    user-select: none;
  }

  :global(.slash) {
    position: absolute;
    top: var(--position-y);
    left: var(--position-x);
    width: 100px;
    transform: translate(-50%, -50%);
    z-index: 1000000;
    user-select: none;
  }

  @keyframes destroy {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
      box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
    }
    50% {
      transform: scale(1.1) rotate(10deg);
      background: #ff0000;
      box-shadow: 0 0 20px 10px rgba(255, 71, 87, 0.4);
    }
    100% {
      transform: scale(0) rotate(30deg);
      opacity: 0;
      box-shadow: 0 0 40px 20px rgba(255, 71, 87, 0);
    }
  }

  @keyframes hit {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(0.85);
    }
    60% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
