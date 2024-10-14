<script lang="js" setup>
const props = defineProps({
    visibleLanguage: String
});
</script>

<template>
    <UCard class="w-full h-full text-center font-bold hover:shadow-lg hover:cursor-pointer my-5 border-2"
            :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: {background: 'font-bold text-xl rounded-t-lg bg-slate-300'} }"
        >
            <template #header>
                <div>
                    <a href="/paid_plans" v-if="props.visibleLanguage == 'en'">Prices</a>
                    <a href="/paid_plans" v-if="props.visibleLanguage == 'pt-br'">Preços</a>
                </div>
            </template>
            <div class="bg-white text-black p-5 rounded-lg w-full">
                <div>
                    <p class="text-justify" v-if="props.visibleLanguage == 'pt-br'">A página de preços, é o lugar aonde você poderá conferir os planos e escolher o melhor para você.</p>
                    <p class="text-justify mt-2" v-if="props.visibleLanguage == 'pt-br'">Também será possível verificar seu plano atual e melhorar seu plano mensal.</p>
                    <p class="text-justify" v-if="props.visibleLanguage == 'en'">The pricing page is where you can review the plans and choose the one that suits you best.</p>
                    <p class="text-justify mt-2" v-if="props.visibleLanguage == 'en'">You will also be able to check your current plan and upgrade your monthly plan.</p>
                </div>
                <div>
                    <img src="../../assets/img/prices_page.png" alt="prices page image" class="w-full">
                </div>
            </div>
        </UCard>
</template>