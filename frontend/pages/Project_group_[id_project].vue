<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

let isOpen = ref(false);

const openSlideOver = () => {
    isOpen.value = !isOpen.value;
}

const getUsersByProject = async () => {
    try{
        
    }catch(error){
        console.log(error);
    }
}

</script>

<template>
    <NavBar />
    <div class="flex justify-between">
        <div>

        </div>
        <div class="flex items-center">
            <button @click="openSlideOver" class="mr-2"><Icon name="mdi:chevron-left-circle" size="2.5em" class="text-blue-400" /></button>
            <USlideover v-model="isOpen" :overlay="false">
                <UCard
                    class="flex flex-col flex-1"
                    :ui="{ header:{ background: 'bg-blue-400' }, body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
                >
                    
                <template #header>
                    <div class="bg-blue-400 flex justify-between">
                        <button class="text-white"><Icon name="mdi:plus" color="white" size="1.8em"/>New Member</button>
                        <UButton
                            color="gray"
                            variant="ghost"
                            size="sm"
                            icon="i-heroicons-x-mark-20-solid"
                            class="flex sm:hidden text-white"
                            square
                            padded
                            @click="isOpen = false"
                        />
                    </div>
                </template>

                <template #body>
                    <div class="h-[100%]">

                    </div>
                </template>
                </UCard>
            </USlideover>
        </div>
    </div>
</template>