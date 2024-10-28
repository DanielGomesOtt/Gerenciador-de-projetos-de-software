<script setup lang="js">
import NavBarAdmin from '~/components/layoutComponents/NavBarAdmin.vue';
import UsersReport from '~/components/administratorComponents/UsersReport.vue';
import PaymentsReport from '~/components/administratorComponents/PaymentsReport.vue';
import ProjectsReport from '~/components/administratorComponents/ProjectsReport.vue';
</script>

<template>
    <NavBarAdmin />
    <div class="w-screen mt-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <UsersReport />
            </div>
            <div>
                <PaymentsReport />
            </div>
            <div>
                <ProjectsReport />
            </div>
        </div>
    </div>
</template>