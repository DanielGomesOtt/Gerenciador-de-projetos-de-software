<script setup lang="js">
import { ref, watch, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const props = defineProps({
    visibleLanguage: String,
});
const runtimeConfig = useRuntimeConfig();

//project progress report const and variables
const chartLabelsProjectProgressEn = ['in progress', 'overdue', 'completed', 'cancelled'];
const chartLabelsProjectProgressPtbr = ['em andamento', 'atrasado', 'finalizado', 'cancelado'];
const chartProjectProgressEn = ref(null);
const chartProjectProgressPtbr = ref(null);

let chartProjectProgressInstance = null;
let chartProjectProgressData = ref([]);
let projectProgressData = ref([]);

function createProjectProgressChart(language) {
    
    if (chartProjectProgressInstance) {
        chartProjectProgressInstance.destroy();
    }

    if(props.visibleLanguage == 'en'){
        document.getElementById('container-project-progress-chart-pt').setAttribute('hidden', '');
        document.getElementById('container-project-progress-chart-en').removeAttribute('hidden');
    }else{
        document.getElementById('container-project-progress-chart-en').setAttribute('hidden', '');
        document.getElementById('container-project-progress-chart-pt').removeAttribute('hidden');
    }

    const canvas = language == 'pt-br' ? chartProjectProgressPtbr.value : chartProjectProgressEn.value;
    const labels = language == 'pt-br' ? chartLabelsProjectProgressPtbr : chartLabelsProjectProgressEn;
    const labelTitle = language == 'pt-br' ? 'Nº de projetos com esse status' : 'Nº of projects with this status';

    chartProjectProgressInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartProjectProgressData.value,
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: [
                'rgba(0, 0, 255, 0.2)',   
                'rgba(255, 165, 0, 0.2)',  
                'rgba(0, 128, 0, 0.2)',    
                'rgba(255, 0, 0, 0.2)'     
            ],
            borderColor: [
                'rgba(0, 0, 255, 1)',   
                'rgba(255, 165, 0, 1)', 
                'rgba(0, 128, 0, 1)',    
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

const getProjectProgress = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_progress', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id 
            }
        });

        if(response){
            const projects = response.data;
            projectProgressData.value = response.data;
            let in_progress = 0;
            let overdue = 0;
            let completed = 0;
            let cancelled = 0;

            if(projects !== null && projects !== undefined && Array.isArray(projects)){
                projects.forEach((project) => {
                    if(project.status == 'in progress'){
                        in_progress = in_progress + 1;
                    }else if(project.status == 'overdue'){
                        overdue = overdue + 1;
                    }else if(project.status == 'completed'){
                        completed = completed + 1;
                    }else if(project.status == 'cancelled'){
                        cancelled = cancelled + 1;
                    }
                });
                chartProjectProgressData.value = [in_progress, overdue, completed, cancelled];
            }
            createProjectProgressChart(props.visibleLanguage);
        }
    }catch(error){
        console.log(error);
    }
}
//-------------------------------------------

//project priority report const and variables
const chartLabelsProjectPriorityEn = ['Low Priority', 'Medium Priority', 'High Priority'];
const chartLabelsProjectPriorityPtbr = ['Prioridade Baixa', 'Prioridade Média', 'Prioridade Alta'];
const chartProjectPriorityEn = ref(null);
const chartProjectPriorityPtbr = ref(null);


let chartProjectPriorityInstance = null;
let chartProjectPriorityData = ref([]);
let projectPriorityData = ref([]);

function createProjectPriorityChart(language) {
    
    if (chartProjectPriorityInstance) {
        chartProjectPriorityInstance.destroy();
    }

    if(props.visibleLanguage == 'en'){
        document.getElementById('container-project-priority-chart-pt').setAttribute('hidden', '');
        document.getElementById('container-project-priority-chart-en').removeAttribute('hidden');
    }else{
        document.getElementById('container-project-priority-chart-en').setAttribute('hidden', '');
        document.getElementById('container-project-priority-chart-pt').removeAttribute('hidden');
    }

    const canvas = language == 'pt-br' ? chartProjectPriorityPtbr.value : chartProjectPriorityEn.value;
    const labels = language == 'pt-br' ? chartLabelsProjectPriorityPtbr : chartLabelsProjectPriorityEn;
    const labelTitle = language == 'pt-br' ? 'Nº de projetos com essa prioridade' : 'Nº of projects with this priority';

    chartProjectPriorityInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartProjectPriorityData.value,
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
            projectPriorityData.value = response.data;
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
                chartProjectPriorityData.value = [low, medium, high];
            }
            createProjectPriorityChart(props.visibleLanguage);
        }
    }catch(error){
        console.log(error);
    }
}
//----------------------------------------

//project performance const and variables

const chartLabelsProjectPerformanceEn = ["initial planning", "project design", "development", "tests", "deployment", "maintenance"];
const chartLabelsProjectPerformancePtbr = ["planejamento inicial", "design do projeto", "desenvolvimento", "testes", "implantação", "manutenção"];
const chartProjectPerformanceEn = ref(null);
const chartProjectPerformancePtbr = ref(null);


let chartProjectPerformanceInstance = null;
let chartProjectPerformanceData = ref([]);
let tasksProjectPerformanceData = ref([]);
let selectedProjectPerformance = ref('');

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

function createProjectPerformanceChart(language) {
    
    if (chartProjectPerformanceInstance) {
        chartProjectPerformanceInstance.destroy();
    }

    if(props.visibleLanguage == 'en'){
        document.getElementById('container-project-performance-chart-pt').setAttribute('hidden', '');
        document.getElementById('container-project-performance-chart-en').removeAttribute('hidden');
    }else{
        document.getElementById('container-project-performance-chart-en').setAttribute('hidden', '');
        document.getElementById('container-project-performance-chart-pt').removeAttribute('hidden');
    }

    const canvas = language == 'pt-br' ? chartProjectPerformancePtbr.value : chartProjectPerformanceEn.value;
    const labels = language == 'pt-br' ? chartLabelsProjectPerformancePtbr : chartLabelsProjectPerformanceEn;
    const labelTitle = language == 'pt-br' ? '% de performance nos projetos: (% conclusão no estágio) - (% de atraso no estágio)' : '% of performance in the projects: (% completion in the stage) - (% delay in the stage)';

    chartProjectPerformanceInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartProjectPerformanceData.value,
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

const getProjectStagePerformance = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_stage_performance', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: JSON.parse(localStorage.getItem('userStorage')).id,
                id_project: selectedProjectPerformance.value, 
            }
        });

        if(response && response.data && response.data.length > 0){
            const tasks = response.data;
            tasksProjectPerformanceData.value = response.data;
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

                initial_planning_completed_data.value = (initial_planning_completed / initial_planning) * 100;
                initial_planning_overdue_data.value = (initial_planning_overdue / initial_planning) * 100;
                initial_planning = initial_planning_completed_data.value - initial_planning_overdue_data.value;

                project_design_completed_data.value = (project_design_completed / project_design) * 100;
                project_design_overdue_data.value = (project_design_overdue / project_design) * 100;
                project_design = project_design_completed_data.value - project_design_overdue_data.value;

                development_completed_data.value = (development_completed / development) * 100;
                development_overdue_data.value = (development_overdue / development) * 100;
                development = development_completed_data.value - development_overdue_data.value;

                tests_completed_data.value = (tests_completed / tests) * 100;
                tests_overdue_data.value = (tests_overdue / tests) * 100;
                tests = tests_completed_data.value - tests_overdue_data.value;

                deployment_completed_data.value = (deployment_completed / deployment) * 100;
                deployment_overdue_data.value = (deployment_overdue / deployment) * 100;
                deployment = deployment_completed_data.value - deployment_overdue_data.value;

                maintenance_completed_data.value = (maintenance_completed / maintenance) * 100;
                maintenance_overdue_data.value = (maintenance_overdue / maintenance) * 100;
                maintenance = maintenance_completed_data.value - maintenance_overdue_data.value;
                
                chartProjectPerformanceData.value = [initial_planning, project_design, development, tests, deployment, maintenance];
            }
            createProjectPerformanceChart(props.visibleLanguage);
        }else{
            chartProjctPerformanceData.value = [0, 0, 0, 0, 0, 0];
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
            createProjectPerformanceChart(props.visibleLanguage);
        }
    }catch(error){
        console.log(error);
    }
}

//----------------------------------------

//task progress report const and variables

const chartLabelsTaskProgressEn = ['to do', 'in progress', 'urgent', 'overdue', 'completed', 'cancelled'];
const chartLabelsTaskProgressPtbr = ['a fazer', 'em andamento', 'urgente', 'atrasado', 'finalizado', 'cancelado'];
const chartTaskProgressEn = ref(null);
const chartTaskProgressPtbr = ref(null);


let chartTaskProgressInstance = null;
let chartTaskProgressData = ref([]);
let taskProgressData = ref([]);
let selectedProjectTaskProgress = ref('');
let selectedStageTaskProgress = ref('');

function createTaskProgressChart(language) {
    
    if (chartTaskProgressInstance) {
        chartTaskProgressInstance.destroy();
    }

    if(props.visibleLanguage == 'en'){
        document.getElementById('container-task-progress-chart-pt').setAttribute('hidden', '');
        document.getElementById('container-task-progress-chart-en').removeAttribute('hidden');
    }else{
        document.getElementById('container-task-progress-chart-en').setAttribute('hidden', '');
        document.getElementById('container-task-progress-chart-pt').removeAttribute('hidden');
    }

    const canvas = language == 'pt-br' ? chartTaskProgressPtbr.value : chartTaskProgressEn.value;
    const labels = language == 'pt-br' ? chartLabelsTaskProgressPtbr : chartLabelsTaskProgressEn;
    const labelTitle = language == 'pt-br' ? 'Nº de tasks com esse status' : 'Nº of tasks with this status';

    chartTaskProgressInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartTaskProgressData.value,
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
                id_project: selectedProjectTaskProgress.value,
                project_stage: selectedStageTaskProgress.value, 
            }
        });

        if(response){
            const tasks = response.data;
            taskProgressData.value = response.data;
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
                chartTaskProgressData.value = [to_do, in_progress, urgent, overdue, completed, cancelled];
            }
            createTaskProgressChart(props.visibleLanguage);
        }
    }catch(error){
        console.log(error);
    }
}
//----------------------------------------

//task performance report const and variables

const chartLabelsTaskPerformanceEn = ["initial planning", "project design", "development", "tests", "deployment", "maintenance"];
const chartLabelsTaskPerformancePtbr = ["planejamento inicial", "design do projeto", "desenvolvimento", "testes", "implantação", "manutenção"];
const chartTaskPerformanceEn = ref(null);
const chartTaskPerformancePtbr = ref(null);


let chartTaskPerformanceInstance = null;
let chartTaskPerformanceData = ref([]);
let taskPerformanceData = ref([]);
let idUser = ref(JSON.parse(localStorage.getItem('userStorage')).id);

let initial_planning_overdue_task_performance_data = ref(0);
let initial_planning_completed_task_performance_data = ref(0);

let project_design_overdue_task_performance_data = ref(0);
let project_design_completed_task_performance_data = ref(0);

let development_overdue_task_performance_data = ref(0);
let development_completed_task_performance_data = ref(0);

let tests_overdue_task_performance_data = ref(0);
let tests_completed_task_performance_data = ref(0);

let deployment_overdue_task_performance_data = ref(0);
let deployment_completed_task_performance_data = ref(0);

let maintenance_overdue_task_performance_data = ref(0);
let maintenance_completed_task_performance_data = ref(0);

function createTaskPerformanceChart(language) {
    
    if (chartTaskPerformanceInstance) {
        chartTaskPerformanceInstance.destroy();
    }

    if(props.visibleLanguage == 'en'){
        document.getElementById('container-task-performance-chart-pt').setAttribute('hidden', '');
        document.getElementById('container-task-performance-chart-en').removeAttribute('hidden');
    }else{
        document.getElementById('container-task-performance-chart-en').setAttribute('hidden', '');
        document.getElementById('container-task-performance-chart-pt').removeAttribute('hidden');
    }

    const canvas = language == 'pt-br' ? chartTaskPerformancePtbr.value : chartTaskPerformanceEn.value;
    const labels = language == 'pt-br' ? chartLabelsTaskPerformancePtbr : chartLabelsTaskPerformanceEn;
    const labelTitle = language == 'pt-br' ? '% de performance nas tasks: (% conclusão no estágio) - (% de atraso no estágio)' : '% of performance in the tasks: (% completion in the stage) - (% delay in the stage)';

    chartTaskPerformanceInstance = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartTaskPerformanceData.value,
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

const getProjectStageTaskPerformance = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_stage_user_performance', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                id_user: idUser.value,
            }
        });

        if(response && response.data && response.data.length > 0){
            const tasks = response.data;
            taskPerformanceData.value = response.data;
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

                initial_planning_completed_task_performance_data.value = (initial_planning_completed / initial_planning) * 100;
                initial_planning_overdue_task_performance_data.value = (initial_planning_overdue / initial_planning) * 100;
                initial_planning = initial_planning_completed_task_performance_data.value - initial_planning_overdue_task_performance_data.value;

                project_design_completed_task_performance_data.value = (project_design_completed / project_design) * 100;
                project_design_overdue_task_performance_data.value = (project_design_overdue / project_design) * 100;
                project_design = project_design_completed_task_performance_data.value - project_design_overdue_task_performance_data.value;

                development_completed_task_performance_data.value = (development_completed / development) * 100;
                development_overdue_task_performance_data.value = (development_overdue / development) * 100;
                development = development_completed_task_performance_data.value - development_overdue_task_performance_data.value;

                tests_completed_task_performance_data.value = (tests_completed / tests) * 100;
                tests_overdue_task_performance_data.value = (tests_overdue / tests) * 100;
                tests = tests_completed_task_performance_data.value - tests_overdue_task_performance_data.value;

                deployment_completed_task_performance_data.value = (deployment_completed / deployment) * 100;
                deployment_overdue_task_performance_data.value = (deployment_overdue / deployment) * 100;
                deployment = deployment_completed_task_performance_data.value - deployment_overdue_task_performance_data.value;

                maintenance_completed_task_performance_data.value = (maintenance_completed / maintenance) * 100;
                maintenance_overdue_task_performance_data.value = (maintenance_overdue / maintenance) * 100;
                maintenance = maintenance_completed_task_performance_data.value - maintenance_overdue_task_performance_data.value;
                
                chartTaskPerformanceData.value = [initial_planning, project_design, development, tests, deployment, maintenance];
            }
            createTaskPerformanceChart(props.visibleLanguage);
        }else{
            chartTaskPerformanceData.value = [0, 0, 0, 0, 0, 0];
            initial_planning_overdue_task_performance_data.value = 0;
            initial_planning_completed_task_performance_data.value = 0;

            project_design_overdue_task_performance_data.value = 0;
            project_design_completed_task_performance_data.value = 0;

            development_overdue_task_performance_data.value = 0;
            development_completed_task_performance_data.value = 0;

            tests_overdue_task_performance_data.value = 0;
            tests_completed_task_performance_data.value = 0;

            deployment_overdue_task_performance_data.value = 0;
            deployment_completed_task_performance_data.value = 0;

            maintenance_overdue_task_performance_data.value = 0;
            maintenance_completed_task_performance_data.value = 0;
            createTaskPerformanceChart(props.visibleLanguage);
        }
    }catch(error){
        console.log(error);
    }
}

//-------------------------------------------

onMounted(() => {
    getProjectProgress();
    getProjectPriority();
    getProjectStagePerformance();
    getTaskProgress();
    getProjectStageTaskPerformance()
})

watch(() => props.visibleLanguage, (newLanguage) => {
    createProjectProgressChart(newLanguage);
    createProjectPriorityChart(newLanguage);
    createProjectPerformanceChart(newLanguage);
    createTaskProgressChart(newLanguage);
    createTaskPerformanceChart(newLanguage);
});
</script>

<template>
    <div class="w-screen h-full px-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <div>
                    <div id="container-project-progress-chart-en" class="w-full md:w-[500px] border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer">
                        <canvas ref="chartProjectProgressEn" class="w-full h-64"></canvas>
                    </div>
                    <div id="container-project-progress-chart-pt" class="w-full md:w-[500px] border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer">
                        <canvas ref="chartProjectProgressPtbr" class="w-full h-64"></canvas>
                    </div>
                </div>

                <div class="mt-10">
                    <div id="container-project-priority-chart-en" class="w-full md:w-[500px] border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer">
                        <canvas ref="chartProjectPriorityEn" class="w-full h-64"></canvas>
                    </div>
                    <div id="container-project-priority-chart-pt" class="w-full md:w-[500px] border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer">
                        <canvas ref="chartProjectPriorityPtbr" class="w-full h-64"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div id="container-project-performance-chart-en" class="w-full md:w-[500px] border-2 border-slate-500 rounded-lg shadow hover:shadow-lg hover:cursor-pointer">
                        <canvas ref="chartProjectPerformanceEn" class="w-full h-64"></canvas>
                    </div>
                    <div id="container-project-performance-chart-pt" class="w-full md:w-[500px] border-2 border-slate-500 rounded-lg shadow hover:shadow-lg hover:cursor-pointer">
                        <canvas ref="chartProjectPerformancePtbr" class="w-full h-64"></canvas>
                    </div>
                </div>
                <div class="mt-10">
                    <div id="container-task-progress-chart-en" class="w-full md:w-[500px] border-2 border-slate-500 rounded-lg shadow hover:shadow-lg hover:cursor-pointer">
                        <canvas ref="chartTaskProgressEn" class="w-full h-64"></canvas>
                    </div>
                    <div id="container-task-progress-chart-pt" class="w-full md:w-[500px] border-2 border-slate-500 rounded-lg shadow hover:shadow-lg hover:cursor-pointer">
                        <canvas ref="chartTaskProgressPtbr" class="w-full h-64"></canvas>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-[500px] border-2 border-slate-500 rounded-lg flex items-center shadow hover:shadow-lg hover:cursor-pointer">
                <div>
                    <div id="container-task-performance-chart-en" class="w-full md:w-[500px]">
                        <canvas ref="chartTaskPerformanceEn" class="w-full h-full"></canvas>
                    </div>
                    <div id="container-task-performance-chart-pt" class="w-full md:w-[500px]">
                        <canvas ref="chartTaskPerformancePtbr" class="w-full h-full"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
