<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components'

let userName = ref('');
let avatar = ref('');


const showUserName = () => {
    let storage = JSON.parse(localStorage.getItem('userStorage'));
    userName.value = storage.name;
}

const uploadAvatar = (event) => {
    try{
        
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    showUserName();
})
</script>

<template>
    <div class="w-screen h-screen bg-slate-100">
        <NavBar />
    </div>
</template>