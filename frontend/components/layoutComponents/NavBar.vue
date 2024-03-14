<script setup lang="js">
import { ref, onBeforeMount } from 'vue';
import { Icon } from '#components'
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let menuVisibility = ref(true);
let accountIcon = ref('mdi:user');
let userName = ref('');

const getUserAvatar = async () => {
    const response = await axios.get(runtimeConfig.public.BASE_URL + 'account/avatar', 
    {
        headers: {
            'user': localStorage.getItem('userStorage')
        }
    });
    if(response && response.data && response.data.avatar_path){
        accountIcon.value = response.data.avatar_path
    }
}

const showUserName = () => {
    let storage = JSON.parse(localStorage.getItem('userStorage'));
    userName.value = storage.name;
}

onBeforeMount(() => {
    getUserAvatar();
    showUserName();
})


</script>

<template>
    <div class="h-screen w-64 flex">
        <div class="w-1/4 bg-slate-800 h-screen" @click="menuVisibility = false">
            <ul class="list-none">
                <li class="text-center">
                    <Icon name="mdi:user" color="white" size="2em" class="mt-5" v-if="accountIcon == 'mdi:user'"/>
                    <img :src="runtimeConfig.public.BASE_AVATAR_PATH" v-if="accountIcon !== 'mdi:user'"/>
                </li>
                <li class="text-center"><Icon name="mdi:home" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="mdi:people" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="material-symbols:task" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="grommet-icons:projects" color="white" size="2em" class="mt-5"/></li>
            </ul>
        </div>
        <transition name="slide">
            <div class="w-3/4 bg-slate-800 h-screen" v-if="!menuVisibility" id="navbar-container">
                <ul class="list-none">
                    <li>
                        <div class="h-[70px] flex items-center">
                            <a href="account" class="text-white">{{ userName }}</a>
                            <button class="bg-transparent ml-16 mt-1" @click="menuVisibility = true"><Icon name="ic:baseline-keyboard-arrow-left" color="white" size="2em"/></button>
                        </div>
                    </li>
                    <li>
                        <div class="h-[37px] flex items-center">
                            <a href="home" class="text-white">Home</a>
                        </div>
                    </li>
                    <li>
                        <div class="h-[70px] flex items-center">
                            <a href="#"></a>
                        </div>
                    </li>
                    <li>
                        <div class="h-[70px] flex items-center">
                            <a href="#"></a>
                        </div>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<style scoped>

.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
  z-index: -1;
}

.slide-enter-to, .slide-leave-from {
  z-index: -1;
}

</style>
