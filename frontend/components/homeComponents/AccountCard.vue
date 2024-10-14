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
                <a href="/account" v-if="props.visibleLanguage == 'en'">Account</a>
                <a href="/account" v-if="props.visibleLanguage == 'pt-br'">Conta</a>
            </div>
        </template>
        <div class="bg-white text-black p-5 rounded-lg w-full">
            <div>
                <p class="text-justify" v-if="props.visibleLanguage == 'pt-br'">A página da sua conta, é o lugar aonde você poderá visualizar e editar suas informações.</p>
                <p class="text-justify mt-2" v-if="props.visibleLanguage == 'pt-br'">Também será possível escolher uma foto de avatar ou inativar sua conta.</p>
                <p class="text-justify" v-if="props.visibleLanguage == 'en'">The account page is where you can view and edit your information.</p>
                <p class="text-justify mt-2" v-if="props.visibleLanguage == 'en'">You will also be able to choose an avatar photo or deactivate your account.</p>
            </div>
            <div>
                <img src="../../assets/img/account_page.png" alt="account page image" class="w-full">
            </div>
        </div>
    </UCard>
</template>