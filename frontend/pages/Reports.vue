<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';

let visibleLanguage = ref(localStorage.getItem('language'));
let selectedReport = ref('');

let projectReports = [
    [{
        label: 'Projects progress report',
        click: () => {
            selectedReport.value = 'project progress report';
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

    <div class="w-screen flex justify-center mt-20">
        <div v-if="selectedReport == 'general project report'">
            general project report
        </div>
        <div v-if="selectedReport == 'general task report'">
            general task report
        </div>
    </div>
</template>