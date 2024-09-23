<script lang="js" setup>
import NavBar from '~/components/layoutComponents/NavBar.vue';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();
let visibleLanguage = ref(localStorage.getItem('language'));

const setPlanToUser = async() => {
    try{
        let data = {
            'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
        };

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'confirm_payment', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
            }
        });
        
        if(response.status == 201){
            let storage = {
                'id': JSON.parse(localStorage.getItem('userStorage')).id,
                'id_category': JSON.parse(localStorage.getItem('userStorage')).id_category,
                'id_group': JSON.parse(localStorage.getItem('userStorage')).id_group,
                'name': JSON.parse(localStorage.getItem('userStorage')).name,
                'email': JSON.parse(localStorage.getItem('userStorage')).email,
                'token': JSON.parse(localStorage.getItem('userStorage')).token,
                'type_premium': response.data.type_premium,
                'premium_user': response.data.premium_user,
                'end_plan_premium': response.data.end_plan_premium, 
            };

            localStorage.setItem('userStorage', JSON.stringify(storage));
        }
    }catch(error){
        console.log(error);
    }
}

onMounted(() => {
    if(JSON.parse(localStorage.getItem('userStorage')).premium_user !== 1){
        setPlanToUser();
    }

    setTimeout(() => {
        navigateTo('/');
    }, 3000);
});
</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center">
        <div class="text-center w-full">
            <Icon name="mdi:check-underline-circle-outline" class="text-green-500" size="5em"/>
            <h1 class="text-5xl font-bold" v-if="visibleLanguage == 'en'">Successful Payment</h1>
            <h1 class="text-5xl font-bold" v-if="visibleLanguage == 'pt-br'">Pagamento bem-sucedido</h1>
        </div>
    </div>
</template>