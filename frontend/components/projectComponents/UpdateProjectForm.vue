<script setup lang="js">
import axios from 'axios';
import { watch, reactive } from 'vue';

const props = defineProps({
    responseProject: {
        type: Object,
        default: () => ({})
    }
});

const localData = reactive({...props.responseProject});

watch(
  () => props.responseProject,
  (newVal) => {
    Object.assign(localData, newVal);
  },
  { deep: true }
);

const runtimeConfig = useRuntimeConfig();
const emit = defineEmits(['changeVisibilityUpdateProjectModal', 'getProjects', 'checkProjectsLimit']);



const updateProject = async () => {
    try{
        let data = {
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
            'name': localData.name,
            'description': localData.description,
            'expected_end_date': localData.expected_end_date,
            'priority': localData.priority,
            'status': localData.status,
            'project_id': localData.id,
        };
        const response = await axios.patch(runtimeConfig.public.BASE_URL + 'project', data, {
            headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
            },
        });

        emit('changeVisibilityUpdateProjectModal');
        emit('checkProjectsLimit');
        emit('getProjects');
    }catch(error){
        console.log(error);
    }
}
</script>

<template>
    <div class="h-8">
        <p class="text-black font-bold text-center text-2xl">Project update</p>
    </div>

    <div class="w-full mt-10">
        <form class="w-[100%]">
            <input type="text" id="project-id" name="project-id" hidden v-model="localData.id">
            <div>
                <label for="update-name-project" class="font-semibold">Name</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="update-name-project" name="update-name-project" placeholder="Project Name" required v-model="localData.name">
            </div>

            <div class="mt-2">
                <label for="update-description-project" class="font-semibold">Description</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="update-description-project" name="update-description-project" placeholder="Project Description" required v-model="localData.description">
            </div>

            <div class="mt-2 grid grid-cols-1 md:grid-cols-2">
                <div class="md:mr-2">
                    <label for="update-end-date-project" class="font-semibold">End Date</label>
                    <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="update-end-date-project" name="update-end-date-project" required v-model="localData.expected_end_date">
                </div>
                <div class="md:ml-2">
                    <label for="update-priority-project" class="font-semibold">Priority</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="update-priority-project" name="update-priority-project" required v-model="localData.priority">
                        <option value="Low Priority">Low Priority</option>
                        <option value="Medium Priority">Medium Priority</option>
                        <option value="High Priority">High Priority</option>
                    </select>
                </div>
            </div>

            <div class="mt-2">
                <label for="update-project-status" class="font-semibold">Status</label>
                <select name="update-project-status" id="update-project-status" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" required v-model="localData.status">
                    <option value="in progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>
        </form>
    </div>        
    <div class="h-10 mt-10">
        <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="updateProject">Update Project</button>
    </div>
</template>