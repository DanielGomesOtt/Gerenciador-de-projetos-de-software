<script lang="js" setup>
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let yearlyPlanToday = ref(0.00);
let yearlyPlanMonth = ref(0.00);
let yearlyPlanYear = ref(0.00);

const yearlyPlanReport = async () => {
    try{
        yearlyPlanToday.value = 0.00;
        yearlyPlanMonth.value = 0.00;
        yearlyPlanYear.value = 0.00;

        const response = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/yearly_plan_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`, 
            }
        })

        if(response){
            let today = new Date();
            response.data.forEach(payment => {
                let date = new Date(payment.created_at);
                if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate()){
                    yearlyPlanToday.value += Number(payment.value);
                }else if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth()){
                    yearlyPlanMonth.value += Number(payment.value);
                }else if(today.getFullYear() == date.getFullYear()){
                    yearlyPlanYear.value += Number(payment.value);
                }
            });
            yearlyPlanToday.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(yearlyPlanToday.value);
            yearlyPlanMonth.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(yearlyPlanMonth.value);
            yearlyPlanYear.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(yearlyPlanYear.value);
        }
    }catch(error){
        console.log(error);
    }
} 

onMounted(() => {
    yearlyPlanReport();
})
</script>

<template>
    <div>
        <div>
            <div class="grid grid-cols-1 lg:grid-cols-3">
                <div class="text-center border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer w-96 h-20">
                    <p class="text-2xl font-bold">yearly Plan Today</p>
                    <p class="text-2xl text-emerald-600 font-semibold">{{ yearlyPlanToday }}</p>
                </div>
                <div class="text-center border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer w-96 h-20">
                    <p class="text-2xl font-bold">yearly Plan This Month</p>
                    <p class="text-2xl text-emerald-600 font-semibold">{{ yearlyPlanMonth }}</p>
                </div>
                <div class="text-center border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer w-96 h-20">
                    <p class="text-2xl font-bold">yearly Plan This Year</p>
                    <p class="text-2xl text-emerald-600 font-semibold">{{ yearlyPlanYear }}</p>
                </div>
            </div>
        </div>
    </div>

</template>