<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable vue/no-unused-refs -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-console -->
<script setup lang='ts'>
// import * as echarts from 'echarts/core'
import * as THREE from 'three'
// import type { ECOption } from '~/composables/useEcharts'

const { width, height } = useAutoRatio(16 / 9)
const { domRef, group, cameraTween, cameraTweenLookAtObj, renderer, scene, onRendered, createLoader, onIntersectObject, setSkyBox, camera, isMeshType, selectedObjectEffect } = useThreeJs()
const { loader } = createLoader('gltf/')
const cardRef = ref<HTMLElement>()
function createBall() {
  const ballMat = new THREE.MeshStandardMaterial({
    color: '#333', // 材质的颜色
  })
  const ballGeometry = new THREE.SphereGeometry(1, 32, 32)
  const ballMesh = new THREE.Mesh(ballGeometry, ballMat)
  ballMesh.castShadow = true
  ballMesh.position.set(30, 1, 20)
  scene.add(ballMesh)
  return {
    ballMesh,
  }
}
function createFloor() {
  const floorMat = new THREE.MeshStandardMaterial({
    color: '#f1f1f1', // 材质的颜色
  })
  const floorGeometry = new THREE.BoxGeometry(300, 300, 0.01, 1, 1, 1)
  const floorMesh = new THREE.Mesh(floorGeometry, floorMat)
  floorMesh.receiveShadow = true
  floorMesh.rotation.x = -Math.PI / 2.0
  scene.add(floorMesh)
}
function createSkyBox() {
  const path = 'skybox/night/'
  const format = '.jpg'
  const paths = [`${path}posx${format}`, `${path}negx${format}`, `${path}posy${format}`, `${path}negy${format}`, `${path}posz${format}`, `${path}negz${format}`]
  setSkyBox(scene, paths)
}
function loadSu7() {
  loader.load('xiaomi_su7/scene.gltf', (gltf) => {
    scene.add(gltf.scene)
    const mesh = new THREE.MeshPhysicalMaterial({
      color: '#22d3ee',
      metalness: 1,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    })
    const meshArr = [
      'Object_18', // 车身
      'Object_20', // 车身下
      // 'Object_21', // 前后玻璃
      // 'Object_22', // 后刹车灯
      // 'Object_23', // 前车灯
      // 'Object_24', // 前车灯行车灯
      'Object_25', // 风挡边框
      // 'Object_27', // 车门内
      // 'Object_28', // 内地板
      // 'Object_29', // 车架内
      'Object_31', // 主驾玻璃框
      'Object_32', // 主驾车门
      'Object_33', // 主驾后视镜框
      // 'Object_34', // 主驾后视镜
      // 'Object_35', // 主驾车门内
      // 'Object_36', // 主驾玻璃
      'Object_38', // 左后玻璃框
      'Object_39', // 左后车门
      // 'Object_40', // 左后玻璃
      // 'Object_41', // 左后车门内
      'Object_44', // 副驾玻璃框
      'Object_45', // 副驾车门
      'Object_46', // 副驾后视镜框
      // 'Object_47', // 副驾后视镜
      // 'Object_48', // 副驾车门内
      // 'Object_49', // 副驾玻璃
      'Object_51', // 右后玻璃框
      'Object_52', // 右后车门
      // 'Object_53', // 右后玻璃
      // 'Object_54', // 右后车门内

    ]

    gltf.scene.traverse((obj) => {
      renderer.domElement.addEventListener('click', (ev) => {
        if (onIntersectObject(renderer, camera, obj, ev)) {
          console.log(obj.name)
          selectedObjectEffect(obj)
        }
      })
      if (isMeshType(obj) && obj.isMesh) {
        if (meshArr.includes(obj.name)) {
          obj.material = mesh
        }
      }
    })
  }, (xhr) => {
    const percent = xhr.loaded / xhr.total
    console.log(percent)
  }, (err) => {
    console.log(err)
  })
}
onRendered(() => {
  console.log('渲染')

  camera.position.set(10, 100, 100)
  createFloor()
  createSkyBox()
  createBall()
  loadSu7()
  loader.load('2022__lamborghini_huracan_super_trofeo_evo2/scene.gltf', (data) => {
    scene.add(data.scene)
    console.log(data)
    data.scene.traverse((obj) => {
      obj.castShadow = true
    })
    renderer.domElement.addEventListener('click', (ev) => {
      data.scene.traverse((obj) => {
        if (isMeshType(obj) && obj.isMesh) {
          if (onIntersectObject(renderer, camera, obj, ev)) {
            console.log(obj)
            selectedObjectEffect(obj)
          }
        }
      })
    })
    setTimeout(() => {
      cameraTweenLookAtObj(data.scene)
      setTimeout(() => {
        cameraTween({ x: 100, y: 100, z: 100 }, { x: 0, y: 0, z: 0 })
        console.log(group.getAll())
      }, 1000 * 1)
    }, 1000 * 2)
  })
})
// // function ball() {
// //   const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

// //   // material
// //   const pointMaterial = new THREE.PointsMaterial({
// //     size: 0.02,
// //     sizeAttenuation: false,
// //   })

// //   const particles = new THREE.Points(sphereGeometry, pointMaterial)
// //   scene.add(particles)
// //   onAnimate(() => {
// //     pointMaterial.needsUpdate = true
// //   })
// //   controls.autoRotate = true
// //   axesHelper.visible = false
// //   gui.addBinding(controls, 'autoRotate')
// //   gui.addBinding(controls, 'autoRotateSpeed', {
// //     step: 0.01,
// //     min: 0.1,
// //     max: 10,
// //   })
// //   gui.addBinding(pointMaterial, 'size', {
// //     step: 0.001,
// //     min: 0.01,
// //     max: 1,
// //   })
// //   gui.addBinding(pointMaterial, 'sizeAttenuation')
// // }
// onMounted(() => {

// })
// const options = ref<ECOption>({
//   color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross',
//       label: {
//         backgroundColor: '#6a7985',
//       },
//     },
//   },
//   legend: {
//     data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
//   },
//   toolbox: {
//     feature: {
//       saveAsImage: {},
//     },
//   },
//   grid: {
//     left: '0%',
//     right: '0%',
//     bottom: '0%',
//     containLabel: true,
//   },
//   xAxis: [
//     {
//       type: 'category',
//       boundaryGap: false,
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     },
//   ],
//   yAxis: [
//     {
//       type: 'value',
//     },
//   ],
//   series: [
//     {
//       name: 'Line 1',
//       type: 'line',
//       stack: 'Total',
//       smooth: true,
//       lineStyle: {
//         width: 0,
//       },
//       showSymbol: false,
//       areaStyle: {
//         opacity: 0.8,
//         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: 'rgb(128, 255, 165)',
//           },
//           {
//             offset: 1,
//             color: 'rgb(1, 191, 236)',
//           },
//         ]),
//       },
//       emphasis: {
//         focus: 'series',
//       },
//       data: [140, 232, 101, 264, 90, 340, 250],
//     },
//     {
//       name: 'Line 2',
//       type: 'line',
//       stack: 'Total',
//       smooth: true,
//       lineStyle: {
//         width: 0,
//       },
//       showSymbol: false,
//       areaStyle: {
//         opacity: 0.8,
//         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: 'rgb(0, 221, 255)',
//           },
//           {
//             offset: 1,
//             color: 'rgb(77, 119, 255)',
//           },
//         ]),
//       },
//       emphasis: {
//         focus: 'series',
//       },
//       data: [120, 282, 111, 234, 220, 340, 310],
//     },
//     {
//       name: 'Line 3',
//       type: 'line',
//       stack: 'Total',
//       smooth: true,
//       lineStyle: {
//         width: 0,
//       },
//       showSymbol: false,
//       areaStyle: {
//         opacity: 0.8,
//         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: 'rgb(55, 162, 255)',
//           },
//           {
//             offset: 1,
//             color: 'rgb(116, 21, 219)',
//           },
//         ]),
//       },
//       emphasis: {
//         focus: 'series',
//       },
//       data: [320, 132, 201, 334, 190, 130, 220],
//     },
//     {
//       name: 'Line 4',
//       type: 'line',
//       stack: 'Total',
//       smooth: true,
//       lineStyle: {
//         width: 0,
//       },
//       showSymbol: false,
//       areaStyle: {
//         opacity: 0.8,
//         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: 'rgb(255, 0, 135)',
//           },
//           {
//             offset: 1,
//             color: 'rgb(135, 0, 157)',
//           },
//         ]),
//       },
//       emphasis: {
//         focus: 'series',
//       },
//       data: [220, 402, 231, 134, 190, 230, 120],
//     },
//     {
//       name: 'Line 5',
//       type: 'line',
//       stack: 'Total',
//       smooth: true,
//       lineStyle: {
//         width: 0,
//       },
//       showSymbol: false,
//       label: {
//         show: true,
//         position: 'top',
//       },
//       areaStyle: {
//         opacity: 0.8,
//         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: 'rgb(255, 191, 0)',
//           },
//           {
//             offset: 1,
//             color: 'rgb(224, 62, 76)',
//           },
//         ]),
//       },
//       emphasis: {
//         focus: 'series',
//       },
//       data: [220, 302, 181, 234, 210, 290, 150],
//     },
//   ],
// })
// const { domRef: eChartRef } = useEcharts(options, computed(() => true))
</script>

<template>
  <div class="bg relative" :style="{ width: `${width}px`, height: `${height}px` }">
    <div class="pointer-events-none absolute inset-0 wh-full p-[20px]">
      <Card ref="cardRef" title="CustomCardName" class="h-[400px] w-[300px]">
        <!-- <div ref="eChartRef" class="wh-full" /> -->
      </Card>
      <div id="card-tag" class="h-[2px] w-[2px] bg-white/20">
        Card
      </div>
    </div>
    <div ref="domRef" class="wh-full bg-black" />
  </div>
</template>

<style scoped lang='less'>
.bg {
  background-image: url('~/assets/tao-yuan-P1prLTHPVCQ-unsplash.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
