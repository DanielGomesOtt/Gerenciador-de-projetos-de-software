<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);


const runtimeConfig = useRuntimeConfig();
const chartLabelsEn = ['Monthly plan revenue', 'Yearly plan revenue'];
const chartEn = ref(null);



let chartInstance = null;
let chartData = ref([]);


function createChart() {
    
    if (chartInstance) {
        chartInstance.destroy();
    }


    const canvas = chartEn.value;
    const labels = chartLabelsEn;
    const labelTitle =  'Monthly and annual plan revenue (R$)';

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
                'rgba(61, 40, 249, 0.2)',     
            ],
            borderColor: [
                'rgba(55, 243, 39, 1)',   
                'rgba(61, 40, 249, 1)',   
            ],
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const getPaymentsReport = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/payments_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`, 
            }
        });

        if(response){
            let monthlyRevenue = 0.00;
            let yearlyRevenue = 0.00;  
            
            response.data.forEach(payment => {
                if(payment.status == 'monthly'){
                    monthlyRevenue += Number(payment.value);
                }else if(payment.status == 'yearly'){
                    yearlyRevenue += Number(payment.value);
                }
            });


            chartData.value = [Number(monthlyRevenue).toFixed(2), Number(yearlyRevenue).toFixed(2)];
            
            createChart();
        }
    }catch(error){
        console.log(error);
    }
}



onMounted(() => {
    getPaymentsReport();
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