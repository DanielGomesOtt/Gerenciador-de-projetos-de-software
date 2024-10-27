<script lang="js" setup>
import axios from 'axios';


const runtimeConfig = useRuntimeConfig();

let form = {
    email: '',
    password: '',
    admin_register: '',
};

let errorMessage = ref('');

const handleLogin = async (event) => {
    event.preventDefault();
    try{
        errorMessage.value = '';
        let { data } = await axios.post(runtimeConfig.public.BASE_URL + 'administrator/login', form);
        if(data){
            let storage = {
                'id': data.administrator.id,
                'admin_register': data.administrator.admin_register,
                'name': data.administrator.name,
                'email': data.administrator.email,
                'token': data.token,
            };
            localStorage.setItem('adminStorage', JSON.stringify(storage));
            navigateTo('/administrator/home');
        }
    }catch(error){
        errorMessage.value = error.response.data.message;
    }
}

</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center">
        <div>
            <h2 class="text-center text-xl md:text-3xl lg:text-4xl font-bold mb-5 text-indigo-800">Task Life Administrator Panel</h2>
            <p class="text-red-600 text-center">{{ errorMessage }}</p>
            
            <form @submit="handleLogin($event)">
                <div class="flex justify-center">
                    <input type="text" class="w-4/5 md:w-96 lg:w-96 h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your Task life admin register" name="admin_register" id="login-admin-register" v-model="form.admin_register">
                </div>
                <div class="flex justify-center">
                    <input type="email" class="w-4/5 md:w-96 lg:w-96 h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your E-mail" name="email" id="login-email" v-model="form.email">
                </div>
                <div class="flex justify-center">
                    <input type="password" class="w-4/5 md:w-96 lg:w-96 h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your Password" name="password" id="login-password" v-model="form.password">
                </div>
                <div class="flex justify-center mt-10">
                    <button type="submit" class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-96 lg:w-96 h-12 text-white font-semibold mb-5">Sign In</button>
                </div>
            </form>
        </div>
    </div>
</template>