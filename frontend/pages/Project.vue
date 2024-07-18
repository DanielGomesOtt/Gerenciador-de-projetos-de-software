<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import CreateProjectForm from '../components/projectComponents/CreateProjectForm';
import UpdateProjectForm from '../components/projectComponents/UpdateProjectForm';
import axios from  'axios';


const runtimeConfig = useRuntimeConfig();
let visibilityCreateProjectModal = ref(false);
let visibilityUpdateProjectModal = ref(false);
let projects = ref([]);
let responseProject = ref({})
let searchProject = ref('');
let filter = ref('');
let status = ref('');
let priority = ref('');
let searchPlaceholder = ref('Search by ...');
let visibilityModalExitProject = ref(false);
let exit_id_project = ref(0);

const changeVisibilityModalExitProject = (exit, id_project) => {
    exit_id_project.value = id_project;
    visibilityModalExitProject.value = exit;
}

const changeSearchPlaceholder = () => {
    if(filter.value.length == 0){
        searchPlaceholder.value = `Search by ...`;
    }else{
        searchPlaceholder.value = `Search by ${filter.value}`;
    }
}

const joinInTheProject = (id_project) => {
    navigateTo(`/project_group_${id_project}`);
}

const changeVisibilityCreateProjectModal = () => {
    visibilityCreateProjectModal.value = !visibilityCreateProjectModal.value;
}

const changeVisibilityUpdateProjectModal = (idProject = false) => {
    visibilityUpdateProjectModal.value = !visibilityUpdateProjectModal.value;
    if(visibilityUpdateProjectModal.value){
        getProjectById(idProject)
    }
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

const getProjectsByFilter = async () => {
    try{
        let params = {
            'filter': filter.value,
            'status': status.value,
            'priority': priority.value,
            'search': searchProject.value,
        };

        let url = runtimeConfig.public.BASE_URL + 'my_projects';

        const response = await axios.get(url, {
            params,
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id,
            }
        });

        projects.value = response.data;
    }catch(error){
        console.log(error);
    }
}

const getProjectById = async (idProject) => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project/' + idProject, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
            },
        });
        response.data.expected_end_date = response.data.expected_end_date.split('T');
        response.data.expected_end_date = response.data.expected_end_date[0];
        responseProject.value = response.data;
    }catch(error){
        console.log(error);
    }
}

const exitProject = async () => {
    try{
        let data = {
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
            'id_project': exit_id_project.value
        }

        const response = await axios.patch(runtimeConfig.public.BASE_URL + 'project/exit_project', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });

        changeVisibilityModalExitProject(false, 0);
        searchProject.value = '';
        filter.value = '';
        status.value = '';
        priority.value = '';
        searchPlaceholder.value = 'Search by ...';
        getProjects()
        
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    const id_category = JSON.parse(localStorage.getItem('userStorage')).id_category;
    if(id_category == 1){
        navigateTo('/home');
    }else{
        getProjects();
    }
})
</script>

<template>
    <NavBar />
    <div class="mt-20 w-10/12 shadow mx-auto rounded-lg">
        <div class="w-full bg-blue-400 flex flex-wrap justify-between p-5 rounded-t-lg">
            <div class="mt-2">
                <input type="text" class="w-56 md:w-52 lg:w-72 h-10 rounded-sm pl-2" :placeholder="searchPlaceholder" v-model="searchProject" @keyup.enter="getProjectsByFilter">
            </div>
            <div class="mt-2">
                <select class="w-56 md:w-48 lg:w-52 h-10 rounded-sm" v-model="filter" @change="changeSearchPlaceholder">
                    <option value="">Search filters</option>
                    <option value="name">Name</option>
                </select>
            </div>
            <div class="mt-2">
                <select class="w-56 md:w-32 h-10 rounded-sm" v-model="status" @change="getProjectsByFilter">
                    <option value="">Status</option>
                    <option value="in progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div class="mt-2">
                <select class="w-56 md:w-32 h-10 rounded-sm" v-model="priority" @change="getProjectsByFilter">
                    <option value="">Priority</option>
                    <option value="High Priority">High</option>
                    <option value="Medium Priority">Medium</option>
                    <option value="Low Priority">Low</option>
                </select>
            </div>
            <div class="flex items-center mt-2">
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
                <input type="text" hidden>
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
                <div class="pt-5">
                    <button type="button" class="text-white bg-green-500 rounded-md mb-3 w-[100%]" @click="joinInTheProject(project.id)"><Icon name="mdi:location-enter" size="1.2em" color="white"/>&nbsp;Join</button>
                    <button type="button" class="text-white bg-blue-500 rounded-md mb-3 w-[100%]" @click="changeVisibilityUpdateProjectModal(project.id)" v-if="project.UserProjects[0].administrator"><Icon name="mdi:square-edit-outline" size="1.2em" color="white"/>&nbsp;Edit</button>
                    <button type="button" class="text-white bg-red-500 rounded-md w-[100%]" @click="changeVisibilityModalExitProject(true, project.id)"><Icon name="mdi:arrow-expand-right" size="1.2em" color="white"/>&nbsp;Exit</button>
                </div>
            </UCard>
        </div>
        <UModal v-model="visibilityCreateProjectModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <CreateProjectForm  @changeVisibilityCreateProjectModal="changeVisibilityCreateProjectModal" @getProjects="getProjects"/>
            </UCard>
        </UModal>

        <UModal v-model="visibilityUpdateProjectModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <UpdateProjectForm :responseProject="responseProject" @changeVisibilityUpdateProjectModal="changeVisibilityUpdateProjectModal" @getProjects="getProjects"/>
            </UCard>
        </UModal>

        <UModal v-model="visibilityModalExitProject">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                <p class="text-center text-2xl font-semibold">Are you sure you want to proceed with this action?</p>

                <template #footer>
                    <div class="flex justify-around items-center">
                        <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="exitProject">Confirm</button>
                        <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalExitProject(false, 0)">Cancel</button>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>