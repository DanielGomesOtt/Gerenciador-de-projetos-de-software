<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components'

let userName = ref('');

const showUserName = () => {
    let storage = JSON.parse(localStorage.getItem('userStorage'));
    userName.value = storage.name;
}

onBeforeMount(() => {
    showUserName();
})
</script>

<template>
    <div class="flex w-screen h-full">
        <NavBar class="absolute"/>
        <div class="flex w-full justify-around">
            <div class="flex flex-col">
                <Icon name="mdi:user"  size="10em" class="mt-10 border-2 border-black rounded-full shadow-md bg-slate-800 text-white" />
                <span class="text-slate-800 text-center mt-2 font-bold text-2xl">{{ userName }}</span>
            </div>
            <div>

            </div>
        </div>
    </div>
</template>