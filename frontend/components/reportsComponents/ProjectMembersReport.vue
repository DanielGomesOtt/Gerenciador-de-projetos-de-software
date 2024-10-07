<script setup lang="js">
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


const props = defineProps({
    visibleLanguage: String,
});
const runtimeConfig = useRuntimeConfig();


let idUser = ref('');
let users = ref([]);
let usersTable = ref([]);
let allProjects = ref([]);
let selectedProject = ref('');
let projects = ref([]);

const getUsers = async() =>{
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'users_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id
            }
        });

        if(response && response.data){
            users.value = response.data;
        }
    }catch(error){
        console.log(error);
    }
}

const printReport = () => {
    // Obter o conteúdo da tabela
    const table = document.getElementById('table-report').outerHTML;
    let html = ``;
    // Criar o HTML que será impresso
    if(props.visibleLanguage == 'en'){
        html = `
        <html>
            <head>
                <title>Relatório</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 2px solid #e2e8f0; /* border-2 */
                        padding: 0.5rem; /* p-2 */
                        text-align: left;
                    }
                    th {
                        background-color: #4299e1; /* bg-blue-400 */
                        color: white; /* text-white */
                    }
                    .text-blue {
                        color: #4299e1; /* text-blue-400 */
                    }
                    .text-orange {
                        color: #dd6b20; /* text-orange-400 */
                    }
                    .text-green {
                        color: #48bb78; /* text-green-400 */
                    }
                    .text-red {
                        color: #f56565; /* text-red-400 */
                    }
                    .capitalize {
                        text-transform: capitalize;
                    }
                </style>
            </head>
            <body>
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Users Report</h2>
                <div class="overflow-auto">
                    ${table}
                </div>
            </body>
        </html>
    `;
    }else{
        html = `
        <html>
            <head>
                <title>Relatório</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 2px solid #e2e8f0; /* border-2 */
                        padding: 0.5rem; /* p-2 */
                        text-align: left;
                    }
                    th {
                        background-color: #4299e1; /* bg-blue-400 */
                        color: white; /* text-white */
                    }
                    .text-blue {
                        color: #4299e1; /* text-blue-400 */
                    }
                    .text-orange {
                        color: #dd6b20; /* text-orange-400 */
                    }
                    .text-green {
                        color: #48bb78; /* text-green-400 */
                    }
                    .text-red {
                        color: #f56565; /* text-red-400 */
                    }
                    .capitalize {
                        text-transform: capitalize;
                    }
                </style>
            </head>
            <body>
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Relatório de usuários</h2>
                <div class="overflow-auto">
                    ${table}
                </div>
            </body>
        </html>
    `;
    }
    // Abrir uma nova janela
    const tela_impressao = window.open('', '_blank');

    // Escrever o conteúdo HTML na nova janela
    tela_impressao.document.write(html);

    // Fechar o documento para garantir que o conteúdo seja renderizado
    tela_impressao.document.close();

    // Usar setTimeout para dar tempo de a nova janela carregar
    setTimeout(() => {
        tela_impressao.print();
        tela_impressao.close();
    }, 1000); // Espera 1 segundo antes de imprimir
}

const getUsersTable = async() =>{
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'users_table_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: idUser.value,
                id_current_user: JSON.parse(localStorage.getItem('userStorage')).id
            }
        });

        if(response && response.data){
            usersTable.value = response.data;
        }
    }catch(error){
        console.log(error);
    }
}

const getAllMyProjects = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'get_all_my_projects', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id 
            }
        });

        if(response.data){
            allProjects.value = response.data;
        }
    }catch(error){
        console.log(error);
    }
}

onMounted(() => {
    getUsers();
    getAllMyProjects();
    getUsersTable();
});

</script>

<template>
    <div class="flex justify-center w-full">
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'en'">Users Report</h2>
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'pt-br'">Relatório de usuários</h2>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'en'" @click="printReport">Print</button>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'pt-br'" @click="printReport">Imprimir</button>
    </div>
    <div class="w-screen flex justify-center">
        <div class="w-full md:w-[1000px] h-96 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'en'">
            <div class="w-full flex flex-wrap justify-around mt-1" v-if="visibleLanguage == 'en'">
                <select name="user_filter" id="user_filter" v-model="idUser" @change="getUsersTable()" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option value="">Filter By User</option>
                    <option v-for="user in users"  :value="user.id" :key="user.id">{{ user.name }}</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Name</th>
                        <th>E-mail</th>
                        <th>Premium</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in usersTable" :key="user.id" class="border-2">
                        <th class="border-2 p-2">{{ user.name }}</th>
                        <th class="border-2 p-2">{{ user.email }}</th>
                        <th class="border-2 p-2">{{ (user.premium_user == 1 ? 'Premium user' : 'Normal user') }}</th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full md:w-[1000px] h-96 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'pt-br'">
            <div class="w-full flex flex-wrap justify-around mt-1" v-if="visibleLanguage == 'pt-br'">
                <select name="user_filter" id="user_filter" v-model="idUser" @change="getUsersTable()" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option value="">Filtrar pelo usuário</option>
                    <option v-for="user in users"  :value="user.id" :key="user.id">{{ user.name }}</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Premium</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in usersTable" :key="user.id" class="border-2">
                        <th class="border-2 p-2">{{ user.name }}</th>
                        <th class="border-2 p-2">{{ user.email }}</th>
                        <th class="border-2 p-2">{{ (user.premium_user == 1 ? 'Usuário premium' : 'Usuário normal') }}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
