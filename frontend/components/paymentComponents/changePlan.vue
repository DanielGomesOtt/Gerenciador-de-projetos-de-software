<script lang="js" setup>

let currentPlan = ref('');

onBeforeMount(() => {
    currentPlan.value = JSON.parse(localStorage.getItem('userStorage')).type_premium;
})
</script>

<template>
    <h3 class="text-3xl md:text-5xl font-bold text-center mt-56">Your current plan is {{ currentPlan }}</h3>
    <p class="text-lg md:text-2xl font-semibold text-center mt-5 text-slate-400">Change or cancel your plan</p>
    <div class="flex justify-around">
        <button class="bg-blue-500 text-white p-2 rounded-lg mt-5">Edit your plan</button>
    </div>
</template>