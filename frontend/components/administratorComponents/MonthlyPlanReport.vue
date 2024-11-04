<script lang="js" setup>
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let monthlyPlanToday = ref(0.00);
let monthlyPlanMonth = ref(0.00);
let monthlyPlanYear = ref(0.00);

const monthlyPlanReport = async () => {
    try{
        monthlyPlanToday.value = 0.00;
        monthlyPlanMonth.value = 0.00;
        monthlyPlanYear.value = 0.00;

        const response = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/monthly_plan_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`, 
            }
        })

        if(response){
            let today = new Date();
            response.data.forEach(payment => {
                let date = new Date(payment.createdAt);
                if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate()){
                    monthlyPlanToday.value += Number(payment.value);
                }else if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth()){
                    monthlyPlanMonth.value += Number(payment.value);
                }else if(today.getFullYear() == date.getFullYear()){
                    monthlyPlanYear.value += Number(payment.value);
                }
            });
            monthlyPlanToday.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyPlanToday.value);
            monthlyPlanMonth.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyPlanMonth.value);
            monthlyPlanYear.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyPlanYear.value);
        }
    }catch(error){
        console.log(error);
    }
} 

onMounted(() => {
    monthlyPlanReport();
})
</script>

<template>
    <div>
        <div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div class="text-center border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer w-96 h-20">
                    <p class="text-2xl font-bold">Monthly Plan Today</p>
                    <p class="text-2xl text-emerald-600 font-semibold">{{ monthlyPlanToday }}</p>
                </div>
                <div class="text-center border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer w-96 h-20">
                    <p class="text-2xl font-bold">Monthly Plan This Month</p>
                    <p class="text-2xl text-emerald-600 font-semibold">{{ monthlyPlanMonth }}</p>
                </div>
                <div class="text-center border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer w-96 h-20">
                    <p class="text-2xl font-bold">Monthly Plan This Year</p>
                    <p class="text-2xl text-emerald-600 font-semibold">{{ monthlyPlanYear }}</p>
                </div>
            </div>
        </div>
    </div>

</template>