<script lang="js" setup>
import axios from 'axios';

let form = {
    'email': "",
    'password': "",
};

let errorRequest = ref();
let errorMessageVisibility = ref(true);

const runtimeConfig = useRuntimeConfig();

const submit = async (event) => {
    event.preventDefault();
    try{
        let { data } = await axios.post(runtimeConfig.public.BASE_URL + 'login', form);
        if(data){
            let storage = {
                'id': data.user.id,
                'id_category': data.user.id_category,
                'id_group': data.user.id_group,
                'name': data.user.name,
                'token': data.token 
            };
            localStorage.setItem('userStorage', JSON.stringify(storage));
            navigateTo('/home');
        }
    }catch(error){
        errorRequest.value = error.response.data.message;
    }
}
</script>

<template>
    <div class="grid grid-cols-1 pt-10 w-full md:flex md:flex-1 md:justify-center md:items-center lg:flex lg:flex-1 lg:justify-center lg:items-center">
        <div>
            <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">Access your account</h2>
            <p class="text-gray-500 font-lg text-lg md:text-xl lg:text-xl text-center mt-5">Log in and enjoy</p>
            <p class="text-red-500 text-center text-lg mt-5" v-if="errorMessageVisibility">{{ errorRequest }}</p>

            <div>
                <form @submit="submit($event)">
                    <div class="flex justify-center">
                        <input type="email" class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your E-mail" name="email" id="login-email" v-model="form.email">
                    </div>
                    <div class="flex justify-center">
                        <input type="password" class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your Password" name="password" id="login-password" v-model="form.password">
                    </div>
                    <div class="flex justify-center mt-10">
                        <button class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-full lg:w-full h-12 text-white font-semibold mb-5">Sign In</button>
                    </div>
                    <div class="flex justify-center mb-5">
                        <button type="submit"><a class="text-blue-800 font-medium hover:underline" href="/password_recovery">Forgot your password?</a></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>