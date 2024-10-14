<script lang="js" setup>

const props = defineProps({
    visibleLanguage: String
})

</script>

<template>
    <UCard class="w-full h-full text-center font-bold hover:shadow-lg hover:cursor-pointer my-5 border-2"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: {background: 'font-bold text-xl bg-slate-300 rounded-t-lg'} }"
    >
        <template #header>
            <div>
                <a href="/project" v-if="props.visibleLanguage == 'en'">Projects</a>
                <a href="/project" v-if="props.visibleLanguage == 'pt-br'">Projetos</a>
            </div>
        </template>
        <div class="bg-white text-black p-5 rounded-lg w-full">
            <div>
                <p class="text-justify" v-if="props.visibleLanguage == 'pt-br'">A página de projetos, é o lugar aonde você irá criar seus projetos e administrá-los.</p>
                <p class="text-justify mt-2" v-if="props.visibleLanguage == 'pt-br'">Também será possível entrar nos projetos e gerenciar as tarefas criadas para aquele projeto.</p>
                <p class="text-justify" v-if="props.visibleLanguage == 'en'">The projects page is where you will create and manage your projects.</p>
                <p class="text-justify mt-2" v-if="props.visibleLanguage == 'en'">It will also be possible to enter the projects and manage the tasks created for that project.</p>
            </div>
            <div>
                <img src="../../assets/img/project_page.png" alt="project page image" class="w-full">
            </div>
        </div>
    </UCard>
</template>