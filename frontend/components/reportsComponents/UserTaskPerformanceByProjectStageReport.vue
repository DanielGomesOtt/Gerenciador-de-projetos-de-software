<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);

const props = defineProps({
    visibleLanguage: String,
});
const runtimeConfig = useRuntimeConfig();
const chartLabelsEn = ["initial planning", "project design", "development", "tests", "deployment", "maintenance"];
const chartLabelsPtbr = ["planejamento inicial", "design do projeto", "desenvolvimento", "testes", "implantação", "manutenção"];
const chartEn = ref(null);
const chartPtbr = ref(null);


let chartInstance = null;
let chartData = ref([]);
let tasksData = ref([]);
let users = ref([])
let selectedProject = ref('');
let idUser = ref(JSON.parse(localStorage.getItem('userStorage')).id);

let initial_planning_overdue_data = ref(0);
let initial_planning_completed_data = ref(0);

let project_design_overdue_data = ref(0);
let project_design_completed_data = ref(0);

let development_overdue_data = ref(0);
let development_completed_data = ref(0);

let tests_overdue_data = ref(0);
let tests_completed_data = ref(0);

let deployment_overdue_data = ref(0);
let deployment_completed_data = ref(0);

let maintenance_overdue_data = ref(0);
let maintenance_completed_data = ref(0);

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
    const labelTitle = language == 'pt-br' ? '% de performance: (% conclusão no estágio) - (% de atraso no estágio)' : '% of performance: (% completion in the stage) - (% delay in the stage)';

    chartInstance = new Chart(canvas, {
        type: 'line',
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
                'rgba(0, 128, 0, 0.2)',    
                'rgba(0, 0, 255, 0.2)',    
                'rgba(255, 0, 0, 0.2)',    
                'rgba(255, 165, 0, 0.2)',  
                'rgba(128, 0, 128, 0.2)',  
                'rgba(255, 255, 0, 0.2)'   
            ],
            borderColor: [
                'rgba(0, 128, 0, 1)',    
                'rgba(0, 0, 255, 1)',    
                'rgba(255, 0, 0, 1)',    
                'rgba(255, 165, 0, 1)',  
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

const getUsers = async() =>{
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'users_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id
            }
        });

        if(response && response.data){
            let inserts = [];
            let finalResponse = [];
            response.data.forEach((data) => {
                if(!inserts.includes(data.user.name)){
                    inserts.push(data.user.name);
                    finalResponse.push(data);
                }
            })
            users.value = finalResponse;
        }
    }catch(error){
        console.log(error);
    }
}

const getProjectStagePerformance = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_stage_user_performance', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: idUser.value,
            }
        });

        if(response && response.data && response.data.length > 0){
            const tasks = response.data;
            tasksData.value = response.data;
            let initial_planning = 0;
            let project_design = 0;
            let development = 0;
            let tests = 0;
            let deployment = 0;
            let maintenance = 0;

            let initial_planning_overdue = 0;
            let project_design_overdue = 0;
            let development_overdue = 0;
            let tests_overdue = 0;
            let deployment_overdue = 0;
            let maintenance_overdue = 0;

            let initial_planning_completed = 0;
            let project_design_completed = 0;
            let development_completed = 0;
            let tests_completed = 0;
            let deployment_completed = 0;
            let maintenance_completed = 0;

            if(tasks !== null && tasks !== undefined && Array.isArray(tasks)){
                tasks.forEach((task) => {
                    if(task.project_stage == 'initial planning and requirements gathering' && task.status !== 'cancelled'){
                        initial_planning = initial_planning + 1;
                        if(task.status == 'overdue'){
                            initial_planning_overdue = initial_planning_overdue + 1;
                        }else if(task.status == 'completed'){
                            initial_planning_completed = initial_planning_completed + 1;
                        }
                    }else if(task.project_stage == 'project design' && task.status !== 'cancelled'){
                        project_design = project_design + 1;
                        if(task.status == 'overdue'){
                            project_design_overdue = project_design_overdue + 1;
                        }else if(task.status == 'completed'){
                            project_design_completed = project_design_completed + 1;
                        }
                    }else if(task.project_stage == 'development' && task.status !== 'cancelled'){
                        development = development + 1;
                        if(task.status == 'overdue'){
                            development_overdue = development_overdue + 1;
                        }else if(task.status == 'completed'){
                            development_completed = development_completed + 1;
                        }
                    }else if(task.project_stage == 'tests' && task.status !== 'cancelled'){
                        tests = tests + 1;
                        if(task.status == 'overdue'){
                            tests_overdue = tests_overdue + 1;
                        }else if(task.status == 'completed'){
                            tests_completed = tests_completed + 1;
                        }
                    }else if(task.project_stage == 'deployment' && task.status !== 'cancelled'){
                        deployment = deployment + 1;
                        if(task.status == 'overdue'){
                            deployment_overdue = deployment_overdue + 1;
                        }else if(task.status == 'completed'){
                            deployment_completed = deployment_completed + 1;
                        }
                    }else if(task.project_stage == 'maintenance' && task.status !== 'cancelled'){
                        maintenance = maintenance + 1;
                        if(task.status == 'overdue'){
                            maintenance_overdue = maintenance_overdue + 1;
                        }else if(task.status == 'completed'){
                            maintenance_completed = maintenance_completed + 1;
                        }
                    }
                });

                initial_planning_completed_data.value = ((initial_planning_completed / initial_planning) * 100).toFixed(2);
                initial_planning_overdue_data.value = ((initial_planning_overdue / initial_planning) * 100).toFixed(2);
                initial_planning = (initial_planning_completed_data.value - initial_planning_overdue_data.value).toFixed(2);

                project_design_completed_data.value = ((project_design_completed / project_design) * 100).toFixed(2);
                project_design_overdue_data.value = ((project_design_overdue / project_design) * 100).toFixed(2);
                project_design = (project_design_completed_data.value - project_design_overdue_data.value).toFixed(2);

                development_completed_data.value = ((development_completed / development) * 100).toFixed(2);
                development_overdue_data.value = ((development_overdue / development) * 100).toFixed(2);
                development = (development_completed_data.value - development_overdue_data.value).toFixed(2);

                tests_completed_data.value = ((tests_completed / tests) * 100).toFixed(2);
                tests_overdue_data.value = ((tests_overdue / tests) * 100).toFixed(2);
                tests = (tests_completed_data.value - tests_overdue_data.value).toFixed(2);

                deployment_completed_data.value = ((deployment_completed / deployment) * 100).toFixed(2);
                deployment_overdue_data.value = ((deployment_overdue / deployment) * 100).toFixed(2);
                deployment = (deployment_completed_data.value - deployment_overdue_data.value).toFixed(2);

                maintenance_completed_data.value = ((maintenance_completed / maintenance) * 100).toFixed(2);
                maintenance_overdue_data.value = ((maintenance_overdue / maintenance) * 100).toFixed(2);
                maintenance = (maintenance_completed_data.value - maintenance_overdue_data.value).toFixed(2);

                
                chartData.value = [initial_planning, project_design, development, tests, deployment, maintenance];
            }
            createChart(props.visibleLanguage);
        }else{
            chartData.value = [0, 0, 0, 0, 0, 0];
            initial_planning_overdue_data.value = 0;
            initial_planning_completed_data.value = 0;

            project_design_overdue_data.value = 0;
            project_design_completed_data.value = 0;

            development_overdue_data.value = 0;
            development_completed_data.value = 0;

            tests_overdue_data.value = 0;
            tests_completed_data.value = 0;

            deployment_overdue_data.value = 0;
            deployment_completed_data.value = 0;

            maintenance_overdue_data.value = 0;
            maintenance_completed_data.value = 0;
            createChart(props.visibleLanguage);
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Performance in tasks by project stage</h2>
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Performance em tasks pelo estágio do projeto</h2>
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

onMounted(() => {
    getProjectStagePerformance();
    getUsers();
});


watch(() => props.visibleLanguage, (newLanguage) => {
    createChart(newLanguage);
});
</script>

<template>
    <div class="flex justify-center w-full">
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'en'">Performance in tasks by project stage</h2>
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'pt-br'">Performance em tasks pelo estágio do projeto</h2>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'en'" @click="printReport">Print</button>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'pt-br'" @click="printReport">Imprimir</button>
    </div>
    <div class="w-screen flex flex-wrap justify-around">
        <div>
            <div id="container-chart-en" hidden class="w-full md:w-[800px]">
                <canvas ref="chartEn" class="w-full h-auto"></canvas>
            </div>
            <div id="container-chart-pt" hidden class="w-full md:w-[800px]">
                <canvas ref="chartPtbr" class="w-full h-auto"></canvas>
            </div>
        </div>
        <div class="w-full md:w-[700px] h-80 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'en'">

            <div class="w-full flex justify-center mt-1" v-if="visibleLanguage == 'en'">
                <select name="user_filter" id="user_filter" v-model="idUser" @change="getProjectStagePerformance" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option v-for="user in users"  :value="user.user.id" :key="user.user.id">{{ user.user.name }}</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Project stage</th>
                        <th>Performance (%)</th>
                        <th>Overdue (%)</th>
                        <th>Completed (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-2">
                        <th class="border-2 p-2">Initial Planning and Requirements Gathering</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[0]) ? '0.0' : chartData[0] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(initial_planning_overdue_data) ? '0.0' : initial_planning_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(initial_planning_completed_data) ? '0.0' : initial_planning_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Project Design</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[1]) ? '0.0' : chartData[1] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(project_design_overdue_data) ? '0.0' : project_design_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(project_design_completed_data) ? '0.0' : project_design_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Development</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[2]) ? '0.0' : chartData[2] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(development_overdue_data) ? '0.0' : development_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(development_completed_data) ? '0.0' : development_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Tests</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[3]) ? '0.0' : chartData[3] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(tests_overdue_data) ? '0.0' : tests_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(tests_completed_data) ? '0.0' : tests_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Deployment</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[4]) ? '0.0' : chartData[4] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(deployment_overdue_data) ? '0.0' : deployment_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(deployment_completed_data) ? '0.0' : deployment_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Maintenance</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[5]) ? '0.0' : chartData[5] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(maintenance_overdue_data) ? '0.0' : maintenance_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(maintenance_completed_data) ? '0.0' : maintenance_completed_data }}%</th>
                    </tr>

                </tbody>
            </table>
        </div>
        <div class="w-full md:w-[700px] h-80 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'pt-br'">
            <div class="w-full flex justify-center mt-1" v-if="visibleLanguage == 'pt-br'">
                <select name="user_filter" id="user_filter" v-model="idUser" @change="getProjectStagePerformance" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option v-for="user in users"  :value="user.user.id" :key="user.user.id">{{ user.user.name }}</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Estágio do projeto</th>
                        <th>Performance (%)</th>
                        <th>Atraso (%)</th>
                        <th>Conclusão (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-2">
                        <th class="border-2 p-2">Planejamento e levantamento inicial</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[0]) ? '0.0' : chartData[0] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(initial_planning_overdue_data) ? '0.0' : initial_planning_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(initial_planning_completed_data) ? '0.0' : initial_planning_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Design do projeto</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[1]) ? '0.0' : chartData[1] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(project_design_overdue_data) ? '0.0' : project_design_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(project_design_completed_data) ? '0.0' : project_design_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Desenvolvimento</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[2]) ? '0.0' : chartData[2] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(development_overdue_data) ? '0.0' : development_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(development_completed_data) ? '0.0' : development_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Testes</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[3]) ? '0.0' : chartData[3] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(tests_overdue_data) ? '0.0' : tests_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(tests_completed_data) ? '0.0' : tests_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Implantação</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[4]) ? '0.0' : chartData[4] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(deployment_overdue_data) ? '0.0' : deployment_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(deployment_completed_data) ? '0.0' : deployment_completed_data }}%</th>
                    </tr>
                    <tr class="border-2">
                        <th class="border-2 p-2">Manutenção</th>
                        <th class="border-2 text-center p-2">{{ isNaN(chartData[5]) ? '0.0' : chartData[5] }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(maintenance_overdue_data) ? '0.0' : maintenance_overdue_data }}%</th>
                        <th class="border-2 text-center p-2">{{ isNaN(maintenance_completed_data) ? '0.0' : maintenance_completed_data }}%</th>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>

</template>