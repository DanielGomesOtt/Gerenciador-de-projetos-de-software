<script setup lang="js">
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let project = {
    'name': '',
    'description': '',
    'expected_end_date': '',
    'priority': '',
}

const createProject = async () => {
    try{
        let today = new Date();
        let data = {
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
            'name': project.name,
            'description': project.description,
            'expected_end_date': project.expected_end_date,
            'priority': project.priority,
            'status': 'in progress',
            'initial_date': `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
        };
        const response = await axios.post(runtimeConfig.public.BASE_URL + 'project', data, {
            headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
            },
        });
    }catch(error){
        console.log(error);
    }
}
</script>


<template>
    <div class="h-8">
        <p class="text-black font-bold text-center text-2xl">Create a project</p>
    </div>

    <div class="w-full mt-10">
        <form class="w-[100%]">
            <div>
                <label for="name-project" class="font-semibold">Name</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="name-project" name="name-project" placeholder="Project Name" required v-model="project.name">
            </div>

            <div class="mt-2">
                <label for="description-project" class="font-semibold">Description</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="description-project" name="description-project" placeholder="Project Description" required v-model="project.description">
            </div>

            <div class="mt-2 grid grid-cols-1 md:grid-cols-2">
                <div class="md:mr-2">
                    <label for="end-date-project" class="font-semibold">End Date</label>
                    <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="end-date-project" name="end-date-project" required v-model="project.expected_end_date">
                </div>
                <div class="md:ml-2">
                    <label for="priority-project" class="font-semibold">Priority</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="priority-project" name="priority-project" required v-model="project.priority">
                        <option class="low">Low Priority</option>
                        <option class="medium">Medium Priority</option>
                        <option class="high">High Priority</option>
                    </select>
                </div>
            </div>
        </form>
    </div>        
    <div class="h-10 mt-10">
        <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="createProject">Create Project</button>
    </div>
</template>