<script lang="js" setup>
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();
const props = defineProps({
    visibleLanguage: String
});

let currentPlan = ref('');
let otherPlan = ref('');
let isOpenModalChangePlan = ref(false);

const changeVisibilityModalChangePlan = () => {
    isOpenModalChangePlan.value = !isOpenModalChangePlan.value;
}

const changePlan = async () => {
    try{
        let data = {
            'name': JSON.parse(localStorage.getItem('userStorage')).name,
            'email': JSON.parse(localStorage.getItem('userStorage')).email,
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
        }

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'set_payment_upgrade_yearly_plan', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });

        if(response && response.data){
            window.location.href = response.data.init_point;
        }
    }catch(error){
        console.log(error);
    }
}

onBeforeMount(() => {
    currentPlan.value = JSON.parse(localStorage.getItem('userStorage')).type_premium;
    otherPlan.value = currentPlan.value == 'monthly' ? 'yearly' : 'monthly';
})
</script>

<template>
    <div v-if="visibleLanguage == 'en'">
        <h3 class="text-3xl md:text-5xl font-bold text-center mt-56">Your current plan is {{ currentPlan }}</h3>
        <p class="text-lg md:text-2xl font-semibold text-center mt-5 text-slate-400" v-if="currentPlan == 'monthly'">Upgrade your plan for just R$ 120,00.</p>
        <p class="text-lg md:text-2xl font-semibold text-center mt-5 text-slate-400" v-if="currentPlan == 'yearly'">You already have the best plan.</p>
        <div class="flex justify-around">
            <button type="button" class="bg-blue-500 text-white p-2 rounded-lg mt-5" @click="changeVisibilityModalChangePlan" v-if="currentPlan == 'monthly'">Upgrade</button>
        </div>
    </div>
    <div v-if="visibleLanguage == 'pt-br'">
        <h3 class="text-3xl md:text-5xl font-bold text-center mt-56">Seu plano atual é o {{ (currentPlan == 'monthly' ? 'mensal' : 'anual') }}</h3>
        <p class="text-lg md:text-2xl font-semibold text-center mt-5 text-slate-400" v-if="currentPlan == 'monthly'">Melhore seu plano para o anual por apenas R$ 120,00.</p>
        <p class="text-lg md:text-2xl font-semibold text-center mt-5 text-slate-400" v-if="currentPlan == 'yearly'">Você já possui o melhor plano.</p>
        <div class="flex justify-around">
            <button type="button" class="bg-blue-500 text-white p-2 rounded-lg mt-5" @click="changeVisibilityModalChangePlan" v-if="currentPlan == 'monthly'">Melhorar</button>
        </div>
    </div>
    <UModal v-model="isOpenModalChangePlan">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">You will switch to the {{ otherPlan }} plan. Do you wish to proceed with this action ?</p>
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Você irá mudar para o plano anual. Você deseja prosseguir com essa ação ?</p>
            
            <template #footer>
                <div class="flex justify-around items-center" v-if="visibleLanguage == 'en'">
                    <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="changePlan">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalChangePlan">Cancel</button>
                </div>

                <div class="flex justify-around items-center" v-if="visibleLanguage == 'pt-br'">
                    <button type="button" class="bg-green-600 text-white rounded-md w-28 h-10" @click="changePlan">Confirmar</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="changeVisibilityModalChangePlan">Cancelar</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>