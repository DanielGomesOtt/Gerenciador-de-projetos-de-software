<script lang="js" setup>
import axios from 'axios';
import NewPasswordForm from './NewPasswordForm.vue';

    const runtimeConfig = useRuntimeConfig();
    
    let resetCodeFormVisibility = ref(true);
    let errorMessage = ref();
    let form = {
        'reset_code': '',
    };

    const verifyResetCode = async (event) => {
        event.preventDefault();
        try{
            let response = await axios.post(runtimeConfig.public.BASE_URL + 'password_recovery', form);
            if(response.status == 200 && response.data){
                resetCodeFormVisibility.value = false;
            }
        }catch(error){
            if(error.response.status == 404){
                errorMessage.value = error.response.data.message;
            }else{
                errorMessage.value = error.response.data.message;
            }
        }
    }
</script>

<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center" v-if="resetCodeFormVisibility">
        <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">Reset Code</h2>
        <p class="text-gray-500 font-lg text-lg md:text-xl lg:text-xl text-center mt-5">Insert the code sent to your email. The code will expire in 10 minutes.</p>
        <div class="mt-5 text-red-600">{{ errorMessage }}</div>
        <form class="flex flex-col w-full" @submit="verifyResetCode($event)">
            <input type="text" class="w-4/5 md:w-2/6 h-14 rounded-lg mt-7 mb-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600 mx-auto" placeholder="******" name="reset_code" id="user-reset-code" v-model="form.reset_code" autofocus autocomplete="off">
            <button type="submit" class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-2/6 h-12 text-white font-semibold mb-5 mx-auto">Send</button>
        </form>
    </div>
    <NewPasswordForm v-else/>
</template>