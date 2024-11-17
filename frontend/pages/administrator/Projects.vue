<script lang="js" setup>
import NavBarAdmin from '~/components/layoutComponents/NavBarAdmin.vue';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let projectsData = ref([]);
let searchForm = {
    'name': '',
    'email': '',
};
let visibilityManageProjectModal = ref(false);
let formManage = {
    'email': '',
    'permission': '1',
    'id_project': ''
}

let errorMessage = ref('')

const openManageModal = (project_id) => {
    if(visibilityManageProjectModal.value == true){
        visibilityManageProjectModal.value = false;
        formManage = {
            'email': '',
            'permission': '1',
            'id_project': '',
        }
        errorMessage.value = ''
    }else{
        visibilityManageProjectModal.value = true;
        formManage.id_project = project_id;
        formManage.email = '';
        errorMessage.value = '';
    }
}

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

const setManageProject = async () => {
    try{
        errorMessage.value = '';
        if(formManage.email.length > 0){
            const response = await axios.post(runtimeConfig.public.BASE_URL + 'administrator/set_manage_project', formManage, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`,
                }
            })

            if(response.status == 201){
                openManageModal(0);
            }else{
                errorMessage.value = response.data.message;
            }
        }else{
            errorMessage.value = 'Please fill in the email field';
        }
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
                    <input type="text" class="rounded-lg p-3 w-full" placeholder="project name" v-model="searchForm.name" @keyup.enter="getProjects()">
                </div>

                <div>
                    <input type="email" class="rounded-lg p-3 w-full" placeholder="user email" v-model="searchForm.email" @keyup.enter="getProjects()">
                </div>
                <div class="flex justify-center items-center">
                    <button class="bg-transparent text-white md:text-slate-300 hover:text-white" @click="getProjects()">Search</button>
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
                            <button class="rounded-lg text-indigo-400 hover:text-indigo-600 bg-transparent p-2" @click="openManageModal(project.id)">Manage</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <UModal v-model="visibilityManageProjectModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex justify-end w-full">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="openManageModal(0)" />
            </div>
            <div class="h-8">
                <p class="text-black font-bold text-center text-2xl">Manage a project</p>
            </div>

            <div class="w-full mt-10">
                <div class="text-center text-red-600">{{ errorMessage }}</div>
                <form class="w-[100%]">
                    <div>
                        <label for="email-manage-project" class="font-semibold">Email</label>
                        <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="email-manage-project" name="email-manage-project" placeholder="user@email.com" required v-model="formManage.email">
                    </div>

                    
                    <div class="mt-2">
                        <label for="permission-manage-project" class="font-semibold">Change Permission</label>
                        <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="permission-manage-project" name="permission-manage-project" required v-model="formManage.permission">
                            <option value="1">Administrator</option>
                            <option value="0">Group Member</option>
                        </select>
                    </div>
                </form>
            </div>        
            <div class="h-10 mt-10">
                <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="setManageProject">Confirm</button>
            </div>
        </UCard>
    </UModal> 
</template>