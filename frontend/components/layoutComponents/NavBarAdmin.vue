<script lang="js" setup>
import { Icon } from '#components';
import axios from 'axios';
import CreateAdminForm from '../administratorComponents/CreateAdminForm.vue';

const runtimeConfig = useRuntimeConfig();

let isOpenMobile = ref(false);
let visibilityCreateAdminModal = ref(false);

const changeVisibilityCreateAdminModal = () => {
    visibilityCreateAdminModal.value = !visibilityCreateAdminModal.value;
}

const openMenuMobile = () => {
    isOpenMobile.value = !isOpenMobile.value;
}

const logOut = () => {
    localStorage.removeItem('adminStorage');
    navigateTo('/administrator');
}

window.addEventListener('resize', function() {
    if (window.innerWidth > '600') {
        if (isOpenMobile.value == true) {
            isOpenMobile.value = false;
        }
    }
});
</script>

<template>
    <nav class="w-screen h-16 flex justify-around items-center" id="nav-bar">
        
        <div id="nav-brand">
            <a href="/administrator/home" class="bg-blue-800 text-white rounded-md px-4 py-2 text-lg">Task Life</a>
        </div>

        
        <ul class="flex justify-around items-center w-[25%] lg:w-[30%]" id="nav-items">
            <li><a href="/administrator/home" class="font-medium text-base lg:text-lg nav-link">Home</a></li>
        </ul>

        <ul class="flex justify-around items-center w-[25%] lg:w-[30%]" id="nav-items">
            <li><a href="/administrator/projects" class="font-medium text-base lg:text-lg nav-link">Projects Management</a></li>
        </ul>

        <ul class="flex justify-around items-center w-[20%] lg:w-[20%]" id="nav-items">
            <li>
                <button class="bg-blue-600 rounded-lg p-2 text-white text-sm" @click="changeVisibilityCreateAdminModal()"><Icon name="mdi:plus" color="white" size="1.5em"/>&nbsp;New admin</button>
            </li>
        </ul>
      
        <div class="flex justify-around w-[10%]" id="nav-buttons-container" v-if="!isOpenMobile">
            <button class="bg-transparent" @click="logOut">
                <Icon name="mdi:logout" size="1.8em" color="red" />
            </button>
        </div>

        
        <button class="bg-transparent" id="nav-toggle" @click="openMenuMobile">
            <Icon name="mdi:format-list-bulleted" color="white" size="2em" />
        </button>

       
        <ul
            class="w-screen absolute pb-2 bg-blue-400 shadow-xl z-50"
            id="menu-mobile"
            style="top: 4em;"
            v-if="isOpenMobile"
        >
            <li>
                <div class="flex justify-start items-center py-2 pl-5">
                    <Icon name="mdi:home" size="1.5em" color="white" />
                    <a href="/administrator/home" class="text-lg nav-link ml-5 text-white">Home</a>
                </div>
            </li>

            <li>
                <div class="flex justify-start items-center py-2 pl-5">
                    <Icon name="mdi:clipboard-list" size="1.5em" color="white" />
                    <a href="/administrator/projects" class="text-lg nav-link ml-5 text-white">Projects Management</a>
                </div>
            </li>

            <li>
                <div class="flex justify-start items-center py-2 pl-5">
                    <Icon name="mdi:plus" size="1.5em" color="white" />
                    <a class="text-lg nav-link ml-5 text-white" @click="changeVisibilityCreateAdminModal()">New admin</a>
                </div>
            </li>

            <li>
                <div class="flex justify-start items-center py-2 pl-5">
                    <Icon name="mdi:logout" size="1.5em" color="white" />
                    <button class="text-lg nav-link bg-transparent ml-5 text-white" @click="logOut">Logout</button>
                </div>
            </li>
        </ul>
    </nav>
    <UModal v-model="visibilityCreateAdminModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex justify-end w-full">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="visibilityCreateAdminModal = false" />
            </div>
            <CreateAdminForm @changeVisibilityCreateAdminModal="changeVisibilityCreateAdminModal" />
        </UCard>
    </UModal>

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

        #mobile-project-invites {
            display: flex;
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

        #mobile-project-invites {
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
