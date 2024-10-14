<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);

const props = defineProps({
    visibleLanguage: String,
});
const runtimeConfig = useRuntimeConfig();
const chartLabelsEn = ['to do', 'in progress', 'urgent', 'overdue', 'completed', 'cancelled'];
const chartLabelsPtbr = ['a fazer', 'em andamento', 'urgente', 'atrasado', 'finalizado', 'cancelado'];
const chartEn = ref(null);
const chartPtbr = ref(null);


let chartInstance = null;
let chartData = ref([]);
let tasksData = ref([]);
let allProjects = ref([]);
let selectedProject = ref('');
let selectedStage = ref('');

function createChart(language) {
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    if(props.visibleLanguage == 'en'){
        document.getElementById('container-chart-pt').setAttribute('hidden', '');
        document.getElementById('container-chart-en').removeAttribute('hidden');
    }else{
        document.getElementById('container-chart-en').setAttribute('hidden', '');
        document.getElementById('container-chart-pt').removeAttribute('hidden');
    }

    const canvas = language == 'pt-br' ? chartPtbr.value : chartEn.value;
    const labels = language == 'pt-br' ? chartLabelsPtbr : chartLabelsEn;
    const labelTitle = language == 'pt-br' ? 'Nº de tasks com esse status' : 'Nº of tasks with this status';

    chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartData.value,
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: [
                'rgba(0, 0, 255, 0.2)',    
                'rgba(255, 165, 0, 0.2)', 
                'rgba(0, 128, 0, 0.2)',   
                'rgba(255, 0, 0, 0.2)',    
                'rgba(128, 0, 128, 0.2)',  
                'rgba(255, 255, 0, 0.2)'  
            ],

            borderColor: [
                'rgba(0, 0, 255, 1)',   
                'rgba(255, 165, 0, 1)', 
                'rgba(0, 128, 0, 1)',    
                'rgba(255, 0, 0, 1)',
                'rgba(128, 0, 128, 1)',  
                'rgba(255, 255, 0, 1)'    
            ],
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const getTaskProgress = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'task_progress', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id,
                id_project: selectedProject.value,
                project_stage: selectedStage.value, 
            }
        });

        if(response){
            const tasks = response.data;
            tasksData.value = response.data;
            let to_do = 0;
            let in_progress = 0;
            let overdue = 0;
            let completed = 0;
            let cancelled = 0;
            let urgent = 0;

            if(tasks !== null && tasks !== undefined && Array.isArray(tasks)){
                tasks.forEach((task) => {
                    if(task.status == 'in progress'){
                        in_progress = in_progress + 1;
                    }else if(task.status == 'overdue'){
                        overdue = overdue + 1;
                    }else if(task.status == 'completed'){
                        completed = completed + 1;
                    }else if(task.status == 'cancelled'){
                        cancelled = cancelled + 1;
                    }else if(task.status == 'urgent'){
                        urgent = urgent + 1;
                    }else if(task.status == 'to do'){
                        to_do = to_do + 1;
                    }
                });
                chartData.value = [to_do, in_progress, urgent, overdue, completed, cancelled];
            }
            createChart(props.visibleLanguage);
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

const printReport = () => {
    
    const table = document.getElementById('table-report').outerHTML;
    let html = ``;
   
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Tasks Progress Report</h2>
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Relatório de progresso das tasks</h2>
                <div class="overflow-auto">
                    ${table}
                </div>
            </body>
        </html>
    `;
    }
   
    const tela_impressao = window.open('', '_blank');

   
    tela_impressao.document.write(html);

   
    tela_impressao.document.close();

   
    setTimeout(() => {
        tela_impressao.print();
        tela_impressao.close();
    }, 1000); 
}

onMounted(() => {
    getTaskProgress();
    getAllMyProjects();
});


watch(() => props.visibleLanguage, (newLanguage) => {
    createChart(newLanguage);
});
</script>

<template>
    <div class="flex justify-center w-full">
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'en'">Tasks Progress Report</h2>
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'pt-br'">Relatório de progresso das tasks</h2>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'en'" @click="printReport">Print</button>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'pt-br'" @click="printReport">Imprimir</button>
    </div>
    <div class="w-screen flex flex-wrap justify-around">
        <div>
            <div id="container-chart-en" hidden class="w-full md:w-[600px]">
                <canvas ref="chartEn" class="w-full h-auto"></canvas>
            </div>
            <div id="container-chart-pt" hidden class="w-full md:w-[600px]">
                <canvas ref="chartPtbr" class="w-full h-auto"></canvas>
            </div>
        </div>
        <div class="w-full md:w-[700px] h-72 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'en'">
            <div class="w-full flex justify-center mt-1" v-if="visibleLanguage == 'en'">
                <select name="project_filter" id="project_filter" v-model="selectedProject" @change="getTaskProgress" class="border-2 rounded-lg p-2">
                    <option value="">Filter By Project</option>
                    <option :value="project.id" v-for="project in allProjects" :key="project.id">{{ project.Project.name.toUpperCase() }}</option>
                </select>
                <select name="stage_filter" id="stage_filter" v-model="selectedStage" @change="getTaskProgress" class="border-2 rounded-lg p-2">
                    <option value="">Filter By Project Stage</option>
                    <option value="initial planning and requirements gathering">initial planning and requirements gathering</option>
                    <option value="project design">Project design</option>
                    <option value="development">Development</option>
                    <option value="tests">Tests</option>
                    <option value="deployment">Deployment</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Project Stage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasksData" :key="task.id" class="border-2">
                        <th class="border-2 p-2">{{ task.title }}</th>
                        <td v-if="task.status == 'to do'" class="text-yellow-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'urgent'" class="text-purple-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td class="border-2 p-2 text-center capitalize">{{ task.project_stage }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full md:w-[700px] h-72 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'pt-br'">
            <div class="w-full flex justify-around mt-1" v-if="visibleLanguage == 'pt-br'">
                <select name="project_filter" id="project_filter" v-model="selectedProject" @change="getTaskProgress" class="border-2 rounded-lg p-2">
                    <option value="">Filtrar por projeto</option>
                    <option :value="project.id" v-for="project in allProjects" :key="project.id">{{ project.Project.name.toUpperCase() }}</option>
                </select>
                <select name="stage_filter" id="stage_filter" v-model="selectedStage" @change="getTaskProgress" class="border-2 rounded-lg p-2">
                    <option value="">Filtrar por estágio do projeto</option>
                    <option value="initial planning and requirements gathering">Planejamento e levantamento inicial</option>
                    <option value="project design">Design de projeto</option>
                    <option value="development">Desenvolvimento</option>
                    <option value="tests">Testes</option>
                    <option value="deployment">Implantação</option>
                    <option value="maintenance">Manutenção</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Estágio do projeto</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasksData" :key="task.id" class="border-2">
                        <th class="border-2 p-2">{{ task.title }}</th>
                        <td v-if="task.status == 'to do'" class="text-yellow-400 border-2 p-2 text-center capitalize">A fazer</td>
                        <td v-if="task.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize">Em andamento</td>
                        <td v-if="task.status == 'urgent'" class="text-purple-400 border-2 p-2 text-center capitalize">Urgente</td>
                        <td v-if="task.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize">Atrasada</td>
                        <td v-if="task.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize">Finalizada</td>
                        <td v-if="task.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize">Cancelada</td>
                        <td class="border-2 p-2 text-center capitalize" v-if="task.project_stage == 'initial planning and requirements gathering'">Planejamento e levantamento inicial</td>
                        <td class="border-2 p-2 text-center capitalize" v-if="task.project_stage == 'project design'">Design do projeto</td>
                        <td class="border-2 p-2 text-center capitalize" v-if="task.project_stage == 'development'">Desenvolvimento</td>
                        <td class="border-2 p-2 text-center capitalize" v-if="task.project_stage == 'tests'">Testes</td>
                        <td class="border-2 p-2 text-center capitalize" v-if="task.project_stage == 'deployment'">Implantação</td>
                        <td class="border-2 p-2 text-center capitalize" v-if="task.project_stage == 'maintenance'">Manutenção</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>
