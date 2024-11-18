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
let searchPlaceholder = (localStorage.getItem('language') == 'en' ? ref('Search by ...') : ref('Pesquisa pelo ...'));
let visibilityModalExitProject = ref(false);
let exit_id_project = ref(0);
let isPremiumUser = JSON.parse(localStorage.getItem('userStorage')).premium_user;
let allProjects = ref([]);
let visibleLanguage = ref(localStorage.getItem('language'));
let visibilityHelpModal = ref(false);

const changeVisibilityHelpModal = () => {
    visibilityHelpModal.value = !visibilityHelpModal.value;
}

const changeVisibilityModalExitProject = (exit, id_project) => {
    exit_id_project.value = id_project;
    visibilityModalExitProject.value = exit;
}

const changeSearchPlaceholder = () => {
    if(localStorage.getItem('language') == 'en'){
        if(filter.value.length == 0){
            searchPlaceholder.value = `Search by ...`;
        }else{
            searchPlaceholder.value = `Search by ${filter.value}`;
        }
    }else{
        if(filter.value.length == 0){
            searchPlaceholder.value = `Pesquisa pelo ...`;
        }else{
            searchPlaceholder.value = `Pesquisa pelo nome`;
        }
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
        searchPlaceholder.value = (localStorage.getItem('language') == 'en' ? 'Search by ...' : 'Pesquisa pelo ...');
        getProjects();
        getAllProjects();
    }catch(error){
        console.log(error);
    }
}

const checkProjectsLimit = async () => {
    try{
        const response = await axios.patch(
            runtimeConfig.public.BASE_URL + 'project/check_limit', 
            {},
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
                }
            }
        );
        
        if(filter.value.length == 0 && status.value.length == 0 && priority.value.length == 0 && searchProject.value.length == 0 || filter.value.length > 0 && searchProject.value.length == 0){
            getProjects();
            getAllProjects();
        }else{
            getProjectsByFilter();
            getAllProjects();
        }
    }catch(error){
        console.log(error);
    }
}

const getAllProjects = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'get_all_projects', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
            }
        });

        allProjects.value = response.data;

    }catch(error){
        console.log(error);
    }
}

const changeLanguage = () => {
    visibleLanguage.value = localStorage.getItem('language');
    if(searchPlaceholder.value == 'Search by ...' && visibleLanguage.value == 'pt-br'){
        searchPlaceholder.value = 'Pesquisa pelo ...';
    }else if(searchPlaceholder.value == 'Search by name' && visibleLanguage.value == 'pt-br'){
        searchPlaceholder.value = 'Pesquisa pelo nome';
    }else if(searchPlaceholder.value == 'Pesquisa pelo ...' && visibleLanguage.value == 'en'){
        searchPlaceholder.value = 'Search by ...';
    }else if(searchPlaceholder.value == 'Pesquisa pelo nome' && visibleLanguage.value == 'en'){
        searchPlaceholder.value = 'Search by name';
    }
}

onBeforeMount(() => {
    checkProjectsLimit()
    getProjects();
    getAllProjects();
})
</script>

<template>
    <NavBar @changeLanguageParent="changeLanguage" @changeVisibilityHelpModal="changeVisibilityHelpModal"/>
    <div class="mt-20 w-10/12 shadow mx-auto rounded-lg">
        <div class="w-full bg-blue-400 flex flex-wrap justify-between p-5 rounded-t-lg" v-if="visibleLanguage == 'en'">
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
                    <option value="overdue">Overdue</option>
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
            <div class="flex items-center mt-2" v-if="isPremiumUser == true || allProjects.length < 3">
                <button class="text-white" @click="changeVisibilityCreateProjectModal()"><Icon name="mdi:plus" color="white" size="1.8em"/>New Project</button>
            </div>
        </div>

        <div class="w-full bg-blue-400 flex flex-wrap justify-between p-5 rounded-t-lg" v-if="visibleLanguage == 'pt-br'">
            <div class="mt-2">
                <input type="text" class="w-56 md:w-52 lg:w-72 h-10 rounded-sm pl-2" :placeholder="searchPlaceholder" v-model="searchProject" @keyup.enter="getProjectsByFilter">
            </div>
            <div class="mt-2">
                <select class="w-56 md:w-48 lg:w-52 h-10 rounded-sm" v-model="filter" @change="changeSearchPlaceholder">
                    <option value="">Filtros de pesquisa</option>
                    <option value="name">Nome</option>
                </select>
            </div>
            <div class="mt-2">
                <select class="w-56 md:w-32 h-10 rounded-sm" v-model="status" @change="getProjectsByFilter">
                    <option value="">Status</option>
                    <option value="in progress">Em andamento</option>
                    <option value="completed">Finalizado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="overdue">Atrasado</option>
                </select>
            </div>
            <div class="mt-2">
                <select class="w-56 md:w-32 h-10 rounded-sm" v-model="priority" @change="getProjectsByFilter">
                    <option value="">Prioridades</option>
                    <option value="High Priority">Alta</option>
                    <option value="Medium Priority">Média</option>
                    <option value="Low Priority">Baixa</option>
                </select>
            </div>
            <div class="flex items-center mt-2" v-if="isPremiumUser == true || allProjects.length < 3">
                <button class="text-white" @click="changeVisibilityCreateProjectModal()"><Icon name="mdi:plus" color="white" size="1.8em"/>Novo Projeto</button>
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
                <div class="pt-5" v-if="visibleLanguage == 'en'">
                    <button type="button" class="text-white bg-green-500 rounded-md mb-3 w-[100%]" @click="joinInTheProject(project.id)"><Icon name="mdi:location-enter" size="1.2em" color="white"/>&nbsp;Join</button>
                    <button type="button" class="text-white bg-blue-500 rounded-md mb-3 w-[100%]" @click="changeVisibilityUpdateProjectModal(project.id)" v-if="project.UserProjects[0].administrator"><Icon name="mdi:square-edit-outline" size="1.2em" color="white"/>&nbsp;Edit</button>
                    <button type="button" class="text-white bg-red-500 rounded-md w-[100%]" @click="changeVisibilityModalExitProject(true, project.id)"><Icon name="mdi:arrow-expand-right" size="1.2em" color="white"/>&nbsp;Exit</button>
                </div>
                <div class="pt-5" v-if="visibleLanguage == 'pt-br'">
                    <button type="button" class="text-white bg-green-500 rounded-md mb-3 w-[100%]" @click="joinInTheProject(project.id)"><Icon name="mdi:location-enter" size="1.2em" color="white"/>&nbsp;Entrar</button>
                    <button type="button" class="text-white bg-blue-500 rounded-md mb-3 w-[100%]" @click="changeVisibilityUpdateProjectModal(project.id)" v-if="project.UserProjects[0].administrator"><Icon name="mdi:square-edit-outline" size="1.2em" color="white"/>&nbsp;Editar</button>
                    <button type="button" class="text-white bg-red-500 rounded-md w-[100%]" @click="changeVisibilityModalExitProject(true, project.id)"><Icon name="mdi:arrow-expand-right" size="1.2em" color="white"/>&nbsp;Sair</button>
                </div>
            </UCard>
        </div>
        <UModal v-model="visibilityCreateProjectModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <div class="flex justify-end w-full">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="visibilityCreateProjectModal = false" />
                </div>
                <CreateProjectForm  @changeVisibilityCreateProjectModal="changeVisibilityCreateProjectModal" @getProjects="getProjects" @checkProjectsLimit="checkProjectsLimit" :visibleLanguage="visibleLanguage"/>
            </UCard>
        </UModal>

        <UModal v-model="visibilityUpdateProjectModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <div class="flex justify-end w-full">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="visibilityUpdateProjectModal = false" />
                </div>
                <UpdateProjectForm :responseProject="responseProject" @changeVisibilityUpdateProjectModal="changeVisibilityUpdateProjectModal" @getProjects="getProjects" @checkProjectsLimit="checkProjectsLimit" :visibleLanguage="visibleLanguage"/>
            </UCard>
        </UModal>

        <UModal v-model="visibilityModalExitProject">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">Are you sure you want to proceed with this action?</p>
                <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Você tem certeza que deseja continuar com essa ação ?</p>
                <template #footer>
                    <div class="flex justify-around items-center" v-if="visibleLanguage == 'en'">
                        <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="exitProject">Confirm</button>
                        <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalExitProject(false, 0)">Cancel</button>
                    </div>
                    <div class="flex justify-around items-center" v-if="visibleLanguage == 'pt-br'">
                        <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="exitProject">Confirmar</button>
                        <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalExitProject(false, 0)">Cancelar</button>
                    </div>
                </template>
            </UCard>
        </UModal>

        <UModal v-model="visibilityHelpModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">Page Guide</p>
                <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Manual da Página</p>
                <template #footer>
                    <div v-if="visibleLanguage == 'en'">
                        <p class="text-justify">To use the project filter bar, simply adjust the available filtering options, and the search will occur automatically. If you are using the search bar, select a filter and press Enter to perform the search.</p>
                        <img src="../assets/img/tela de projeto.png" alt="Project screen" class="mx-auto my-5 border-2">
                        <p class="text-justify">To create a project, click on the new project button, fill out the project creation form, and click Create Project.</p>
                        <p class="text-justify">To enter a project's screen, go to the project you want to access and click the enter button.</p>
                        <p class="text-justify">To leave a project, go to the project you want to exit and click on leave, then confirm.</p>
                        <img src="../assets/img/criacao de projeto.png" alt="Project creation" class="mx-auto my-5 border-2">
                        <p class="text-justify">To edit a project, go to the chosen project and click on edit. After that, a form will appear. Fill out the form and click Update Project.</p>
                        <img src="../assets/img/atualizacao de projeto.png" alt="Project update" class="w-64 mx-auto my-5 border-2">
                    </div>
                    <div v-if="visibleLanguage == 'pt-br'">
                        <p class="text-justify">Para utilizar a barra de filtrar projetos, é só modificar as opções de filtragem disponíveis que a pesquisa já irá ocorrer. Se for usar a barra de pesquisa, seleciona um filtro e clique em Enter para realizar a pesquisa.</p>
                        <img src="../assets/img/tela de projeto.png" alt="Tela de projetos" class="mx-auto my-5 border-2">
                        <p class="text-justify">Para criar um projeto, clique no botão novo projeto e preencha o formulário de criação de projeto e clique em Criar Projeto.</p>
                        <p class="text-justify">Para entrar na tela do projeto, vá no projeto que deseja entrar e clique no botão entrar.</p>
                        <p class="text-justify">Para sair do projeto, vá no projeto que deseja sair e clique eem sair e depois confirme.</p>
                        <img src="../assets/img/criacao de projeto.png" alt="Criação de projeto" class="mx-auto my-5 border-2">
                        <p class="text-justify">Para editar um projeto, vá no projeto escolhido e clique em editar. Após isso irá aparecer um formulário, preeencha o formulário e clique em Atualizar Projeto.</p>
                        <img src="../assets/img/atualizacao de projeto.png" alt="Atualização de projeto" class="w-64 mx-auto my-5 border-2">
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>