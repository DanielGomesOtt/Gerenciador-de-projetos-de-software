<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
import axios from 'axios';
import ChangePlan from '~/components/paymentComponents/ChangePlan.vue';

const runtimeConfig = useRuntimeConfig();

let isPremiumUser = ref(JSON.parse(localStorage.getItem('userStorage')).premium_user);

const setPaymentMonthlyPlan = async () => {
    try{
        let data = {
            'name': JSON.parse(localStorage.getItem('userStorage')).name,
            'email': JSON.parse(localStorage.getItem('userStorage')).email,
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
        }

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'set_payment_monthly_plan', data, {
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

const setPaymentYearlyPlan = async () => {
  try {
        let data = {
            'name': JSON.parse(localStorage.getItem('userStorage')).name,
            'email': JSON.parse(localStorage.getItem('userStorage')).email,
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
        }

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'set_payment_yearly_plan', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        });

        if(response && response.data){
            window.location.href = response.data.init_point;
        }

  } catch (error) {
    console.log(error);
  }
};

</script>

<template>
    <NavBar />
    <div class="flex w-screen justify-center mt-20">
        <div>
            <h1 class="text-5xl font-bold text-center">Choose your plan</h1>
            <h2 class="text-2xl font-semibold text-center mt-5 text-slate-400">Choose the best plan for managing your projects.</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 mt-10 gap-4">
                <div>
                    <UCard
                        class="shadow-lg rounded-lg border-2 border-gray-300 p-5 cursor-pointer"
                        :ui="{ header:{ background: 'bg-green-500 rounded-lg' }, ring: '', divide: 'divide-y divide-black-500 dark:divide-gray-800' }"
                    >
                        <template #header>
                            <div class="text-white">
                                <div class="font-bold text-2xl text-center">
                                    Monthly Plan
                                </div>
                                <div class="font-bold text-3xl text-center mt-2">
                                    R$ 15,00
                                </div>
                            </div>
                        </template>

                        <div class="font-semibold mb-5">
                            <ul class="list-disc">
                                <li>Gemini Integration</li>
                                <li>Real Time Chat</li>
                                <li>Unlimited Project Creation</li>
                            </ul>
                        </div>

                        <template #footer>
                            <div class="w-full flex justify-center">
                                <button class="bg-green-500 text-white p-2 rounded-lg" @click="setPaymentMonthlyPlan">Renew Now</button>
                            </div>
                        </template>
                    </UCard>
                </div>


                <div>
                    <UCard
                        class="shadow-lg rounded-lg border-2 border-gray-300 p-5 cursor-pointer"
                        :ui="{ header:{ background: 'bg-blue-500 rounded-lg' }, ring: '', divide: 'divide-y divide-black-500 dark:divide-gray-800' }"
                    >
                        <template #header>
                            <div class="text-white">
                                <div class="font-bold text-2xl text-center">
                                    Yearly Plan
                                </div>
                                <div class="font-bold text-3xl text-center mt-2">
                                    R$ 150,00
                                </div>
                            </div>
                        </template>

                        <div class="font-semibold">
                            <ul class="list-disc">
                                <li>Gemini Integration</li>
                                <li>Real Time Chat</li>
                                <li>Unlimited Project Creation</li>
                                <li>2 months for free</li>
                            </ul>
                        </div>

                        <template #footer>
                            <div class="w-full flex justify-center">
                                <button class="bg-blue-500 text-white p-2 rounded-lg" @click="setPaymentYearlyPlan">Renew Now</button>
                            </div>
                        </template>
                    </UCard>
                </div>
                
            </div>  
        </div>
    </div>
</template>