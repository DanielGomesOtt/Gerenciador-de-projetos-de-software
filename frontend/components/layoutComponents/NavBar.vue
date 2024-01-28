<script setup lang="js">
import { ref } from 'vue';
import { Icon } from '#components'

let menuVisibility = ref(true);
</script>

<template>
    <div class="h-screen w-64 flex">
        <div class="w-1/4 bg-slate-800 h-screen" @click="menuVisibility = false">
            <ul class="list-none">
                <li class="text-center"></li>
                <li class="text-center"><Icon name="mdi:home" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="mdi:people" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="material-symbols:task" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="grommet-icons:projects" color="white" size="2em" class="mt-5"/></li>
                <li class="text-center"><Icon name="mdi:user" color="white" size="2em" class="mt-5"/></li>
            </ul>
        </div>
        <div class="w-3/4 bg-slate-800 h-screen" :hidden="menuVisibility">
            <ul class="list-none">
                <li>
                    <div class="h-[70px] flex items-center">
                        <a href="#" class="text-white">Home</a>
                        <button class="bg-transparent ml-24 mt-1" @click="menuVisibility = true"><Icon name="ic:baseline-keyboard-arrow-left" color="white" size="2em"/></button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


