<script lang="js" setup>
import axios from 'axios';
import { watch, reactive } from 'vue';

const props = defineProps({
    taskData: {
        type: Object,
        default: () => ({})
    },
    updateData: {
        type: Boolean,
        default: false
    },
    visibleLanguage : String,
});

const localData = reactive({...props.taskData});
const updateCheck = reactive({ value: props.updateData });

watch(
  () => [props.taskData, props.updateData],
  ([newTaskData, newUpdateData]) => {
    Object.assign(localData, newTaskData);
    updateCheck.value = newUpdateData;
  },
  { deep: true }
);

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const emit = defineEmits(['changeVisibilityUpdateTaskModal', 'getTasks', 'checkTasksLimit']);

let errorMessage = ref('');
let members = ref([]);
let id_user = JSON.parse(localStorage.getItem('userStorage')).id;
let name_user = ref(JSON.parse(localStorage.getItem('userStorage')).name);
let task = {
    'id_task': localData.id,
    'title': localData.title,
    'description': localData.description,
    'expected_end_date': localData.expected_end_date,
    'type_task': localData.type_task,
    'status': localData.status,
    'id_user': localData.id_user,
    'id_project': route.params.id_project
};

const getUsersByProject = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_group', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_project: route.params.id_project,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id
            }
        });
        if(response.data){
            members.value = response.data;
            const filteredMember = members.value.filter(member => member.id == task.id_user);
            if(filteredMember.length == 0){
                getUserTask();
            }
        }
    }catch(error){
        console.log(error);
    }
}

const getUserTask = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'user_task', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user_task: localData.id_user
            }
        });
        if(response && response.data){
            let select = document.getElementById('responsible-task-update');
            select.options[select.options.length] = new Option(response.data.name.toUpperCase(), response.data.id);
            select.value = response.data.id;
        }
    }catch(error){
        console.log(error);
    }
}

const updateTask = async () => {
    try{
        if(task.title.length == 0){
            errorMessage.value = (props.visibleLanguage == 'en' ? 'Provide a title.' : 'Informe um título.');
        }else if(task.description.length == 0){
            errorMessage.value = (props.visibleLanguage == 'en' ? 'Provide a description.' : 'Forneça uma descrição.');
        }else if(task.expected_end_date.length == 0){
            errorMessage.value = (props.visibleLanguage == 'en' ? 'Provide a expected end date.' : 'Forneça a data final esperada.');
        }else if(task.id_user.length == 0){
            errorMessage.value = (props.visibleLanguage == 'en' ? 'Assign a responsible to the task.' : 'Atribua um responsável para a task.');
        }else{
            errorMessage.value = '';
            const response = await axios.patch(runtimeConfig.public.BASE_URL + 'task', task, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
                }
            });

            if(response.status == 200){
                emit('changeVisibilityUpdateTaskModal');
                emit('checkTasksLimit');
                emit('getTasks');
            }
        }
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    getUsersByProject()
})


</script>

<template>
    <div v-if="props.visibleLanguage == 'en'">
        <div class="h-8">
            <p class="text-black font-bold text-center text-2xl">Update a Task</p>
        </div>

        <div class="w-full mt-10">
            <div class="text-center text-red-600">{{ errorMessage }}</div>
            <form class="w-[100%]">
                <div>
                    <label for="title-task-update" class="font-semibold">Title</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="title-task-update" name="title-task-update" placeholder="Task..." required v-model="task.title" :disabled="updateCheck.value">
                </div>

                <div class="mt-2">
                    <label for="description-task-update" class="font-semibold">Description</label>
                    <textarea name="description-task-update" id="description-task-update" class="w-full rounded p-2 bg-slate-200 shadow" placeholder="What needs to be done?" required v-model="task.description" :disabled="updateCheck.value"></textarea>
                    <!-- <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="description-task-update" name="description-task-update" placeholder="What needs to be done?" required v-model="task.description" :disabled="updateCheck.value"> -->
                </div>

                <div class="mt-2 grid grid-cols-1 md:grid-cols-2">
                    <div class="md:mr-2">
                        <label for="end-date-task-update" class="font-semibold">End Date</label>
                        <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="end-date-task-update" name="end-date-task-update" required v-model="task.expected_end_date" :disabled="updateCheck.value">
                    </div>
                    <div class="md:mr-2">
                        <label for="status-task-update" class="font-semibold">Status</label>
                        <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="status-task-update" name="status-task-update" required v-model="task.status" :disabled="updateCheck.value">
                            <option value="to do">To do</option>
                            <option value="in progress">In progress</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="overdue">Overdue</option>
                            <option value="urgent">Urgent</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div class="mt-2">
                    <label for="type-task-update" class="font-semibold">Type</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="type-task-update" name="type-task-update" required v-model="task.type_task" :disabled="updateCheck.value">
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
                        <option value="created by gemini" disabled>Created by Gemini</option>
                    </select>
                </div>
                <div class="mt-2">
                    <label for="responsible-task-update" class="font-semibold">Responsible</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="responsible-task-update" name="responsible-task-update" required v-model="task.id_user" :disabled="updateCheck.value">
                        <option value="">Select a responsible</option>
                        <option :value="member.id" v-for="member in members" :key="member.id">{{ member.name.toUpperCase() }}</option>
                    </select>
                </div>
            </form>
        </div>        
        <div class="h-10 mt-10">
            <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="updateTask" :disabled="updateCheck.value">Update Task</button>
        </div>
    </div>
    <div v-if="props.visibleLanguage == 'pt-br'">
        <div class="h-8">
            <p class="text-black font-bold text-center text-2xl">Atualizar uma Task</p>
        </div>

        <div class="w-full mt-10">
            <div class="text-center text-red-600">{{ errorMessage }}</div>
            <form class="w-[100%]">
                <div>
                    <label for="title-task-update" class="font-semibold">Título</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="title-task-update" name="title-task-update" placeholder="Task..." required v-model="task.title" :disabled="updateCheck.value">
                </div>

                <div class="mt-2">
                    <label for="description-task-update" class="font-semibold">Descrição</label>
                    <textarea name="description-task-update" id="description-task-update" class="w-full rounded p-2 bg-slate-200 shadow" placeholder="O que precisa ser feito?" required v-model="task.description" :disabled="updateCheck.value"></textarea>
                    <!-- <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="description-task-update" name="description-task-update" placeholder="What needs to be done?" required v-model="task.description" :disabled="updateCheck.value"> -->
                </div>

                <div class="mt-2 grid grid-cols-1 md:grid-cols-2">
                    <div class="md:mr-2">
                        <label for="end-date-task-update" class="font-semibold">Data final</label>
                        <input type="date" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="end-date-task-update" name="end-date-task-update" required v-model="task.expected_end_date" :disabled="updateCheck.value">
                    </div>
                    <div class="md:mr-2">
                        <label for="status-task-update" class="font-semibold">Status</label>
                        <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="status-task-update" name="status-task-update" required v-model="task.status" :disabled="updateCheck.value">
                            <option value="to do">A fazer</option>
                            <option value="in progress">Em andamento</option>
                            <option value="cancelled">Cancelada</option>
                            <option value="overdue">Atrasada</option>
                            <option value="urgent">Urgente</option>
                            <option value="completed">Finalizada</option>
                        </select>
                    </div>
                </div>
                <div class="mt-2">
                    <label for="type-task-update" class="font-semibold">Tipo</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="type-task-update" name="type-task-update" required v-model="task.type_task" :disabled="updateCheck.value">
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
                        <option value="created by gemini" disabled>Criado pelo Gemini</option>
                    </select>
                </div>
                <div class="mt-2">
                    <label for="responsible-task-update" class="font-semibold">Responsável</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="responsible-task-update" name="responsible-task-update" required v-model="task.id_user" :disabled="updateCheck.value">
                        <option value="">Selecione um responsável</option>
                        <option :value="member.id" v-for="member in members" :key="member.id">{{ member.name.toUpperCase() }}</option>
                    </select>
                </div>
            </form>
        </div>        
        <div class="h-10 mt-10">
            <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="updateTask" :disabled="updateCheck.value">Atualizar Task</button>
        </div>
    </div>
</template>