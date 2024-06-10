<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import { Icon } from '#components';
import CreateProjectForm from '../components/projectComponents/CreateProjectForm';

let visibilityCreateProjectModal = ref(false);

const changeVisibilityCreateProjectModal = () => {
    visibilityCreateProjectModal.value = !visibilityCreateProjectModal.value;
}
</script>

<template>
    <NavBar />
    <div class="mt-20 w-10/12 shadow mx-auto rounded-lg">
        <div class="w-full bg-blue-400 flex flex-wrap justify-between p-5 rounded-t-lg">
            <div>
                <input type="text" class="w-70 h-10 rounded-sm pl-2" placeholder="Search">
            </div>
            <div class="flex items-center">
                <button class="text-white" @click="changeVisibilityCreateProjectModal()"><Icon name="mdi:plus" color="white" size="1.8em"/>New Project</button>
            </div>
        </div>
        <UModal v-model="visibilityCreateProjectModal">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <CreateProjectForm />
            </UCard>
        </UModal>
    </div>
</template>