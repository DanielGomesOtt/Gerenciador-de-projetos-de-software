<script lang="js" setup>
import axios from 'axios';
import CreateTaskForm from './CreateTaskForm.vue';
import UpdateTaskForm from './UpdateTaskForm.vue';
import CreateTaskByAiForm from './CreateTaskByAiForm.vue';


const props = defineProps({
    myProjectData: Object
});

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

let visibilityCreateTaskModal = ref(false);
let visibilityUpdateTaskModal = ref(false);
let visibilityAiTaskModal = ref(false);
let tasks = ref([]);
let taskData = ref({});
let updateData = ref(false);
let searchPlaceholder = ref('Search by ...');
let filter = ref('');
let type_task = ref('');
let status_task = ref('');
let searchTask = ref('');
let myProjectData = ref([]);
let idUser = JSON.parse(localStorage.getItem('userStorage')).id;

const changeVisibilityCreateTaskModal = () => {
    visibilityCreateTaskModal.value = !visibilityCreateTaskModal.value;
}

const changeVisibilityUpdateTaskModal = (data) => {
    if(visibilityUpdateTaskModal.value == false){
        data.expected_end_date = data.expected_end_date.split('T');
        data.expected_end_date = data.expected_end_date[0];
        taskData.value = data;
        if(taskData.value.status == 'completed' || taskData.value.status == 'cancelled'){
            updateData.value = true;
        }else{
            updateData.value = false;
        }
    }else{
        taskData.value = {};
    }
    visibilityUpdateTaskModal.value = !visibilityUpdateTaskModal.value;
}

const changeVisibilityCreateTaskAiModal = () => {
    visibilityAiTaskModal.value = !visibilityAiTaskModal.value;
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
        }
    }catch(error){
        console.log(error);
    }
}

const changeSearchPlaceholder = () => {
    if(filter.value.length > 0){
        searchPlaceholder.value = `Search by ${filter.value}`;
    }else{
        searchPlaceholder.value = `Search by ...`;
    }
}

const getTasks = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'task', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: props.myProjectData.id_user,
                id_project: props.myProjectData.id_project,
                administrator: props.myProjectData.administrator
            }
        });
        if(response && response.data){
            tasks.value = response.data;
        }
    }catch(error){
        console.log(error);
    }
}

const searchTasks = async () => {
    try{
        let params = {
            'filter': filter.value,
            'status': status_task.value,
            'type_task': type_task.value,
            'search': searchTask.value,
        };

        let url = runtimeConfig.public.BASE_URL + 'task/search';

        const response = await axios.get(url, {
            params,
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id,
                administrator: props.myProjectData.administrator,
                id_project: route.params.id_project
            }
        });

        tasks.value = response.data;
    }catch(error){
        console.log(error);
    }
}

const checkTasksLimit = async () => {
    try{
        let data = {
            'id_project': route.params.id_project
        };
        await axios.patch(runtimeConfig.public.BASE_URL + 'task/check_limit', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
            }
        });

        let params = {
            'filter': filter.value,
            'status': status_task.value,
            'type_task': type_task.value,
            'search': searchTask.value,
        };

        if(params.filter.length == 0 && params.status.length == 0 && params.type_task.length == 0 && params.search.length == 0 || params.filter.length > 0 && params.status.length == 0 && params.type_task.length == 0 && params.search.length == 0 ){
            getTasks();
        }else{
            searchTasks()
        }

    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    checkTasksLimit();
    getMyProjectData();
    getTasks();
})
</script>

<template>
    <div class="w-screen mt-16">
        <div class="flex w-full justify-around items-center mb-5">
            <h1 class="font-bold text-5xl">Tasks</h1>
            <UPopover>
                <UButton
                    icon="i-heroicons-plus-solid"
                    size="sm"
                    color="blue"
                    variant="solid"
                    label="New task"
                    :trailing="false"
                />

                <template #panel>
                    <div class="flex justify-center items-center border-b-2 p-3 hover:text-blue-600">
                        <button type="button" @click="() => {visibilityCreateTaskModal = true}">Manual creation</button>
                    </div>
                    <div class="flex justify-center items-center p-3 hover:text-blue-600">
                        <button type="button" @click="() => {visibilityAiTaskModal = true}">Creation by AI</button>
                    </div>
                </template>
            </UPopover>
        </div>
        <div class="flex justify-center">
            <div class="bg-blue-400 flex flex-wrap justify-between p-5 w-[1000px] rounded-t-lg">
                <div class="mt-2">
                    <input type="text" class="w-56 md:w-52 lg:w-72 h-7 rounded-sm pl-2" :placeholder="searchPlaceholder" v-model="searchTask" @keyup.enter="searchTasks">
                </div>
                <div class="mt-2">
                    <select class="w-56 md:w-48 lg:w-52 h-7 rounded-sm" v-model="filter" @change="changeSearchPlaceholder">
                        <option value="">Search filters</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                <div class="mt-2">
                    <select class="w-56 md:w-32 h-7 rounded-sm" v-model="type_task" @change="searchTasks">
                        <option value="">Type of task</option>
                        <option value="development of new features">Development of new features</option>
                        <option value="bug fixing">Bug fixing</option>
                        <option value="unit testing">Unit testing</option>
                        <option value="integration testing">Integration testing</option>
                        <option value="acceptance testing">Acceptance testing</option>
                        <option value="documentation">Documentation</option>
                        <option value="code review">Code review</option>
                        <option value="performance optimization">Performance optimization</option>
                        <option value="code refactoring">Code refactoring</option>
                        <option value="security implementation">Security implementation</option>
                        <option value="continuous integration">Continuous integration</option>
                        <option value="continuous delivery">Continuous delivery</option>
                        <option value="data migration">Data migration</option>
                        <option value="environment setup">Environment setup</option>
                        <option value="infrastructure maintenance">Infrastructure maintenance</option>
                        <option value="user interface (ui) design">User interface (UI) design</option>
                        <option value="user experience (ux) design">User experience (UX) design</option>
                        <option value="team training">Team training</option>
                        <option value="requirements analysis">Requirements analysis</option>
                        <option value="technical support">Technical support</option>
                        <option value="project management">Project management</option>
                        <option value="impact analysis">Impact analysis</option>
                        <option value="api development">API development</option>
                        <option value="task automation">Task automation</option>
                        <option value="backend feature implementation">Backend feature implementation</option>
                        <option value="frontend feature development">Frontend feature development</option>
                        <option value="prototype creation">Prototype creation</option>
                        <option value="usability testing">Usability testing</option>
                        <option value="version control management">Version control management</option>
                        <option value="ci/cd setup">CI/CD setup</option>
                        <option value="performance monitoring">Performance monitoring</option>
                        <option value="configuration management">Configuration management</option>
                        <option value="integration with external services">Integration with external services</option>
                        <option value="script development">Script development</option>
                        <option value="database design">Database design</option>
                        <option value="technical consulting">Technical consulting</option>
                        <option value="log analysis">Log analysis</option>
                        <option value="vulnerability management">Vulnerability management</option>
                        <option value="architecture review">Architecture review</option>
                        <option value="tool customization">Tool customization</option>
                        <option value="automated testing implementation">Automated testing implementation</option>
                        <option value="mobile solutions development">Mobile solutions development</option>
                        <option value="dependency management">Dependency management</option>
                        <option value="application performance analysis">Application performance analysis</option>
                        <option value="accessibility features implementation">Accessibility features implementation</option>
                        <option value="dashboard and report development">Dashboard and report development</option>
                        <option value="production support">Production support</option>
                        <option value="capacity planning">Capacity planning</option>
                        <option value="change management">Change management</option>
                        <option value="security policy review and update">Security policy review and update</option>
                    </select>
                </div>
                <div class="mt-2">
                    <select class="w-56 md:w-32 h-7 rounded-sm" v-model="status_task" @change="searchTasks">
                        <option value="">Status</option>
                        <option value="in progress">In progress</option>
                        <option value="urgent">Urgent</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="overflow-auto">
            <table class="w-[1000px] border-t-0 border-2 border-gray-400 border-collapse text-sm mx-auto">
                <thead>
                    <tr>
                        <th class="py-1 px-2 text-left border-2 border-gray-400">Status</th>
                        <th class="py-1 px-2 text-left border-2 border-gray-400">Title</th>
                        <th class="py-1 px-2 text-left border-2 border-gray-400">Type</th>
                        <th class="py-1 px-2 border-2 border-gray-400"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasks" :key="task.id" class="border-2 border-gray-400">
                        <td class="py-1 px-2 border-2 border-gray-400 text-center font-semibold capitalize bg-blue-500 text-white" v-if="task.status == 'in progress'">{{ task.status }}</td>
                        <td class="py-1 px-2 border-2 border-gray-400 text-center font-semibold capitalize bg-red-500 text-white" v-if="task.status == 'cancelled'">{{ task.status }}</td>
                        <td class="py-1 px-2 border-2 border-gray-400 text-center font-semibold capitalize bg-green-500 text-white" v-if="task.status == 'completed'">{{ task.status }}</td>
                        <td class="py-1 px-2 border-2 border-gray-400 text-center font-semibold capitalize bg-purple-500 text-white" v-if="task.status == 'urgent'">{{ task.status }}</td>
                        <td class="py-1 px-2 border-2 border-gray-400 text-center font-semibold capitalize bg-orange-500 text-white" v-if="task.status == 'overdue'">{{ task.status }}</td>
                        <td class="py-1 px-2 font-semibold border-2 border-gray-400">{{ task.title }}</td>
                        <td class="py-1 px-2 font-semibold border-2 border-gray-400">{{ task.type_task.toUpperCase() }}</td>
                        <td class="py-1 px-2 w-16 bg-blue-500 border-2 border-gray-400" v-if="task.status !== 'completed' && task.status !== 'cancelled' && myProjectData.administrator == true || task.status !== 'completed' && task.status !== 'cancelled' && task.id_user == idUser">
                            <UButton
                                icon="i-heroicons-pencil-square-16-solid"
                                size="xs"
                                color="blue"
                                variant="solid"
                                label="Edit"
                                :trailing="false"
                                class="hover:bg-blue-500"
                                :onClick="() => {changeVisibilityUpdateTaskModal(task)}"
                            />
                        </td>
                        <td class="py-1 px-2 w-16 bg-green-500 border-2 border-gray-400" v-if="task.status == 'completed' || task.status == 'cancelled' || myProjectData.administrator == false && task.id_user == idUser && task.status == 'cancelled' || myProjectData.administrator == false && task.id_user == idUser && task.status == 'completed'">
                            <UButton
                                icon="i-heroicons-eye-solid"
                                size="xs"
                                color="green"
                                variant="solid"
                                label="Visualize"
                                :trailing="false"
                                class="hover:bg-green-500"
                                :onClick="() => {changeVisibilityUpdateTaskModal(task)}"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <UModal v-model="visibilityCreateTaskModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex justify-end w-full">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="visibilityCreateTaskModal = false" />
            </div>
            <CreateTaskForm @changeVisibilityCreateTaskModal="changeVisibilityCreateTaskModal" @getTasks="getTasks" @checkTasksLimit="checkTasksLimit"/>
        </UCard>
    </UModal>

    <UModal v-model="visibilityUpdateTaskModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex justify-end w-full">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="visibilityUpdateTaskModal = false" />
            </div>
            <UpdateTaskForm  @changeVisibilityUpdateTaskModal="changeVisibilityUpdateTaskModal" @getTasks="getTasks" @checkTasksLimit="checkTasksLimit" :taskData="taskData" :updateData="updateData"/>
        </UCard>
    </UModal>

    <UModal v-model="visibilityAiTaskModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex justify-end w-full">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="visibilityAiTaskModal = false" />
            </div>
            <CreateTaskByAiForm @getTasks="getTasks" @changeVisibilityCreateTaskAiModal="changeVisibilityCreateTaskAiModal"/>
        </UCard>
    </UModal>
</template>