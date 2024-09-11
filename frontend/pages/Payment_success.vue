<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';

onMounted(() => {
    setTimeout(() => {
        navigateTo('/');
    }, 3000);
});
</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center">
            <div class="text-center w-full">
                <Icon name="mdi:check-underline-circle-outline" class="text-green-500" size="5em"/>
                <h1 class="text-5xl font-bold">Successful Payment</h1>
            </div>
    </div>
</template>