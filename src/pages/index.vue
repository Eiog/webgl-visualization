<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-console -->
<script setup lang='ts'>
// import * as echarts from 'echarts/core'
import { BufferAttribute, BufferGeometry, CanvasTexture, Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Points, PointsMaterial, ShaderMaterial, SphereGeometry, Vector3 } from 'three'
// import type { ECOption } from '~/composables/useEcharts'
import earthVertex from '~/shaders/earth/vertex.vs?raw'
import earthFragment from '~/shaders/earth/fragment.fs?raw'

const { domRef, gltfLoader, textureLoader, createArrowHelper, tween, lon2xyz, renderer, scene, onBeforeAnimate, onRendered, camera } = useThreeJs()
gltfLoader.setPath('gltf/')
function removeIndexLoading() {
  const indexLoading = document.getElementById('index-loading')
  if (indexLoading) {
    setTimeout(() => {
      indexLoading.classList.add('loading-out')
      setTimeout(() => {
        indexLoading?.remove()
        const indexStyle = document.querySelectorAll('.index-loading-style')
        indexStyle.forEach((f) => {
          f.remove()
        })
      }, 1000 * 0.5)
    }, 1000 * 0.4)
  }
}

function circleTexture(options?: {
  width?: number
  height?: number
  radius?: number
  shadow?: number
  shadowColor?: string
  color?: string
  line?: number
  lineWidth?: number
  lineColor?: string
}) {
  const { width = 100, height = 100, radius = 20, shadow, shadowColor = '#fff', color = '#fff', line, lineColor = '#fff' } = options ?? {}
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI)

  if (shadow) {
    ctx.shadowColor = shadowColor
    ctx.shadowBlur = 20
  }
  if (line) {
    ctx.lineWidth = line
    ctx.strokeStyle = lineColor
    ctx.stroke()
  }
  else {
    ctx.fillStyle = color
    ctx.fill()
  }
  // 绘制圆
  const texture = new CanvasTexture(canvas)
  return texture
}
function createEarth(options?: {
  R?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  showPoint?: boolean
}) {
  const { R = 50, showPoint = true } = options ?? {}
  const group = new Group()
  group.name = 'earth-group'

  const earthGeometry = new SphereGeometry(R, 32 * 2, 32 * 2)
  const earthMaterial = new ShaderMaterial({
    uniforms: {
      map: {
        value: textureLoader.load('map/2k_earth_nightmap.jpg'),
      },
      glowColor: {
        value: new Color('#000'),
      },
      scale: {
        value: -1.0,
      },
      bias: {
        value: 1.0,
      },
      power: {
        value: 3.3,
      },
      time: {
        value: 100,
      },
      isHover: {
        value: false,
      },
    },
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
  })
  earthMaterial.needsUpdate = true
  const earthMesh = new Mesh(earthGeometry, earthMaterial)
  earthMesh.name = 'earth'
  group.add(earthMesh)
  const pointMaterial = new PointsMaterial({
    color: 0x81FFFF, // 设置颜色，默认 0xFFFFFF
    transparent: true,
    sizeAttenuation: true,
    opacity: 0.1,
    vertexColors: false, // 定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
    size: 0.1, // 定义粒子的大小。默认为1.0
  })
  const pointsGeometry = new SphereGeometry(R + 10, 32 * 2, 32 * 2)
  const points = new Points(pointsGeometry, pointMaterial)
  points.name = 'earth-points'
  points.visible = showPoint
  group.add(points)
  return {
    group,
    earthGeometry,
    earthMaterial,
    earthMesh,
    pointsGeometry,
    pointMaterial,
    points,
  }
}
function createStar() {
  const vertices: number[] = []
  const colors: any[] = []
  for (let i = 0; i < 1000; i++) {
    const vertex = new Vector3()
    vertex.x = 800 * Math.random() - 300
    vertex.y = 800 * Math.random() - 300
    vertex.z = 800 * Math.random() - 300
    vertices.push(vertex.x, vertex.y, vertex.z)
    colors.push(new Color(1, 1, 1))
  }
  const around = new BufferGeometry()
  around.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))
  around.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
  const aroundMaterial = new PointsMaterial({
    size: 0,
    sizeAttenuation: true, // 尺寸衰减
    color: '#fff',
    transparent: true,
    opacity: 1,
    depthWrite: false,
    map: circleTexture({ radius: 10, shadow: 10 }),
  })
  const aroundPoints = new Points(around, aroundMaterial)
  aroundPoints.name = 'stars'
  aroundPoints.scale.set(1, 1, 1)
  function onUpdate({ size, opacity }: any) {
    aroundPoints.material.size = size
    aroundMaterial.opacity = opacity
  }
  tween({ size: 0, opacity: 1 }).to({ size: 20, opacity: 0 }, 1000 * 2).chain(
    // tween({ size: 6, opacity: 1 }).to({ size: 0, opacity: 0 }, 1000 * 2).onUpdate(onUpdate).delay(1000).start(),
  ).onUpdate(onUpdate).repeat(Infinity).repeatDelay(500).start()

  return {
    around,
    aroundMaterial,
    aroundPoints,
  }
}
function createScatter(R: number, lon: number, lat: number) {
  const { x, y, z } = lon2xyz(R, lon, lat)
  const scatterGroup = new Group()
  scatterGroup.name = 'scatter-GROUP'
  scatterGroup.position.set(x, y, z)
  scatterGroup.scale.set(5, 5, 5)
  const meshNormal = new Vector3(0, 0, 1)
  const coordVec3 = new Vector3(x, y, z).normalize()
  scatterGroup.quaternion.setFromUnitVectors(meshNormal, coordVec3) // 调整姿态

  createArrowHelper(coordVec3, new Vector3(x, y, z), 20)
  const pointsGeometry = new PlaneGeometry(1, 1)
  const pointMaterial = new MeshBasicMaterial({
    map: circleTexture(),
    transparent: true,
    opacity: 0.5,
    color: '#ffa502',
    depthWrite: false,
  })
  const pointMesh = new Mesh(pointsGeometry, pointMaterial)
  pointMesh.name = 'point'
  scatterGroup.add(pointMesh)

  const scatterGeometry = new PlaneGeometry(2, 2)
  const scatterMaterial = new MeshBasicMaterial({
    map: circleTexture({ radius: 10, shadow: 10 }),
    transparent: true,
    opacity: 0.5,
    color: '#fff100',
    depthWrite: false,
  })
  const scatterMesh = new Mesh(scatterGeometry, scatterMaterial)
  scatterMesh.name = 'scatter'
  scatterGroup.add(scatterMesh)
  return {
    pointsGeometry,
    pointMaterial,
    pointMesh,
    scatterGroup,
  }
}
renderer.setClearColor(new Color('#000'))
const { group: earthGroup } = createEarth()
const { aroundPoints: stars } = createStar()
const { scatterGroup } = createScatter(50, 10, 10)
onRendered(() => {
  console.log('渲染')
  removeIndexLoading()
  camera.position.set(200, 0, 0)

  scene.add(earthGroup)
  scene.add(stars)
  earthGroup.add(scatterGroup)
  console.log(earthGroup)
})
onBeforeAnimate(() => {

})
</script>

<template>
  <!-- <div class="bg relative" :style="{ width: `${width}px`, height: `${height}px` }">
    <div class="pointer-events-none absolute inset-0 wh-full p-[20px]">
      <Card ref="cardRef" title="CustomCardName" class="h-[400px] w-[300px]">
        C
      </Card>
      <div id="card-tag" class="h-[2px] w-[2px] bg-white/20">
        Card
      </div>
    </div>
  </div> -->
  <div ref="domRef" class="wh-full" />
</template>

<style scoped lang='less'>
.bg {
  background-image: url('~/assets/tao-yuan-P1prLTHPVCQ-unsplash.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
