<script setup lang="js">
import { Chart, registerables } from 'chart.js';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';


Chart.register(...registerables);


const runtimeConfig = useRuntimeConfig();
const chartLabelsEn = ['to do', 'in progress', 'cancelled', 'overdue', 'urgent', 'completed'];
const chartEn = ref(null);



let chartInstance = null;
let chartData = ref([]);


function createChart() {
    
    if (chartInstance) {
        chartInstance.destroy();
    }


    const canvas = chartEn.value;
    const labels = chartLabelsEn;
    const labelTitle =  'Nº of tasks by status';

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
                'rgba(0, 0, 255, 0.2)',   
                'rgba(255, 165, 0, 0.2)',  
                'rgba(0, 128, 0, 0.2)',    
                'rgba(255, 0, 0, 0.2)'      
            ],
            borderColor: [
                'rgba(0, 0, 255, 1)',   
                'rgba(255, 165, 0, 1)',  
                'rgba(0, 128, 0, 1)',    
                'rgba(255, 0, 0, 1)'    
            ],
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const getTasksReport = async() => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/tasks_report', {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`, 
            }
        });

        if(response){
            let to_do = 0;
            let in_progress = 0;
            let overdue = 0;
            let completed = 0;
            let cancelled = 0;
            let urgent = 0;

              
            
            response.data.forEach(task => {
                if(task.status == 'in progress'){
                    in_progress++;
                }else if(task.status == 'overdue'){
                    overdue++;
                }else if(task.status == 'completed'){
                    completed++;
                }else if(task.status == 'cancelled'){
                    cancelled++;
                }else if(task.status == 'urgent'){
                    urgent++;
                }else if(task.status == 'to do'){
                    to_do++;
                }
            });


            chartData.value = [to_do, in_progress, cancelled, overdue, urgent, completed];
            
            createChart();
        }
    }catch(error){
        console.log(error);
    }
}



onMounted(() => {
    getTasksReport();
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