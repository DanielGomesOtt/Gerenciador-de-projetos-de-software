<script lang="js" setup>
import { Icon } from '#components'

let isOpenMobile = ref(false);

const openMenuMobile = () => {
    isOpenMobile.value = !isOpenMobile.value;
}
</script>


<template>
    <nav class="w-screen h-16 flex justify-around items-center" id="nav-bar">
        <div id="nav-brand">
            <button class="bg-blue-800 text-white rounded-md px-4 py-2 text-lg"><a href="/home">Task Life</a></button>
        </div>
        <ul class="flex justify-around items-center w-[50%]" id="nav-items">
            <li><a href="/home" class="font-medium text-lg nav-link">Home</a></li>
            <li><a href="#" class="font-medium text-lg nav-link">Groups</a></li>
            <li><a href="#" class="font-medium text-lg nav-link">Projects</a></li>
            <li><a href="#" class="font-medium text-lg nav-link">Tasks</a></li>
        </ul>
        
        
        <button class="bg-transparent" id="nav-toggle" @click="openMenuMobile()">
            <Icon name="mdi:format-list-bulleted" color="white" size="2em"/>
        </button>

        <ul class="w-screen absolute text-center pb-2" v-if="isOpenMobile" id="menu-mobile" style="top: 4em;background-color:rgb(59, 59, 60);">
            <li><a href="/home" class="text-lg text-center nav-link text-blue-800" style="color: #fff">Home</a></li>
            <li><a href="#" class="text-lg text-center nav-link text-blue-800" style="color:#fff">Groups</a></li>
            <li><a href="#" class="text-lg text-center nav-link text-blue-800" style="color: #fff">Projects</a></li>
            <li><a href="#" class="text-lg text-center nav-link text-blue-800" style="color: #fff">Tasks</a></li>
            <li><a href="/account" class="text-lg text-center nav-link text-blue-800" style="color: #fff">Account</a></li>
        </ul>
        
    </nav>
</template>

<style scoped>
@media (max-width: 600px) {
  #nav-items {
    display: none;
  }

  #account-avatar {
    display: none;
  }

  #nav-toggle {
    display: block;
  }

  #menu-mobile {
    display: absolute;
  }

  #nav-bar {
    background-color: rgb(59, 59, 60);
  }
}

@media (min-width: 600px) {
  #nav-items {
    display: flex;
  }

  #account-avatar {
    display: block;
  }

  #nav-toggle {
    display: none;
  }

  #menu-mobile {
    display: none;
  }
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: black;
  transition: color 0.3s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: black;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}
</style>