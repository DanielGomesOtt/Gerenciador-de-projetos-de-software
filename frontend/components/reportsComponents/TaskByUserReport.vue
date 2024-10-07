<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);

const props = defineProps({
    visibleLanguage: String,
});
const runtimeConfig = useRuntimeConfig();


let tasksData = ref([]);
let idUser = ref(JSON.parse(localStorage.getItem('userStorage')).id);
let users = ref([]);
let selectedStage = ref('');
let selectedStatus = ref('');
let selectedType = ref('');

const getTasksByUser = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'tasks_by_user', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: idUser.value,
                project_stage: selectedStage.value,
                status: selectedStatus.value,
                type_task: selectedType.value,
            }
        });

        if(response){
            tasksData.value = response.data
        }
    }catch(error){
        console.log(error);
    }
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Tasks by user Report</h2>
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
                <h2 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Relatório de tasks por usuário</h2>
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
    getUsers();
    getTasksByUser();
});

</script>

<template>
    <div class="flex justify-center w-full">
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'en'">Tasks by user Report</h2>
        <h2 class="text-2xl md:text-4xl font-bold text-center mb-14" v-if="props.visibleLanguage == 'pt-br'">Relatório de tasks por usuário</h2>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'en'" @click="printReport">Print</button>
        <button class=" bg-blue-400 text-white rounded-lg ml-5 w-20 h-10" v-if="visibleLanguage == 'pt-br'" @click="printReport">Imprimir</button>
    </div>
    <div class="w-screen flex justify-center">
        <div class="w-full md:w-[1000px] h-96 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'en'">
            <div class="w-full flex flex-wrap justify-around mt-1" v-if="visibleLanguage == 'en'">
                <select name="user_filter" id="user_filter" v-model="idUser" @change="getTasksByUser" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option v-for="user in users"  :value="user.id" :key="user.id">{{ user.name }}</option>
                </select>
                <select name="stage_filter" id="stage_filter" v-model="selectedStage" @change="getTasksByUser" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option value="">Filter By Project Stage</option>
                    <option value="initial planning and requirements gathering">initial planning and requirements gathering</option>
                    <option value="project design">Project design</option>
                    <option value="development">Development</option>
                    <option value="tests">Tests</option>
                    <option value="deployment">Deployment</option>
                    <option value="maintenance">Maintenance</option>
                </select>
                <select name="status_filter" id="status_filter" v-model="selectedStatus" @change="getTasksByUser" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option value="">Filter By Status</option>
                    <option value="to do">To do</option>
                    <option value="in progress">In progress</option>
                    <option value="urgent">Urgent</option>
                    <option value="overdue">Overdue</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select class="border-2 rounded-lg p-2 w-full md:w-1/4" id="type_filter" name="type_filter" required v-model="selectedType" @change="getTasksByUser">
                    <option value="">Filter By Type</option>
                    <option value="development of new features">Development of new features</option>
                    <option value="bug fixing">Bug fixing</option>
                    <option value="unit testing">Unit testing</option>
                    <option value="integration testing">Integration testing</option>
                    <option value="acceptance testing">Acceptance testing</option>
                    <option value="documentation">Documentation</option>
                    <option value="code review">Code review</option>
                    <option value="performance optimization">Performance optimization</option>
                    <option value="code refactoring">Code refactoring</option>
                    <option value="security implementation">Security implementation</option>
                    <option value="continuous integration">Continuous integration</option>
                    <option value="continuous delivery">Continuous delivery</option>
                    <option value="data migration">Data migration</option>
                    <option value="environment setup">Environment setup</option>
                    <option value="infrastructure maintenance">Infrastructure maintenance</option>
                    <option value="user interface (ui) design">User interface (UI) design</option>
                    <option value="user experience (ux) design">User experience (UX) design</option>
                    <option value="team training">Team training</option>
                    <option value="requirements analysis">Requirements analysis</option>
                    <option value="technical support">Technical support</option>
                    <option value="project management">Project management</option>
                    <option value="impact analysis">Impact analysis</option>
                    <option value="api development">API development</option>
                    <option value="task automation">Task automation</option>
                    <option value="backend feature implementation">Backend feature development</option>
                    <option value="frontend feature development">Frontend feature development</option>
                    <option value="prototype creation">Prototype creation</option>
                    <option value="usability testing">Usability testing</option>
                    <option value="version control management">Version control management</option>
                    <option value="ci/cd setup">CI/CD setup</option>
                    <option value="performance monitoring">Performance monitoring</option>
                    <option value="configuration management">Configuration management</option>
                    <option value="integration with external services">Integration with external services</option>
                    <option value="script development">Script development</option>
                    <option value="database design">Database design</option>
                    <option value="technical consulting">Technical consulting</option>
                    <option value="log analysis">Log analysis</option>
                    <option value="vulnerability management">Vulnerability management</option>
                    <option value="architecture review">Architecture review</option>
                    <option value="tool customization">Tool customization</option>
                    <option value="automated testing implementation">Automated testing implementation</option>
                    <option value="mobile solutions development">Mobile solutions development</option>
                    <option value="dependency management">Dependency management</option>
                    <option value="application performance analysis">Application performance analysis</option>
                    <option value="accessibility features implementation">Accessibility features implementation</option>
                    <option value="dashboard and report development">Dashboard and report development</option>
                    <option value="production support">Production support</option>
                    <option value="capacity planning">Capacity planning</option>
                    <option value="change management">Change management</option>
                    <option value="security policy review and update">Security policy review and update</option>
                    <option value="created by gemini">Created by Gemini</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Title</th>
                        <th>Project stage</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasksData" :key="task.id" class="border-2">
                        <th class="border-2 p-2">{{ task.title }}</th>
                        <th class="border-2 p-2">{{ task.project_stage }}</th>
                        <th class="border-2 p-2">{{ task.type_task }}</th>
                        <td v-if="task.status == 'to do'" class="text-yellow-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'urgent'" class="text-purple-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                        <td v-if="task.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize">{{ task.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full md:w-[1000px] h-96 overflow-auto border-2 rounded-lg" v-if="props.visibleLanguage == 'pt-br'">
            <div class="w-full flex justify-center mt-1" v-if="visibleLanguage == 'pt-br'">
                <select name="stage_filter" id="stage_filter" v-model="idUser" @change="getTasksByUser" class="border-2 rounded-lg p-2">
                    <option v-for="user in users"  :value="user.id" :key="user.id">{{ user.name }}</option>
                </select>
                <select name="stage_filter" id="stage_filter" v-model="selectedStage" @change="getTasksByUser" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option value="">Filtrar by estágio do projeto</option>
                    <option value="initial planning and requirements gathering">Planejamento e levantamento inicial</option>
                    <option value="project design">Design do projeto</option>
                    <option value="development">Desenvolvimento</option>
                    <option value="tests">Testes</option>
                    <option value="deployment">Implantação</option>
                    <option value="maintenance">Manutenção</option>
                </select>
                <select name="status_filter" id="status_filter" v-model="selectedStatus" @change="getTasksByUser" class="border-2 rounded-lg p-2 w-full md:w-1/4">
                    <option value="">Filtrar po status</option>
                    <option value="to do">A fazer</option>
                    <option value="in progress">Em andamento</option>
                    <option value="urgent">Urgente</option>
                    <option value="overdue">Atrasada</option>
                    <option value="completed">Finalizada</option>
                    <option value="cancelled">Cancelada</option>
                </select>
                <select class="border-2 rounded-lg p-2 w-full md:w-1/4" id="type_filter" name="type_filter" required v-model="selectedType" @change="getTasksByUser">
                    <option value="">Filtrar pelo tipo</option>
                    <option value="development of new features">Desenvolvimento de uma nova funcionalidade</option>
                    <option value="bug fixing">Correção de bug</option>
                    <option value="unit testing">Teste unitário</option>
                    <option value="integration testing">Teste de integração</option>
                    <option value="acceptance testing">Teste de aceitação</option>
                    <option value="documentation">Documentação</option>
                    <option value="code review">Code review</option>
                    <option value="performance optimization">Otimização de performance</option>
                    <option value="code refactoring">Refatoração de código</option>
                    <option value="security implementation">Implementação de segurança</option>
                    <option value="continuous integration">Integração contínua</option>
                    <option value="continuous delivery">Entrega contínua</option>
                    <option value="data migration">Migração de dados</option>
                    <option value="environment setup">Preparação de ambiente</option>
                    <option value="infrastructure maintenance">Manutenção de infraestrutura</option>
                    <option value="user interface (ui) design">Design de interface de usuário (UI)</option>
                    <option value="user experience (ux) design">Design de experiência do usuário (UX)</option>
                    <option value="team training">Treinamento de time</option>
                    <option value="requirements analysis">Análise de requisitos</option>
                    <option value="technical support">Suporte técnico</option>
                    <option value="project management">Administração de projeto</option>
                    <option value="impact analysis">Análise de impacto</option>
                    <option value="api development">Desenvolvimento de API</option>
                    <option value="task automation">Automação de task</option>
                    <option value="backend feature development">Desenvolvimento de funcionalidade do backend</option>
                    <option value="frontend feature development">Desenvolvimento de funcionalidade do frontend</option>
                    <option value="prototype creation">Criação de protótipo</option>
                    <option value="usability testing">Teste de usabilidade</option>
                    <option value="version control management">Administração de controle de versão</option>
                    <option value="ci/cd setup">CI/CD setup</option>
                    <option value="performance monitoring">Monitoramento de performance</option>
                    <option value="configuration management">Gerenciamento de configuração</option>
                    <option value="integration with external services">Integração com serviços externos</option>
                    <option value="script development">Desenvolvimento de scrpit</option>
                    <option value="database design">Design de banco de dados</option>
                    <option value="technical consulting">Consulta técnica</option>
                    <option value="log analysis">Análise de logs</option>
                    <option value="vulnerability management">Gerencimento de vulnerabilidade</option>
                    <option value="architecture review">Architecture review</option>
                    <option value="tool customization">Customização de ferramenta</option>
                    <option value="automated testing implementation">Implementação de testes automatizados</option>
                    <option value="mobile solutions development">Desenvolvimento de soluções móveis</option>
                    <option value="dependency management">Gerenciamento de dependências</option>
                    <option value="application performance analysis">Análise de desempenho de aplicações</option>
                    <option value="accessibility features implementation">Implementação de recursos de acessibilidade</option>
                    <option value="dashboard and report development">Desenvolvimento de dashboards e relatórios</option>
                    <option value="production support">Suporte à produção</option>
                    <option value="capacity planning">Planejamento de capacidade</option>
                    <option value="change management">Gerenciamento de mudança</option>
                    <option value="security policy review and update">Revisão e atualização da política de segurança</option>
                    <option value="created by gemini">Criado pelo Gemini</option>
                </select>
            </div>
            <table class="border-collapse border-2 w-full" id="table-report">
                <thead class="bg-blue-400 text-white">
                    <tr>
                        <th>Título</th>
                        <th>Estágio do projeto</th>
                        <th>Tipo</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasksData" :key="task.id" class="border-2">
                        <th class="border-2 p-2">{{ task.title }}</th>
                        <th class="border-2 p-2" v-if="task.project_stage == 'initial planning and requirements gathering'">Planejamento e levantamento inicial</th>
                        <th class="border-2 p-2" v-if="task.project_stage == 'project design'">Design do projeto</th>
                        <th class="border-2 p-2" v-if="task.project_stage == 'development'">Desenvolvimento</th>
                        <th class="border-2 p-2" v-if="task.project_stage == 'tests'">Testes</th>
                        <th class="border-2 p-2" v-if="task.project_stage == 'deployment'">Implantação</th>
                        <th class="border-2 p-2" v-if="task.project_stage == 'maintenance'">Manutenção</th>
                        <th class="border-2 p-2">{{ task.type_task }}</th>
                        <td v-if="task.status == 'to do'" class="text-yellow-400 border-2 p-2 text-center capitalize">A fazer</td>
                        <td v-if="task.status == 'in progress'" class="text-blue-400 border-2 p-2 text-center capitalize">Em andamento</td>
                        <td v-if="task.status == 'urgent'" class="text-purple-400 border-2 p-2 text-center capitalize">Urgente</td>
                        <td v-if="task.status == 'overdue'" class="text-orange-400 border-2 p-2 text-center capitalize">Atrasada</td>
                        <td v-if="task.status == 'completed'" class="text-green-400 border-2 p-2 text-center capitalize">Finalizada</td>
                        <td v-if="task.status == 'cancelled'" class="text-red-400 border-2 p-2 text-center capitalize">Cancelada</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>
