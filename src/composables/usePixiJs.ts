import { Application } from 'pixi.js'

export function usePixiJs() {
  const domRef = ref<HTMLElement>()
  const { width, height } = useElementSize(domRef)
  const canRender = computed(() => domRef.value && width.value > 0 && height.value > 0)
  const pixiApp = new Application({ width: width.value, height: height.value })

  function render() {
    if (!canRender.value)
      return
    domRef.value?.appendChild(pixiApp.canvas)
  }
  render()
  onUnmounted(() => {
    pixiApp.destroy()
  })
  return {
    domRef,
  }
}
