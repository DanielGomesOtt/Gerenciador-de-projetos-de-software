<script lang="js" setup>
import axios from 'axios';
import CodeResetForm from '../components/passwordRecoveryComponents/CodeResetForm.vue'
import { isValidEmail } from '../utils/verifyValidEmail';


    const runtimeConfig = useRuntimeConfig();
    
    let errorMessage = ref();
    let emailForm = ref(true);
    let codeForm = ref(false);
    let form = {
        'email': '',
    };

    const sendResetCode = async (event) => {
       event.preventDefault();
       try{
            if(isValidEmail(form.email)){
                let response = await axios.get(runtimeConfig.public.BASE_URL + 'password_recovery', {headers: form});
                if(response.data && response.status == 200){
                    emailForm.value = false;
                    codeForm.value = true;
                    localStorage.setItem('email', form.email);
                } 
            }else{
                errorMessage.value = 'This email is invalid!';
            }  
       }catch(error){
            errorMessage.value = error.response.data.message;
       }
    }
</script>

<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center" v-if="emailForm">
        <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">Reset your password</h2>
        <p class="text-gray-500 font-lg text-lg md:text-xl lg:text-xl text-center mt-5">Enter the email of your account</p>
        <div class="mt-5 text-red-600">{{ errorMessage }}</div>
        <form class="flex flex-col w-full" @submit="sendResetCode($event)">
            <input type="text" class="w-4/5 md:w-2/6 h-14 rounded-lg mt-7 mb-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600 mx-auto" placeholder="example@email.com" name="email" id="user-email" v-model="form.email" autofocus autocomplete="off">
            <button class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-2/6 h-12 text-white font-semibold mb-5 mx-auto" type="submit">Send</button>
        </form>
    </div>
    <CodeResetForm v-if="codeForm" />
</template>