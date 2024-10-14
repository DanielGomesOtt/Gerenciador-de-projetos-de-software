<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import ProjectProgressReport from '~/components/reportsComponents/ProjectProgressReport.vue';
import ProjectsPriorityReport from '~/components/reportsComponents/ProjectsPriorityReport.vue';
import ProjectPerformanceStage from '~/components/reportsComponents/ProjectPerformanceStage.vue';
import TaskProgressReport from '~/components/reportsComponents/TaskProgressReport.vue';
import TaskByUserReport from '~/components/reportsComponents/TaskByUserReport.vue';
import UserTaskPerformanceByProjectStageReport from '~/components/reportsComponents/UserTaskPerformanceByProjectStageReport.vue';
import ProjectMembersReport from '~/components/reportsComponents/ProjectMembersReport.vue';
import GeneralReport from '~/components/reportsComponents/generalReport.vue';



let visibleLanguage = ref(localStorage.getItem('language'));
let selectedReport = ref('general report');

let projectReports = [
    [{
        label: 'Projects progress report',
        click: () => {
            selectedReport.value = 'project progress report';
        }
    }],
    [{
        label: 'Projects priority report',
        click: () => {
            selectedReport.value = 'project priority report';
        }
    }],
    [{
        label: 'Performance in projects by project stage',
        click: () => {
            selectedReport.value = 'performance in projects by project stage';
        }
    }],
];
let taskReports = [
    [{
        label: 'Tasks progress report',
        click: () => {
            selectedReport.value = 'task progress report';
        }
    }],
    [{
        label: 'Tasks by user report',
        click: () => {
            selectedReport.value = 'task by user report';
        }
    }],
    [{
        label: 'User Performance in tasks by project stage',
        click: () => {
            selectedReport.value = 'performance in tasks by project stage';
        }
    }],
];

let userReports = [
    [{
        label: 'Users report',
        click: () => {
            selectedReport.value = 'project members report';
        }
    }]
];

let projectReportsPtbr = [
    [{
        label: 'Relatório de progresso dos projetos',
        click: () => {
            selectedReport.value = 'project progress report';
        }
    }],
    [{
        label: 'Relatório de prioridade dos projetos',
        click: () => {
            selectedReport.value = 'project priority report';
        }
    }],
    [{
        label: 'Relatório de performance nos projetos pelo estágio do projeto',
        click: () => {
            selectedReport.value = 'performance in projects by project stage';
        }
    }],
];
let taskReportsPtbr = [
    [{
        label: 'Relatório de progresso das tasks',
        click: () => {
            selectedReport.value = 'task progress report';
        }
    }],
    [{
        label: 'Relatório de tasks por usuário',
        click: () => {
            selectedReport.value = 'task by user report';
        }
    }],
    [{
        label: 'Relatório de performance do usuário nas tasks pelo estágio do projeto',
        click: () => {
            selectedReport.value = 'performance in tasks by project stage';
        }
    }],
];

let userReportsPtbr = [
    [{
        label: 'Relatório de usuários',
        click: () => {
            selectedReport.value = 'project members report';
        }
    }]
];

const changeLanguage = () => {
    visibleLanguage.value = localStorage.getItem('language');
}

</script>

<template>
    <NavBar @changeLanguageParent="changeLanguage"/>
    <div class="w-screen flex justify-center">
        <div class="w-full flex flex-wrap justify-around mt-14" v-if="visibleLanguage == 'en'">
            <UDropdown :items="projectReports">
                <UButton color="white" label="Project reports" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>

            <UDropdown :items="taskReports">
                <UButton color="white" label="Task reports" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>

            <UDropdown :items="userReports">
                <UButton color="white" label="User reports" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
        </div>
        <div class="w-full flex flex-wrap justify-around mt-14" v-if="visibleLanguage == 'pt-br'">
            <UDropdown :items="projectReportsPtbr">
                <UButton color="white" label="Relatórios de projetos" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>

            <UDropdown :items="taskReportsPtbr">
                <UButton color="white" label="Relatórios de tasks" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>

            <UDropdown :items="userReportsPtbr">
                <UButton color="white" label="Relatórios de usuário" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
        </div>
    </div>

    <div class="w-screen flex justify-center mt-5">
        <div v-if="selectedReport == 'general report'">
            <GeneralReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport == 'project progress report'">
            <ProjectProgressReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport == 'project priority report'">
            <ProjectsPriorityReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport ==  'performance in projects by project stage'">
            <ProjectPerformanceStage :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport ==  'task progress report'">
            <TaskProgressReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport ==  'task by user report'">
            <TaskByUserReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport == 'performance in tasks by project stage'">
            <UserTaskPerformanceByProjectStageReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport == 'project members report'">
            <ProjectMembersReport :visibleLanguage="visibleLanguage"/>
        </div>
    </div>

</template>