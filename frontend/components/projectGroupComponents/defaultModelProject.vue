<script lang="js" setup>
import axios from 'axios';
import CreateTaskForm from './CreateTaskForm.vue';
import UpdateTaskForm from './UpdateTaskForm.vue';


const props = defineProps({
    myProjectData: Object
});

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

let visibilityCreateTaskModal = ref(false);
let visibilityUpdateTaskModal = ref(false);
let tasks = ref([]);
let taskData = ref({});
let updateData = ref(false);

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

const checkTasksLimit = async () => {
    try{
        let data = {
            'id_project': route.params.id_project
        };
        await axios.patch(runtimeConfig.public.BASE_URL + 'task/check_limit', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    checkTasksLimit();
    getTasks();
})
</script>

<template>
    <div class="w-screen mt-24">
        <div class="flex w-full justify-around items-center">
            <h1 class="font-bold text-5xl">Tasks</h1>
            <UButton
                icon="i-heroicons-plus-solid"
                size="sm"
                color="blue"
                variant="solid"
                label="New task"
                :trailing="false"
                :onClick="() => {visibilityCreateTaskModal = true}"
            />
        </div>
        <div class="mt-5 overflow-auto">
            <table class="w-[1000px] border-2 border-gray-400 border-collapse text-sm mx-auto">
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
                        <td class="py-1 px-2 font-semibold border-2 border-gray-400 capitalize">{{ task.title }}</td>
                        <td class="py-1 px-2 font-semibold border-2 border-gray-400 capitalize">{{ task.type_task }}</td>
                        <td class="py-1 px-2 w-16 bg-blue-500 border-2 border-gray-400" v-if="task.status !== 'completed' && task.status !== 'cancelled'">
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
                        <td class="py-1 px-2 w-16 bg-green-500 border-2 border-gray-400" v-if="task.status == 'completed' || task.status == 'cancelled'">
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
            <CreateTaskForm @changeVisibilityCreateTaskModal="changeVisibilityCreateTaskModal" @getTasks="getTasks" @checkTasksLimit="checkTasksLimit"/>
        </UCard>
    </UModal>

    <UModal v-model="visibilityUpdateTaskModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <UpdateTaskForm  @changeVisibilityUpdateTaskModal="changeVisibilityUpdateTaskModal" @getTasks="getTasks" @checkTasksLimit="checkTasksLimit" :taskData="taskData" :updateData="updateData"/>
        </UCard>
    </UModal>
</template>