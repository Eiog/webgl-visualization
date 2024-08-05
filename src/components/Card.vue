<script setup lang='ts'>
const props = defineProps<{
  title?: string
  color?: string
}>()
</script>

<template>
  <div class="relative wh-full p-[10px]">
    <div class="absolute-rt z-1 inline-grid grid-cols-2 gap-[3px] p-[5px]">
      <span class="inline-block h-[14px] w-[14px] bg-white/30" />
      <span class="inline-block h-[14px] w-[14px] bg-white/60" />
      <span class="col-start-2 inline-block h-[14px] w-[14px] bg-white/30" />
      <div class="absolute-center">
        <svg width="12" height="12">
          <path d="M 0,0  A 12,12 0 0 1 12,12" stroke="#00FEFE" stroke-width="2" fill="none" />
        </svg>
      </div>
    </div>
    <div class="absolute-lb z-1 inline-grid grid-cols-2 gap-[3px] p-[5px]">
      <span class="inline-block h-[14px] w-[14px] bg-white/30" />
      <span class="row-start-2 inline-block h-[14px] w-[14px] bg-white/60" />
      <span class="row-start-2 inline-block h-[14px] w-[14px] bg-white/30" />
      <div class="absolute-center">
        <svg width="12" height="12">
          <path d="M 12,12  A 12,12 0 0 1 0,0" stroke="#00FEFE" stroke-width="2" fill="none" />
        </svg>
      </div>
    </div>
    <div class="bg z-0 wh-full flex-col gap-[5px] border border-white/20 rounded-lg bg-white/10 p-[10px] shadow-md shadow-white/5 backdrop-blur-xl">
      <div v-if="props.title" class="w-full flex-y-center gap-[5px]">
        <i class="i-mage-focus-fill text-lg text-[#FFC001]" />
        <span class="text-base text-[#00FEFE] font-semibold drop-shadow-md">{{ props.title }}</span>
      </div>
      <div class="min-h-0 w-full flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.bg {
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 19px,
      rgba(255, 255, 255, 0.1) 1px 100%
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 19px,
      rgba(255, 255, 255, 0.1) 1px 100%
    );
  background-size: 20px 20px;
}
.arc {
  clip-path: inset(0 0 0 0 round 20px 20px 0 0);
}
</style>
