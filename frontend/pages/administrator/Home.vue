<script setup lang="js">
import NavBarAdmin from '~/components/layoutComponents/NavBarAdmin.vue';
import UsersReport from '~/components/administratorComponents/UsersReport.vue';
import PaymentsReport from '~/components/administratorComponents/PaymentsReport.vue';
import ProjectsReport from '~/components/administratorComponents/ProjectsReport.vue';
import TasksReport from '~/components/administratorComponents/TasksReport.vue';
import MonthlyPlanReport from '~/components/administratorComponents/MonthlyPlanReport.vue';
import YearlyPlanReport from '~/components/administratorComponents/YearlyPlanReport.vue';

</script>

<template>
    <div class="overflow-x-hidden">
        <NavBarAdmin />
        <div class="w-screen mt-10 pb-5">
            <div class="w-full flex justify-center">
                <MonthlyPlanReport />
            </div>
            <div class="w-full flex justify-center mt-5">
                <YearlyPlanReport />
            </div>
            <div class="flex justify-center mt-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <UsersReport />
                    </div>
                    <div>
                        <PaymentsReport />
                    </div>
                    <div>
                        <ProjectsReport />
                    </div>
                    <div>
                        <TasksReport />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>