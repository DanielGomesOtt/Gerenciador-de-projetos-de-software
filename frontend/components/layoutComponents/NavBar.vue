<script lang="js" setup>
import { Icon } from '#components'

let isOpenMobile = ref(false);

const openMenuMobile = () => {
    isOpenMobile.value = !isOpenMobile.value;
}
</script>


<template>
    <nav class="w-screen h-16 flex justify-around items-center">
        <div id="nav-brand">
            <button class="bg-gradient-to-r from-blue-800 to-indigo-800 text-white rounded-md px-4 py-2 text-lg"><a href="/home">Task Life</a></button>
        </div>
        <ul class="flex justify-around items-center w-[50%]" id="nav-items">
            <li><a href="/home" class="font-medium text-lg nav-link">Home</a></li>
            <li><a href="#" class="font-medium text-lg nav-link">Groups</a></li>
            <li><a href="#" class="font-medium text-lg nav-link">Projects</a></li>
            <li><a href="#" class="font-medium text-lg nav-link">Tasks</a></li>
        </ul>
        <a href="/account" id="account-avatar">
            <Icon name="mdi:user" color="black" size="3em"/>
        </a>
        
        <button class="bg-transparent" id="nav-toggle" @click="openMenuMobile()">
            <Icon name="mdi:format-list-bulleted" color="black" size="3em"/>
        </button>

        <ul class="w-screen top-20 absolute bg-gradient-to-r from-blue-400 to-indigo-400 text-center rounded-sm" v-if="isOpenMobile" id="menu-mobile">
            <li><a href="/home" class="font-medium text-lg text-center nav-link">Home</a></li>
            <li><a href="#" class="font-medium text-lg text-center nav-link">Groups</a></li>
            <li><a href="#" class="font-medium text-lg text-center nav-link">Projects</a></li>
            <li><a href="#" class="font-medium text-lg text-center nav-link">Tasks</a></li>
            <li><a href="/account" class="font-medium text-lg text-center nav-link">Account</a></li>
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