<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import axios from 'axios';
import AddMemberForm from '~/components/projectGroupComponents/AddMemberForm.vue';
import DefaultModelProject from '~/components/projectGroupComponents/DefaultModelProject.vue';
import { connectSocket, sendMessage, receiveMessage, disconnectSocket } from '../utils/socket';

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
let conversationMessages = ref([]);
let quantityUnreadMessages = ref([]);
let isProjectPremium = ref(false);
let visibleLanguage = ref(localStorage.getItem('language'));


const setMessageNotification = (id_user) => {
    let quantity = 0;
    quantityUnreadMessages.value.forEach((message) => {
        if(id_user == message.id_sender){
            quantity++;
        }
    });

    return quantity;
}

const updateMessageToRead = async (id_user) => {
    let data = {
        'id_sender': id_user,
        'id_recipient': JSON.parse(localStorage.getItem('userStorage')).id
    };

    const response = await axios.patch(runtimeConfig.public.BASE_URL + 'unread_messages', data);

    quantityUnreadMessages.value = quantityUnreadMessages.value.filter((user) => user.id_sender !== id_user);
}

const getNumberOfUnreadMessages = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'unread_messages', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id,
            }
        });
        
        response.data.forEach((message) => {
            let unread = {
                'id_sender': message.id_sender,
            };
            quantityUnreadMessages.value = [];
            quantityUnreadMessages.value.push(unread);
        }); 
        
    }catch(error){
        console.log(error);
    }
}

const handleMessage = (message) => {
    if(memberChatId.value == message.senderId){
        conversationMessages.value.push([message.senderId, message.message, message.id]);
    }
    let unread = {
        'id_sender': message.senderId
    };
    quantityUnreadMessages.value.push(unread);
    setMessageNotification(message.senderId);
}
const changeChatVisibility = (id, name, email, avatarPath) => {
    memberChatId.value = id;
    memberChatName.value = name;
    memberChatEmail.value = email;
    memberChatAvatarPath.value = avatarPath;
    if(chat.value == 'off'){
        getMessages();
        chat.value = 'on';
    }else{
        conversationMessages.value = [];
        chat.value = 'off';
    }
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

const sendMessageToMember = () => {
    sendMessage(JSON.parse(localStorage.getItem('userStorage')).id, memberChatId.value, chatMessage.value, (response) => {
        conversationMessages.value.push([JSON.parse(localStorage.getItem('userStorage')).id, chatMessage.value, response.messageId]);
        chatMessage.value = '';
    });
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
            isProjectPremium.value = response.data.project_premium;
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

const getMessages = async () => {
    try{
        let query = {
            'id_sender': JSON.parse(localStorage.getItem('userStorage')).id,
            'id_recipient': memberChatId.value,
        };

        let response = await axios.get(runtimeConfig.public.BASE_URL + 'message', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
               'id_sender': query.id_sender,
               'id_recipient': query.id_recipient,
               'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
            }
        });
        
        if(response && response.data){
            conversationMessages.value = [];
            response.data.forEach(message => {
                conversationMessages.value.push([message.id_sender, message.message, message.id]);
            });
        }
    }catch(error){
        console.log(error);
    }
}

const deleteMessage = async (id_message, type_delete) => {
    try{
        const response = await axios.patch(runtimeConfig.public.BASE_URL + 'delete_message', { 'id_message': id_message, 'id_user': JSON.parse(localStorage.getItem('userStorage')).id, 'type_delete': type_delete }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });
        getMessages();
    }catch(error){
        console.log(error);
    }
}

const getProjectCreatorData = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + `project/${route.params.id_project}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });

        if(response.data.project_premium == 1){
            isProjectPremium.value = true;
        }else{
            isProjectPremium.value = false;
        }

    }catch(error){
        console.log(error);
    }
}

const changeLanguage = () => {
    visibleLanguage.value = localStorage.getItem('language');
}

onBeforeMount(() => {
    connectSocket(runtimeConfig.public.BASE_URL);
    getUsersByProject();
    getMyProjectData();
    getProjectCreatorData();
});

onMounted(() => {
    receiveMessage(handleMessage);
    getNumberOfUnreadMessages();
});

onUnmounted(() => {
    disconnectSocket();
})

</script>

<template>
    <NavBar @changeLanguageParent="changeLanguage"/>
    <div class="flex justify-between">
        <div v-if="myProjectData && myProjectData.Project && myProjectData.Project.project_model && myProjectData.Project.project_model == 'default'">
            <DefaultModelProject :myProjectData="myProjectData" :visibleLanguage="visibleLanguage"/>
        </div>
        <div class="flex items-center" v-if="id_category > 1">
            <UChip size="2xl" class="mr-2 fixed right-5 bottom-14" v-if="quantityUnreadMessages.length > 0 && isProjectPremium == true">
                <button @click="openSlideOver" class="mr-2 fixed right-5 bottom-5"><Icon name="mdi:chat" size="2.8em" class="text-white bg-blue-400 rounded-full p-2" /></button>
            </UChip>
            <button @click="openSlideOver" class="mr-2 fixed right-5 bottom-5" v-else><Icon name="mdi:chat" size="2.8em" class="text-white bg-blue-400 rounded-full p-2" /></button>
            <USlideover v-model="isOpen">
                <UCard
                    class="flex flex-col flex-1 overflow-auto"
                    :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1'}, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
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
                            <button class="text-white" v-if="myProjectData.administrator && visibleLanguage == 'en'" @click="changeVisibilityModalAddMember"><Icon name="mdi:plus" color="white" size="1.8em"/>New Member</button>
                            <button class="text-white" v-if="myProjectData.administrator && visibleLanguage == 'pt-br'" @click="changeVisibilityModalAddMember"><Icon name="mdi:plus" color="white" size="1.8em"/>Novo Membro</button>
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
                    
                    <div>
                        <div v-for="member in members" :key="member.id" class="mb-5" v-if="chat == 'off'">
                            
                            <UCard
                                class="flex flex-col flex-1"
                                :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, background:'bg-slate-200', shadow: 'shadow-lg', ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                            >
                                <div>
                                    <div class="flex flex-wrap items-center">
                                        <div v-if="setMessageNotification(member.id) > 0 && isProjectPremium == true">
                                            <UChip size="xl" class="w-full">
                                                <Icon name="mdi:user" size="3em" v-if="member.avatar_path == null || member.avatar_path.length == 0"/>
                                                <img class="w-[3em] h-[3em] object-cover object-center rounded-full" :src="runtimeConfig.public.BASE_URL + member.avatar_path.replace('\\', '/')" v-if="member.avatar_path && member.avatar_path.length > 0"/>
                                            </UChip>
                                        </div>
                                        <div v-else>
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
                                    <div class="flex items-center mt-2" v-if="visibleLanguage == 'en'">
                                        <button type="button" class="hover:bg-blue-600 bg-blue-400 text-white text-sm py-1 px-2 rounded-lg mx-2" @click="changeChatVisibility(member.id, member.name, member.email, member.avatar_path)" v-if="isProjectPremium == true">Chat</button>
                                        <button type="button" class="hover:bg-red-600 bg-red-400 text-white text-sm p-1 rounded-lg" @click="changeVisibilityModalRemoveMember(member.id)" v-if="myProjectData.administrator">Remove</button>
                                    </div>
                                    <div class="flex items-center mt-2" v-if="visibleLanguage == 'pt-br'">
                                        <button type="button" class="hover:bg-blue-600 bg-blue-400 text-white text-sm py-1 px-2 rounded-lg mx-2" @click="changeChatVisibility(member.id, member.name, member.email, member.avatar_path)" v-if="isProjectPremium == true">Chat</button>
                                        <button type="button" class="hover:bg-red-600 bg-red-400 text-white text-sm p-1 rounded-lg" @click="changeVisibilityModalRemoveMember(member.id)" v-if="myProjectData.administrator">Remover</button>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                        <div v-for="message in conversationMessages" :key="message[1]" class="mb-5 overflow-y-auto" v-if="chat == 'on'">
                            <div class="px-5 bg-green-300 float-end text-left rounded-xl flex" v-if="message[0] == idUser">
                                {{ message[1] }}
                                <UPopover class="ml-2">
                                    <UButton trailing-icon="i-heroicons-chevron-down-20-solid" class="bg-green-300 hover:bg-green-300" />
                                    <template #panel>
                                        <div class="max-h-48 overflow-y-auto">
                                            <button class="p-1 bg-red-300 hover:bg-red-500 text-white" @click="deleteMessage(message[2], 'sender')" v-if="visibleLanguage == 'en'">Delete message</button>
                                            <button class="p-1 bg-red-300 hover:bg-red-500 text-white" @click="deleteMessage(message[2], 'sender')" v-if="visibleLanguage == 'pt-br'">Deletar mensagem</button>
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                            <div class="px-5 bg-blue-300 float-start text-left rounded-xl flex" v-else>
                                {{ message[1] }}
                                <UPopover class="ml-2">
                                    <UButton trailing-icon="i-heroicons-chevron-down-20-solid" class="bg-blue-300 hover:bg-blue-300"/>
                                    <template #panel>
                                        <div class="max-h-48 overflow-y-auto">
                                            <button class="p-1 bg-red-300 hover:bg-red-500 text-white" @click="deleteMessage(message[2], 'recipient')" v-if="visibleLanguage == 'en'">Delete message</button>
                                            <button class="p-1 bg-red-300 hover:bg-red-500 text-white" @click="deleteMessage(message[2], 'recipient')" v-if="visibleLanguage == 'pt-br'">Deletar mensagem</button>
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                        </div>
                    </div>
                    
                    <template #footer>
                        <div
                            class="w-full flex items-center absolute bottom-0 left-0 p-3 bg-white border-t border-slate-300"
                            v-if="chat == 'on'"
                        >
                            <input
                                type="text"
                                class="flex-grow h-10 p-3 border-2 border-slate-400 rounded-l"
                                placeholder="Type a message"
                                v-model="chatMessage"
                                @keypress.enter="sendMessageToMember"
                                @focus="updateMessageToRead(memberChatId)"
                            />
                            <button
                                type="button"
                                class="h-10 p-3 bg-blue-600 text-white flex items-center justify-center rounded-r"
                                @click="sendMessageToMember"
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
            <AddMemberForm @changeVisibilityModalAddMember="changeVisibilityModalAddMember" :visibleLanguage="visibleLanguage"/>
        </UCard>
    </UModal>
    <UModal v-model="isOpenModalRemoveMember">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">Are you sure you want to proceed with this action?</p>
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Você tem certeza que quer prosseguir com essa ação?</p>
            <template #footer>
                <div class="flex justify-around items-center" v-if="visibleLanguage == 'en'">
                    <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="removeMemberFromProject($event)">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalRemoveMember(0)">Cancel</button>
                </div>
                <div class="flex justify-around items-center" v-if="visibleLanguage == 'pt-br'">
                    <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="removeMemberFromProject($event)">Confirmar</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalRemoveMember(0)">Cancelar</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>