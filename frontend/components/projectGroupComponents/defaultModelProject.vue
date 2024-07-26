<script lang="js" setup>
import axios from 'axios';
import CreateTaskForm from './CreateTaskForm.vue';

const runtimeConfig = useRuntimeConfig();

let visibilityCreateTaskModal = ref(false);

</script>

<template>
    <div class="w-screen mt-24">
        <div class="flex w-full justify-around items-center">
            <h1 class="font-bold text-5xl">Tasks</h1>
            <UButton
                icon="i-heroicons-plus-solid"
                size="sm"
                color="blue"
                variant="solid"
                label="New task"
                :trailing="false"
                :onClick="() => {visibilityCreateTaskModal = true}"
            />
        </div>
        <div class="mt-2 w-full flex justify-center">
            <table class="table-auto w-[80%] border-2 border-gray-400">
                <thead>
                    <tr>
                        <th class="text-center">Status</th>
                        <th class="text-center">Title</th>
                        <th class="text-center">Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>

    <UModal v-model="visibilityCreateTaskModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <CreateTaskForm />
        </UCard>
    </UModal>
</template>