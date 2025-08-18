const waitEvent = (element: HTMLElement, event: string): Promise<Event> => {
  return new Promise((resolve) => {
    const handler = (event: Event) => {
      resolve(event)
      element.removeEventListener(event, handler)
    }

    element.addEventListener(event, handler)
  })
}

export default waitEvent
