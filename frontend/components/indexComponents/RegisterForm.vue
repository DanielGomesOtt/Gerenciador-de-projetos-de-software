<script lang="js" setup>
import axios from 'axios';

let form = {
    'name': "",
    'email': "",
    'password': "",
    'id_group': 0,
    'id_category': 1,
    'status': 1,
}

let errorMessage = ref()

const runtimeConfig = useRuntimeConfig();

const submit = async (event) => {
    try{
        event.preventDefault();
        let { data } = await axios.post(runtimeConfig.public.BASE_URL, form);
        if(data.user && data.token){
            let storage = {
                'id': data.user.id,
                'id_category': data.user.id_category,
                'id_group': data.user.id_group,
                'token': data.token 
            };
            localStorage.setItem('userStorage', JSON.stringify(storage));
            navigateTo('/home');
        }else{
            errorMessage.value = data.message
        }
    }catch(error){
        errorMessage.value = error.response.data.message;
    }
}
</script>

<template>
    <div class="grid grid-cols-1 w-full md:flex md:flex-1 md:justify-center md:items-center lg:flex lg:flex-1 lg:justify-center lg:items-center md:rounded-l-3xl lg:rounded-l-3xl">
        <div>
            <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">Create your account</h2>
            <p class="text-gray-500 font-lg text-lg md:text-xl lg:text-xl text-center mt-5">Create an account and enjoy</p>
            <div class="flex justify-center mt-5 text-red-600">{{ errorMessage }}</div>
            <div>
                <form @submit="submit($event)">
                    <div class="flex justify-center">
                        <input type="text" class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-10 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your Name" name="name" id="register-name" v-model="form.name">
                    </div>
                    <div class="flex justify-center">
                        <input type="email" class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your E-mail" name="email" id="register-email" v-model="form.email">
                    </div>
                    <div class="flex justify-center">
                        <input type="password" class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your Password" name="password" id="register-password" v-model="form.password">
                    </div>
                    <div class="flex justify-center">
                        <select class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-5 p-2 border-2 border-gray-200 shadow bg-gray-200"  name="category" id="register-category" v-model="form.id_category">
                            <option value="1">Personal Account</option>
                            <option value="2">Group Admin</option>
                        </select>    
                    </div>
                    <div class="flex justify-center mt-10">
                        <button class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-full lg:w-full h-12 text-white font-semibold mb-5" type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>