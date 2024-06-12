<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import CreateProjectForm from '../components/projectComponents/CreateProjectForm';
import axios from  'axios';

const runtimeConfig = useRuntimeConfig();

let visibilityCreateProjectModal = ref(false);
let projects = ref([]);

const changeVisibilityCreateProjectModal = () => {
    visibilityCreateProjectModal.value = !visibilityCreateProjectModal.value;
}

const getProjects = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id,
            },
        });

        projects.value = response.data;
    }catch(error){
        console.log(error);
    }
}

 onBeforeMount(() => {
    getProjects();
 })
</script>

<template>
    <NavBar />
    <div class="mt-20 w-10/12 shadow mx-auto rounded-lg">
        <div class="w-full bg-blue-400 flex flex-wrap justify-between p-5 rounded-t-lg">
            <div>
                <input type="text" class="w-70 h-10 rounded-sm pl-2" placeholder="Search">
            </div>
            <div class="flex items-center">
                <button class="text-white" @click="changeVisibilityCreateProjectModal()"><Icon name="mdi:plus" color="white" size="1.8em"/>New Project</button>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-5 shadow">
            <UCard 
                :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" 
                v-for="project in projects" 
                :key="project.id" 
                :class="{
                    'border-blue-500': project.priority === 'Medium Priority',
                    'border-red-500': project.priority === 'High Priority',
                    'border-green-500': project.priority === 'Low Priority'
                }"
                class="border-2 ml-5 mr-5 shadow mt-5 mb-5 hover:shadow-2xl"
            >
                <div class="text-center font-semibold border-b-2 pb-2" :class="{'border-b-blue-500': project.priority === 'Medium Priority', 'border-b-red-500': project.priority === 'High Priority', 'border-b-green-500': project.priority === 'Low Priority'}">
                    {{ project.name }}
                </div>
                <div class="text-center border-b-2 p-2" :class="{'border-b-blue-500': project.priority === 'Medium Priority', 'border-b-red-500': project.priority === 'High Priority', 'border-b-green-500': project.priority === 'Low Priority'}">
                    {{ project.description }}
                </div>
                <div class="text-center border-b-2 p-2" :class="{'border-b-blue-500': project.priority === 'Medium Priority', 'border-b-red-500': project.priority === 'High Priority', 'border-b-green-500': project.priority === 'Low Priority'}">
                    {{ project.status }}
                </div>
                <div class="text-center border-b-2 pt-2" :class="{'border-b-blue-500': project.priority === 'Medium Priority', 'border-b-red-500': project.priority === 'High Priority', 'border-b-green-500': project.priority === 'Low Priority'}">
                    {{ project.priority }}
                </div>
                <div class="flex justify-around items-center pt-5">
                    <button class="text-white bg-blue-500 rounded-sm w-24">Edit</button>
                    <button class="text-white bg-green-500 rounded-sm w-24">Enter</button>
                </div>
            </UCard>
        </div>
        <UModal v-model="visibilityCreateProjectModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <CreateProjectForm  @changeVisibilityCreateProjectModal="changeVisibilityCreateProjectModal" @getProjects="getProjects"/>
            </UCard>
        </UModal>
    </div>
</template>