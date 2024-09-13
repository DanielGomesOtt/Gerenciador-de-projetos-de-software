<script lang="js">

let currentPlan = ref(JSON.parse(localStorage.getItem('userStorage')).type_premium);

</script>

<template>
    <h3>Your current plan is {{ currentPlan }}</h3>
</template>