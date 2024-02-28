<script lang="js" setup>
import axios from 'axios';

    const runtimeConfig = useRuntimeConfig();
    
    let errorMessage = ref();
    
    let form = {
        'password': '',
        'email': localStorage.getItem('email'),
    };

    let confirmPassword = '';

    const updateUserPassword = async (event) => {
        event.preventDefault();
        try{
            if(confirmPassword !== form.password){
                errorMessage.value = 'The password fields do not match.';
            }else if(form.password.length == 0 || confirmPassword.length == 0){
                errorMessage.value = 'Both fields are required.';
            }else if(form.password.length < 8){
                errorMessage.value = 'The password must have at least 8 characters.';
            }else{
                let response = await axios.patch(runtimeConfig.public.BASE_URL + 'password_recovery', form);
                localStorage.removeItem('email');
                if(response.status == 200){
                    navigateTo('/');
                }
            }
        }catch(error){
            errorMessage.value = error.response.data.message;
        }
    }
</script>

<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center">
        <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">New Password</h2>
        <p class="text-gray-500 font-lg text-lg md:text-xl lg:text-xl text-center mt-5">Enter your new password. It needs to have at least 8 characters.</p>
        <div class="mt-5 text-red-600">{{ errorMessage }}</div>
        <form class="flex flex-col w-full" @submit="updateUserPassword($event)">
            <input type="password" class="w-4/5 md:w-2/6 h-14 rounded-lg mt-7 mb-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600 mx-auto" placeholder="******" name="password" id="user-password" v-model="form.password" autofocus autocomplete="off">
            <input type="password" class="w-4/5 md:w-2/6 h-14 rounded-lg mt-7 mb-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600 mx-auto" placeholder="******" name="confirm-password" id="user-confirm-password" v-model="confirmPassword" autofocus autocomplete="off">
            <button type="submit" class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-2/6 h-12 text-white font-semibold mb-5 mx-auto">Change password</button>
        </form>
    </div>
</template>