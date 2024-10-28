<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);


const runtimeConfig = useRuntimeConfig();
const chartLabelsEn = ['active normal users', 'inactive normal users', 'active premium users (monthly plan)', 'inactive premium users (monthly plan)', 'active premium users (yearly plan)', 'inactive premium users (yearly plan)'];
const chartEn = ref(null);



let chartInstance = null;
let chartData = ref([]);
let projectsData = ref([]);

function createChart() {
    
    if (chartInstance) {
        chartInstance.destroy();
    }


    const canvas = chartEn.value;
    const labels = chartLabelsEn;
    const labelTitle =  'Nº of active and inactive users';

    chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: chartData.value,
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: [
                'rgba(55, 243, 39, 0.2)',   
                'rgba(243, 54, 32, 0.2)',
                'rgba(55, 243, 39, 0.2)',   
                'rgba(243, 54, 32, 0.2)',
                'rgba(55, 243, 39, 0.2)',   
                'rgba(243, 54, 32, 0.2)',      
            ],
            borderColor: [
                'rgba(55, 243, 39, 1)',   
                'rgba(243, 54, 32, 1)',
                'rgba(55, 243, 39, 1)',   
                'rgba(243, 54, 32, 1)',
                'rgba(55, 243, 39, 1)',   
                'rgba(243, 54, 32, 1)',    
            ],
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const getUsersReport = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/users_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`, 
            }
        });

        if(response){
            let normalActive = 0;
            let normalInactive = 0;
            let premiumMonthlyActive = 0;
            let premiumMonthlyInactive = 0;
            let premiumYearlyActive = 0;
            let premiumYearlyInactive = 0;   
            
            response.data.forEach(user => {
                if(user.status == 1 && user.premium_user == 0){
                    normalActive++;
                }else if(user.status == 0 && user.premium_user == 0){
                    normalInactive++;
                }else if(user.status == 1 && user.premium_user == 1 && type_premium == 'monthly'){
                    premiumMonthlyActive++;
                }else if(user.status == 0 && user.premium_user == 1 && type_premium == 'monthly'){
                    premiumMonthlyInactive++;
                }else if(user.status == 1 && user.premium_user == 1 && type_premium == 'yearly'){
                    premiumYearlyActive++;
                }else if(user.status == 0 && user.premium_user == 1 && type_premium == 'yearly'){
                    premiumYearlyInactive++;
                }
            });


            chartData.value = [normalActive, normalInactive, premiumMonthlyActive, premiumMonthlyInactive, premiumYearlyActive, premiumYearlyInactive];
            
            createChart();
        }
    }catch(error){
        console.log(error);
    }
}



onMounted(() => {
    getUsersReport();
});

</script>

<template>
    <div>
        <div>
            <div id="container-chart-en" class="w-full md:w-[450px] border-2 rounded-lg border-slate-500 shadow hover:shadow-xl hover:cursor-pointer">
                <canvas ref="chartEn" class="w-full h-64"></canvas>
            </div>
        </div>
    </div>

</template>