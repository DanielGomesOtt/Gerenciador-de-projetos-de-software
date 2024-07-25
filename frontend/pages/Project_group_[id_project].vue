<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import axios from 'axios';
import AddMemberForm from '~/components/projectGroupComponents/AddMemberForm.vue';
import DefaultModelProject from '~/components/projectGroupComponents/DefaultModelProject.vue';


const route = useRoute();
const runtimeConfig = useRuntimeConfig();

let members = ref({});
let isOpen = ref(false);
let myProjectData = ref({});
let visibilityModalAddMember = ref(false);
let isOpenModalRemoveMember = ref(false);
let idRemoveUser = ref(0);

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
    getUsersByProject();
    getMyProjectData();
});

</script>

<template>
    <NavBar />
    <div class="flex justify-between">
        <div v-if="myProjectData.Project.project_model == 'default'">
            <DefaultModelProject />
        </div>
        <div class="flex items-center">
            <button @click="openSlideOver" class="mr-2 absolute right-0"><Icon name="mdi:chevron-left-circle" size="2.5em" class="text-blue-400" /></button>
            <USlideover v-model="isOpen">
                <UCard
                    class="flex flex-col flex-1"
                    :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                >
                    
                <template #header>
                    <div class="bg-blue-400 flex justify-between">
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
                    <div v-for="member in members" :key="member.id" class="mb-5">
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
                                    <button type="button" class="hover:bg-red-600 bg-red-400 text-white text-sm p-1 rounded-lg" @click="changeVisibilityModalRemoveMember(member.id)" v-if="myProjectData.administrator">Remove</button>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </div>
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