<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import UserAvatar from '~/components/accountComponents/UserAvatar.vue';
import FormAccount from '~/components/accountComponents/FormAccount.vue';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let userName = ref('');
let idUser = ref('');
let avatarPath = ref('');
let isOpen = ref(false);
let visibleLanguage = ref(localStorage.getItem('language'));

const showUserName = () => {
    let storage = JSON.parse(localStorage.getItem('userStorage'));
    userName.value = storage.name;
}

const uploadAvatarPath = async () => {
    try {
        let formData = new FormData();
        formData.append('id', idUser.value);
        formData.append('avatar_path', document.getElementById('upload-avatar-input').files[0]);

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'account/upload_avatar', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        isOpen.value = false;

        if(response.status == 200){
            avatarPath.value = runtimeConfig.public.BASE_URL + response.data;
            window.location.reload();
        }
    } catch(error) {
        console.error(error);
    }
}


const handleUploadInput = () => {
    document.getElementById('upload-avatar-input').click();
}

const handleInputFile = (event) => {
    isOpen.value = true;
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

const changeLanguage = () => {
    visibleLanguage.value = localStorage.getItem('language');
}

onBeforeMount(() => {
    showUserName();
    getAvatarPath();
    idUser.value = JSON.parse(localStorage.getItem('userStorage')).id;
})
</script>

<template>
    <div class="w-screen h-screen overflow-x-hidden">
        <NavBar @changeLanguageParent="changeLanguage"/>
        <div class="flex flex-col justify-center items-center mt-5">
            <div>
                <div class="flex">
                    <div class="mx-24 text-center">
                        <div class="flex">
                            <UserAvatar class="ml-10" v-if="avatarPath.length == 0"/>
                            <img class="rounded-full ml-10 w-[10em] h-[10em] object-cover object-center" :src="avatarPath.replace('\\', '/')" v-else/>
                            <form id="upload-form" enctype="multipart/form-data" hidden>
                                <input type="text" id="upload-id-user" name="id" :value="idUser" hidden>
                                <input type="file" id="upload-avatar-input" name="avatar_path" @change="handleInputFile"> 
                            </form>
                            <button class="bg-transparent mt-24" @click="handleUploadInput"><Icon name="mdi:account-box-plus-outline" size="2.4em" color="black" class="bg-transparent rounded-lg"/></button>
                        </div>
                        <span class="text-slate-800 text-xl font-semibold text-center" id="user-name-account-page">{{ userName }}</span>
                    </div>
                </div>
            </div>
            <div class="w-screen flex justify-center">
                <FormAccount :visibleLanguage="visibleLanguage"/>
            </div>
        </div>
    </div>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">Confirm your avatar upload</p>
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Confirme o upload do seu avatar</p>
            <template #footer>
                <div class="flex justify-around items-center" v-if="visibleLanguage == 'en'">
                    <button class="bg-green-600 text-white rounded-md w-28 h-10" @click="uploadAvatarPath()">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="() => {isOpen = false}">Cancel</button>
                </div>
                <div class="flex justify-around items-center" v-if="visibleLanguage == 'pt-br'">
                    <button class="bg-green-600 text-white rounded-md w-28 h-10" @click="uploadAvatarPath()">Confirmar</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="() => {isOpen = false}">Cancelar</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
