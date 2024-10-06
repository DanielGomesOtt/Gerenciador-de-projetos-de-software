<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import ProjectProgressReport from '~/components/reportsComponents/ProjectProgressReport.vue';
import ProjectsPriorityReport from '~/components/reportsComponents/ProjectsPriorityReport.vue';

let visibleLanguage = ref(localStorage.getItem('language'));
let selectedReport = ref('');

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
];
let taskReports = [
    [{
        label: 'General task report',
        click: () => {
            selectedReport.value = 'general task report';
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
        <div class="w-96 flex justify-around mt-14">
            <UDropdown :items="projectReports">
                <UButton color="white" label="Project reports" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>

            <UDropdown :items="taskReports">
                <UButton color="white" label="Task reports" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
        </div>
    </div>

    <div class="w-screen flex justify-center mt-14">
        <div v-if="selectedReport == ''" class="h-96 flex items-center justify-center">
            <h2 class="text-2xl md:text-4xl font-bold" v-if="visibleLanguage == 'en'">No report selected.</h2>
            <h2 class="text-2xl md:text-4xl font-bold" v-if="visibleLanguage == 'pt-br'">Nenhum relatório foi selecionado.</h2>
        </div>
        <div v-if="selectedReport == 'project progress report'">
            <ProjectProgressReport :visibleLanguage="visibleLanguage"/>
        </div>
        <div v-if="selectedReport == 'project priority report'">
            <ProjectsPriorityReport :visibleLanguage="visibleLanguage"/>
        </div>
    </div>

</template>