<script lang="js" setup>
import NavBarAdmin from '~/components/layoutComponents/NavBarAdmin.vue';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let projectsData = ref([]);
let searchForm = {
    'name': '',
    'email': '',
};

const getProjects = async () => {
    try{
        const projects = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/get_projects', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`,
                name: searchForm.name,
                email: searchForm.email 
            }
        });

        projectsData.value = projects.data;
    }catch(error){
        console.log(error);
    }
}

onMounted(() => {
    getProjects();
})
</script>

<template>
    <NavBarAdmin />
    <div class="w-screen flex justify-center items-center">
        <div class="w-full md:w-[800px] h-72 overflow-auto border-2 rounded-lg mt-20">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 bg-blue-400 p-2">
                <div>
                    <input type="text" class="rounded-lg p-3 w-full" placeholder="project name" v-model="searchForm.name">
                </div>

                <div>
                    <input type="email" class="rounded-lg p-3 w-full" placeholder="user email" v-model="searchForm.email">
                </div>
                <div class="flex justify-center items-center">
                    <button class="bg-transparent text-white md:text-slate-300 hover:text-white">Search</button>
                </div>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in projectsData" :key="project.id" class="border-2">
                        <th class="border-2 p-2 whitespace-nowrap">{{ project.name }}</th>
                        <td v-if="project.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.status }}</td>
                        <td v-if="project.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.status }}</td>
                        <td v-if="project.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.status }}</td>
                        <td v-if="project.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.status }}</td>
                        <td v-if="project.priority == 'Low Priority'" class="text-green-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.priority }}</td>
                        <td v-if="project.priority == 'Medium Priority'" class="text-blue-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.priority }}</td>
                        <td v-if="project.priority == 'High Priority'" class="text-red-400 border-2 p-2 text-center capitalize whitespace-nowrap">{{ project.priority }}</td>
                        <td class="flex justify-center">
                            <button class="rounded-lg text-indigo-400 hover:text-indigo-600 bg-transparent p-2">Manage</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>  
</template>