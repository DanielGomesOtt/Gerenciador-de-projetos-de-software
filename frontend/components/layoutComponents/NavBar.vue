<script lang="js" setup>
import { Icon } from '#components';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let isOpenMobile = ref(false);
let avatarPath = ref('');

const openMenuMobile = () => {
    isOpenMobile.value = !isOpenMobile.value;
}

const logOut = () => {
  localStorage.removeItem('userStorage');
  navigateTo('/');
}

const getAvatarPath = async () => {
    try{
      const response = await axios.get(runtimeConfig.public.BASE_URL + 'account/upload_avatar', {
        headers: {
          'id': JSON.parse(localStorage.getItem('userStorage')).id,
        }
      });
      
      if(response.status == 200 && response.data && response.data.length > 0){
        avatarPath.value = runtimeConfig.public.BASE_URL + response.data.replace('\\', '/');
      }else{
        avatarPath.value = '';
      }
    }catch(error){
      console.log(error);
    }
}

onBeforeMount(() => {
  getAvatarPath();
});

window.addEventListener('resize', function() {
  if(window.innerWidth > '600'){
    if(isOpenMobile.value == true){
      isOpenMobile.value = false;
    }
  }
});

</script>


<template>
    <nav class="w-screen h-16 flex justify-around items-center" id="nav-bar">
      <div id="nav-brand">
          <button class="bg-blue-800 text-white rounded-md px-4 py-2 text-lg"><a href="/home">Task Life</a></button>
      </div>
      <ul class="flex justify-around items-center w-[45%]" id="nav-items" v-if="!isOpenMobile">
          <li><a href="/home" class="font-medium text-lg nav-link">Home</a></li>
          <li><a href="/project" class="font-medium text-lg nav-link">Projects</a></li>
          <li><a href="#" class="font-medium text-lg nav-link">Tasks</a></li>
      </ul>
      
      <div class="flex justify-around w-[15%]" id="nav-buttons-container" v-if="!isOpenMobile">
        <a href="/account">
          <Icon name="mdi:user" size="2em" v-if="avatarPath.length == 0"/>
          <img class="w-[2em] h-[2em] object-cover object-center rounded-full" :src="avatarPath.replace('\\', '/')" v-else/>
        </a>
        <button class="bg-transparent" @click="logOut()">
          <Icon name="mdi:logout" size="1.8em" color="red"/>
        </button>
      </div>
      <button class="bg-transparent" id="nav-toggle" @click="openMenuMobile()">
          <Icon name="mdi:format-list-bulleted" color="white" size="2em"/>
      </button>

      <ul class="w-screen absolute pb-2 bg-blue-400 shadow-xl" v-if="isOpenMobile" id="menu-mobile" style="top: 4em;">
          <li>
            <div class="flex justify-start items-center">
              <Icon name="mdi:home" size="1.5em" color="white" class="ml-5" />
              <a href="/home" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Home</a>
            </div>
          </li>
          <li>
            <div class="flex justify-start items-center">
              <Icon name="mdi:clipboard-list" size="1.5em" color="white" class="ml-5"/>
              <a href="/project" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Projects</a>
            </div>
          </li>
          <li>
            <div class="flex justify-start items-center">
              <Icon name="mdi:check-underline" size="1.5em" color="white" class="ml-5"/>
              <a href="#" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Tasks</a>
            </div>
          </li>
          <li>
            <div class="flex justify-start items-center">
              <Icon name="mdi:account-arrow-right" size="1.5em" color="white" class="ml-5"/>
              <a href="/account" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Account</a>
            </div>
          </li>
          <li>
            <div class="flex justify-start items-center">
              <Icon name="mdi:logout" size="1.5em" color="white" class="ml-5"/>
              <button  class="text-lg nav-link text-blue-800 bg-transparent ml-10" style="color: #fff" @click="logOut()">Logout</button>
            </div>
          </li>
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
    background-color: #60a5fa;
  }

  #nav-buttons-container {
    display: none;
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

  #nav-buttons-container {
    display: flex;
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