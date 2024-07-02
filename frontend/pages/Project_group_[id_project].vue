<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
const route = useRoute();

let isOpen = ref(false);

const openSlideOver = () => {
    isOpen.value = !isOpen.value;
}

</script>

<template>
    <NavBar />
    <div class="flex justify-between">
        <div>

        </div>
        <div class="flex items-center">
            <button @click="openSlideOver" class="mr-2"><Icon name="mdi:chevron-left-circle" size="3em" class="text-blue-400" /></button>
            <USlideover v-model="isOpen">
                <UCard
                    class="flex flex-col flex-1"
                    :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                >
                    
                <div class="bg-blue-400">
                    <UButton
                        color="gray"
                        variant="ghost"
                        size="sm"
                        icon="i-heroicons-x-mark-20-solid"
                        class="flex sm:hidden absolute end-5 top-5 z-10 text-white"
                        square
                        padded
                        @click="isOpen = false"
                    />

                    <button class="text-white"><Icon name="mdi:plus" color="white" size="1.8em"/>New Member</button>
                </div>
                </UCard>
            </USlideover>
        </div>
    </div>
</template>