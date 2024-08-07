<script lang="js" setup>
import axios from 'axios';

const emit = defineEmits(['changeVisibilityCreateTaskAiModal', 'getTasks']);
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

let today = new Date();
today = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

let dataTask = {
    'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
    'id_project': route.params.id_project,
    'topic': '',
    'initial_date': '',
    'end_date': '',
    'quantity_task': 1
};

let errorMessage = ref('');

const setTaskByGemini = async () => {
    try{
        if(dataTask.topic.length == 0){
            errorMessage.value = 'Provide a topic to base the tasks on.';
        }else if(dataTask.initial_date.length == 0){
            errorMessage.value = 'Provide the start date for the task period.';
        }else if(dataTask.end_date.length == 0){
            errorMessage.value = 'Provide the end date for the task period.'
        }else if(dataTask.quantity_task <= 0){
            errorMessage.value = 'The number of tasks must be greater than 0.';
        }else{
            errorMessage.value = '';
            const response = await axios.post(runtimeConfig.public.BASE_URL +  'task/gemini', dataTask, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
                }
            })

            if(response && response.status == 201){
                emit('getTasks');
                emit('changeVisibilityCreateTaskAiModal');
            }
        }
    }catch(error){
        console.log(error);
    }
}
</script>

<template>
    <div class="h-8">
        <p class="text-black font-bold text-center text-2xl">Create a task by AI</p>
    </div>

    <div class="w-full mt-10">
        <div class="text-center text-red-600">{{ errorMessage }}</div>
        <form class="w-[100%]">
            <div class="grid grid-cols-1 md:grid-col-2">
                <div class="md:mr-2">
                    <label for="topic-task-ai" class="font-semibold">Topic</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="topic-task-ai" name="topic-task-ai" placeholder="Topic..." required v-model="dataTask.topic">
                </div>
                <div class="md:mr-2">
                    <label for="quantity-task-ai" class="font-semibold">Task quantity</label>
                    <input type="number" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="quantity-task-ai" name="quantity-task-ai" required v-model="dataTask.quantity_task" min="1">
                </div>
            </div>

            <div class="mt-2 grid grid-cols-1 md:grid-cols-2">
                <div class="md:mr-2">
                    <label for="initial-date-task-ai" class="font-semibold">Initial Date</label>
                    <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="initial-date-task-ai" name="initial-date-task-ai" required v-model="dataTask.initial_date">
                </div>
                <div class="md:mr-2">
                    <label for="end-date-task-ai" class="font-semibold">End Date</label>
                    <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="end-date-task-ai" name="end-date-task-ai" required v-model="dataTask.end_date">
                </div>
            </div>
        </form>
    </div>        
    <div class="h-10 mt-10">
        <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="setTaskByGemini">Create task with AI</button>
    </div>
</template>