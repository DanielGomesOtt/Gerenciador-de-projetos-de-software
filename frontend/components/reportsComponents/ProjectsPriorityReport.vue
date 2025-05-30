<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);

const props = defineProps({
    visibleLanguage: String,
});
const runtimeConfig = useRuntimeConfig();
const chartLabelsEn = ['Low Priority', 'Medium Priority', 'High Priority'];
const chartLabelsPtbr = ['Prioridade Baixa', 'Prioridade Média', 'Prioridade Alta'];
const chartEn = ref(null);
const chartPtbr = ref(null);


let chartInstance = null;
let chartData = ref([]);
let projectsData = ref([]);

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
    const labelTitle = language == 'pt-br' ? 'Nº de projetos com essa prioridade' : 'Nº of projects with this priority';

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
                'rgba(0, 128, 0, 0.2)', 
                'rgba(0, 0, 255, 0.2)',   
                'rgba(255, 0, 0, 0.2)'     
            ],
            borderColor: [
                'rgba(0, 128, 0, 1)', 
                'rgba(0, 0, 255, 1)',   
                'rgba(255, 0, 0, 1)'  
            ],
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Projects Priority Report</h2>
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Relatório de prioridade dos projetos</h2>
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

const getProjectPriority = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_progress', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id 
            }
        });

        if(response){
            const projects = response.data;
            projectsData.value = response.data;
            let low = 0;
            let medium = 0;
            let high = 0;

            if(projects !== null && projects !== undefined && Array.isArray(projects)){
                projects.forEach((project) => {
                    if(project.priority == 'Low Priority'){
                        low = low + 1;
                    }else if(project.priority == 'Medium Priority'){
                        medium = medium + 1;
                    }else if(project.priority == 'High Priority'){
                        high = high + 1;
                    }
                });
                chartData.value = [low, medium, high];
            }
            createChart(props.visibleLanguage);
        }
    }catch(error){
        console.log(error);
    }
}

onMounted(() => {
    getProjectPriority();
});


watch(() => props.visibleLanguage, (newLanguage) => {
    createChart(newLanguage);
});
</script>

<template>
    <div class="flex justify-center w-full">
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'en'">Projects Priority Report</h2>
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'pt-br'">Relatório de prioridade dos projetos</h2>
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
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in projectsData" :key="project.id" class="border-2">
                        <th class="border-2 p-2">{{ project.name }}</th>
                        <td v-if="project.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize">{{ project.status }}</td>
                        <td v-if="project.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize">{{ project.status }}</td>
                        <td v-if="project.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize">{{ project.status }}</td>
                        <td v-if="project.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize">{{ project.status }}</td>
                        <td v-if="project.priority == 'Low Priority'" class="text-green-400 border-2 p-2 text-center capitalize">{{ project.priority }}</td>
                        <td v-if="project.priority == 'Medium Priority'" class="text-blue-400 border-2 p-2 text-center capitalize">{{ project.priority }}</td>
                        <td v-if="project.priority == 'High Priority'" class="text-red-400 border-2 p-2 text-center capitalize">{{ project.priority }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full md:w-[700px] h-72 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'pt-br'">
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Prioridade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in projectsData" :key="project.id" class="border-2">
                        <th class="border-2 p-2">{{ project.name }}</th>
                        <td v-if="project.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize">Em andamento</td>
                        <td v-if="project.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize">Atrasado</td>
                        <td v-if="project.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize">Completo</td>
                        <td v-if="project.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize">Cancelado</td>
                        <td v-if="project.priority == 'Low Priority'" class="text-green-400 border-2 p-2 text-center capitalize">Prioridade baixa</td>
                        <td v-if="project.priority == 'Medium Priority'" class="text-blue-400 border-2 p-2 text-center capitalize">Prioridade Média</td>
                        <td v-if="project.priority == 'High Priority'" class="text-red-400 border-2 p-2 text-center capitalize">Prioridade Alta</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>