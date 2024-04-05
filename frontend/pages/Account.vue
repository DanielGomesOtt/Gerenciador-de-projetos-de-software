<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import UserAvatar from '~/components/accountComponents/UserAvatar.vue';
import FormAccount from '~/components/accountComponents/FormAccount.vue';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let userName = ref('');
let avatar_path = ref('');
let idUser = ref('');
const isOpen = ref(false);

const showUserName = () => {
    let storage = JSON.parse(localStorage.getItem('userStorage'));
    userName.value = storage.name;
}

const uploadAvatarPath = async (event) => {
    try{
        event.preventDefault();
        let form = document.getElementById('upload-form');
        let formData = new FormData(form);
       
        const response = await axios.post(runtimeConfig.public.BASE_URL + 'account/upload_avatar', formData, {
            headers: {
                authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
    }catch(error){
        console.log(error);
    }
}

const handleUploadInput = () => {
    document.getElementById('upload-avatar-input').click();
}

const handleInputFile = (event) => {
    avatar_path.value = event.target.files[0];
    isOpen.value = true;
}

onBeforeMount(() => {
    showUserName();
    idUser.value = JSON.parse(localStorage.getItem('userStorage')).id;
})

</script>

<template>
    <div class="w-screen h-screen overflow-x-hidden">
        <NavBar />
        <div class="flex flex-col justify-center items-center mt-5">
            <div>
                <div class="flex">
                    <div class="mx-24 text-center">
                        <div class="flex">
                            <UserAvatar class="ml-10"/>
                            <form id="upload-form" enctype="multipart/form-data" hidden>
                                <input type="text" id="upload-id-user" name="id" :value="idUser">
                                <input type="file" id="upload-avatar-input" name="avatar_path" @input="handleInputFile($event)"> 
                            </form>
                            <button class="bg-transparent mt-24" @click="handleUploadInput()"><Icon name="mdi:account-box-plus-outline" size="2.4em" color="black" class=" bg-transparent rounded-lg"/></button>
                        </div>
                        <span class="text-slate-800 text-xl font-semibold text-center" id="user-name-account-page">{{ userName }}</span>
                    </div>
                </div>
            </div>
            <div class="w-screen flex justify-center">
                <FormAccount />
            </div>
        </div>
    </div>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

            <p class="text-center text-2xl font-semibold">Confirm your avatar upload</p>

            <template #footer>
                <div class="flex justify-around items-center">
                    <button class="bg-green-600 text-white rounded-md w-28 h-10" @click="uploadAvatarPath($event)">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="() => {isOpen = false}">Cancel</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
