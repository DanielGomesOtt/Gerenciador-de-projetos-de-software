<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import axios from 'axios';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

let members = ref({});
let isOpen = ref(false);

const openSlideOver = () => {
    isOpen.value = !isOpen.value;
}

const getUsersByProject = async () => {
    try{
        let query = {
            'id_project': route.params.id_project,
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id
        };
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_group', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_project: query.id_project,
                id_user: query.id_user
            }
        });
        if(response.data){
            members.value = response.data;
        }
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    getUsersByProject();
});

</script>

<template>
    <NavBar />
    <div class="flex justify-between">
        <div>

        </div>
        <div class="flex items-center">
            <button @click="openSlideOver" class="mr-2"><Icon name="mdi:chevron-left-circle" size="2.5em" class="text-blue-400" /></button>
            <USlideover v-model="isOpen">
                <UCard
                    class="flex flex-col flex-1"
                    :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                >
                    
                <template #header>
                    <div class="bg-blue-400 flex justify-between">
                        <button class="text-white"><Icon name="mdi:plus" color="white" size="1.8em"/>New Member</button>
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
                <div v-for="member in members" :key="member.id" class="h-screen snap-y">
                    <UCard
                        class="flex flex-col flex-1"
                        :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, background:'bg-slate-200', shadow: 'shadow-lg', ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                    >
                        <div class="flex items-center">
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
                    </UCard>
                </div>
                </UCard>
            </USlideover>
        </div>
    </div>
</template>