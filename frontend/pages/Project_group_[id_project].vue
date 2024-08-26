<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import axios from 'axios';
import AddMemberForm from '~/components/projectGroupComponents/AddMemberForm.vue';
import DefaultModelProject from '~/components/projectGroupComponents/DefaultModelProject.vue';
import { connectSocket, sendMessage } from '../utils/socket';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

let members = ref({});
let isOpen = ref(false);
let myProjectData = ref({});
let visibilityModalAddMember = ref(false);
let isOpenModalRemoveMember = ref(false);
let idRemoveUser = ref(0);
let id_category = JSON.parse(localStorage.getItem('userStorage')).id_category;
let chat = ref('off');
let memberChatName = ref('');
let memberChatEmail = ref('');
let memberChatAvatarPath = ref('');
let memberChatId = ref('');
let chatMessage = ref('');
let idUser = JSON.parse(localStorage.getItem('userStorage')).id;


const changeChatVisibility = (id, name, email, avatarPath) => {
    if(chat.value == 'off'){
        chat.value = 'on';
    }else{
        chat.value = 'off';
    }
    memberChatId.value = id;
    memberChatName.value = name;
    memberChatEmail.value = email;
    memberChatAvatarPath.value = avatarPath;
}

const changeVisibilityModalAddMember = () => {
    isOpen.value = false;
    visibilityModalAddMember.value = !visibilityModalAddMember.value;
}

const changeVisibilityModalRemoveMember = (id_user) => {
    isOpenModalRemoveMember.value = !isOpenModalRemoveMember.value;
    if(isOpenModalRemoveMember.value == false){
        idRemoveUser.value = 0;
    }else{
        idRemoveUser.value = id_user;
    }
}

const openSlideOver = () => {
    isOpen.value = !isOpen.value;
}

const getMyProjectData = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_group/my_project_data', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_project: route.params.id_project,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id
            }
        });

        if(response.data){
            myProjectData.value = response.data;
        }else{
            navigateTo('/');
        }
    }catch(error){
        console.log(error);
    }
}

const getUsersByProject = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_group', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_project: route.params.id_project,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id
            }
        });
        if(response.data){
            members.value = response.data;
        }
    }catch(error){
        console.log(error);
    }
}

const removeMemberFromProject = async (event) => {
    try{
        event.preventDefault();

        let data = {
            'id_user': idRemoveUser.value,
            'id_project': route.params.id_project
        }

        const response = await axios.patch(runtimeConfig.public.BASE_URL + 'project_group/remove_member', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });

        if(response.status == 200){
            getUsersByProject();
        }
        changeVisibilityModalRemoveMember(0);
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    connectSocket(runtimeConfig.public.BASE_URL);
    getUsersByProject();
    getMyProjectData();
});

</script>

<template>
    <NavBar />
    <div class="flex justify-between">
        <div v-if="myProjectData && myProjectData.Project && myProjectData.Project.project_model && myProjectData.Project.project_model == 'default'">
            <DefaultModelProject :myProjectData="myProjectData"/>
        </div>
        <div class="flex items-center" v-if="id_category > 1">
            <button @click="openSlideOver" class="mr-2 absolute right-0 top-20"><Icon name="mdi:chevron-left-circle" size="2.5em" class="text-blue-400" /></button>
            <USlideover v-model="isOpen">
                <UCard
                    class="flex flex-col flex-1"
                    :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                >
                    
                    <template #header>
                        <div class="bg-blue-400 flex justify-between" v-if="chat == 'on'">
                            <div class="flex">
                                <div>
                                    <Icon name="mdi:user" size="3em" v-if="memberChatAvatarPath == null || memberChatAvatarPath.length == 0"/>
                                    <img class="w-[3em] h-[3em] object-cover object-center rounded-full" :src="runtimeConfig.public.BASE_URL + memberChatAvatarPath.replace('\\', '/')" v-if="memberChatAvatarPath && memberChatAvatarPath.length > 0"/>
                                </div>
                                <div class="grid grid-cols-1">
                                    <span class="font-bold text-base md:text-lg ml-2">
                                        {{ memberChatName }}
                                    </span>
                                    <span class="font-semibold text-sm md:text-base ml-2 text-slate-500">
                                        {{ memberChatEmail }}
                                    </span>
                                </div>
                            </div>
                            <UButton color="white" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1 hover:bg-blue-400" @click="changeChatVisibility('', '', '', '')" />
                        </div>
                        <div class="bg-blue-400 flex justify-between" v-if="chat == 'off'">
                            <button class="text-white" v-if="myProjectData.administrator" @click="changeVisibilityModalAddMember"><Icon name="mdi:plus" color="white" size="1.8em"/>New Member</button>
                            <UButton
                                color="gray"
                                variant="ghost"
                                size="sm"
                                icon="i-heroicons-x-mark-20-solid"
                                class="flex sm:hidden text-white"
                                square
                                padded
                                @click="isOpen = false"
                            />
                        </div>
                    </template>
                    <div class="h-screen snap-y">
                        <div v-for="member in members" :key="member.id" class="mb-5" v-if="chat == 'off'">
                            <UCard
                                class="flex flex-col flex-1"
                                :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, background:'bg-slate-200', shadow: 'shadow-lg', ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                            >
                                <div class="flex flex-wrap justify-between">
                                    <div class="flex flex-wrap items-center">
                                        <div>
                                            <Icon name="mdi:user" size="3em" v-if="member.avatar_path == null || member.avatar_path.length == 0"/>
                                            <img class="w-[3em] h-[3em] object-cover object-center rounded-full" :src="runtimeConfig.public.BASE_URL + member.avatar_path.replace('\\', '/')" v-if="member.avatar_path && member.avatar_path.length > 0"/>
                                        </div>
                                        <div class="grid grid-cols-1">
                                            <span class="font-bold text-base md:text-lg ml-2">
                                                {{ member.name }}
                                            </span>
                                            <span class="font-semibold text-sm md:text-base ml-2">
                                                {{ member.email }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex justify-around items-center">
                                        <button type="button" class="hover:bg-blue-600 bg-blue-400 text-white text-sm py-1 px-2 rounded-lg mx-2" @click="changeChatVisibility(member.id, member.name, member.email, member.avatar_path)">Chat</button>
                                        <button type="button" class="hover:bg-red-600 bg-red-400 text-white text-sm p-1 rounded-lg" @click="changeVisibilityModalRemoveMember(member.id)" v-if="myProjectData.administrator">Remove</button>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                    </div>
                    <template #footer>
                        <div
                            class="w-full flex items-center absolute inset-x-0 bottom-0 p-3 bg-white border-t border-slate-300"
                            v-if="chat == 'on'"
                        >
                            <input
                            type="text"
                            class="w-5/6 h-10 p-3 border-2 border-slate-400 rounded-l"
                            placeholder="Type a message"
                            v-model="chatMessage"
                            />
                            <button
                                type="button"
                                class="w-1/6 h-10 p-3 bg-blue-600 text-white flex items-center justify-center rounded-r"
                                @click="sendMessage(runtimeConfig.public.BASE_URL, idUser, memberChatId, chatMessage)"
                            >
                                <Icon name="mdi:send-variant" size="1em" />
                            </button>
                        </div>
                    </template>
                </UCard>
            </USlideover>
        </div>
    </div>
    <UModal v-model="visibilityModalAddMember">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <AddMemberForm @changeVisibilityModalAddMember="changeVisibilityModalAddMember"/>
        </UCard>
    </UModal>
    <UModal v-model="isOpenModalRemoveMember">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <p class="text-center text-2xl font-semibold">Are you sure you want to proceed with this action?</p>
            <template #footer>
                <div class="flex justify-around items-center">
                    <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="removeMemberFromProject($event)">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalRemoveMember(0)">Cancel</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>