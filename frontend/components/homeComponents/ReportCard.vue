<script lang="js" setup>
const props = defineProps({
    visibleLanguage: String
})
</script>

<template>
    <UCard class="w-full h-full text-center font-bold hover:shadow-lg hover:cursor-pointer my-5 border-2"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: {background: 'font-bold text-xl rounded-t-lg bg-slate-300'} }"
    >
        <template #header>
            <div>
                <a href="/reports" v-if="props.visibleLanguage == 'en'">Reports</a>
                <a href="/reports" v-if="props.visibleLanguage == 'pt-br'">Relatórios</a>
            </div>
        </template>
        <div class="bg-white text-black p-5 rounded-lg w-full">
            <div>
                <p class="text-justify" v-if="props.visibleLanguage == 'pt-br'">A página de relatórios, é o lugar aonde você pode analisar os dados que o sistema fornece sobre projetos, tasks e usuários.</p>
                <p class="text-justify mt-2" v-if="props.visibleLanguage == 'pt-br'">Use os dados dessa página para analisar a melhor forma de gerenciar seus projetos.</p>
                <p class="text-justify" v-if="props.visibleLanguage == 'en'">The reports page is where you can analyze the data provided by the system about projects, tasks, and users.</p>
                <p class="text-justify mt-2" v-if="props.visibleLanguage == 'en'">Use the data from this page to analyze the best way to manage your projects.</p>
            </div>
            <div>
                <img src="../../assets/img/report_page.png" alt="account page image" class="w-full">
            </div>
        </div>
    </UCard>
</template>