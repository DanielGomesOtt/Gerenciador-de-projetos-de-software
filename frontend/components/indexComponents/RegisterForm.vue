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
        let validate = validateForm();
        if(validate !== true){
            errorMessage.value = validate;
            return;
        }
        let { data } = await axios.post(runtimeConfig.public.BASE_URL, form);
        if(data.user && data.token){
            let storage = {
                'id': data.user.id,
                'id_category': data.user.id_category,
                'id_group': data.user.id_group,
                'name': data.user.name,
                'email': data.user.email,
                'token': data.token,
                'type_premium': null,
                'premium_user': 0,
                'end_plan_premium': null, 
            };
            localStorage.setItem('userStorage', JSON.stringify(storage));
            navigateTo('/home');
        }else{
            errorMessage.value = data.message
        }
    }catch(error){
        errorMessage.value = error;
    }
}

function validateForm(){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(form.email == null || form.email.length == 0){
        return 'The email field is required';
    }else if(form.name == null || form.name.length == 0){
        return 'The name field is required';
    }else if(form.password == null || form.password.length == 0){
        return 'The password field is required';
    }

    if(!emailPattern.test(String(form.email).toLowerCase())){
        return 'The provided email is invalid';
    }

    if(form.password.length < 8){
        return 'The password must be 8 characters or longer';
    }
    
    if(!/[0-9]/.test(form.password) || !/[a-zA-Z]/.test(form.password)){
        return 'The password must contain letters and numbers';
    }

    return true;
}

</script>

<template>
    <div class="grid pt-10 grid-cols-1 w-full md:flex md:flex-1 md:justify-center md:items-center lg:flex lg:flex-1 lg:justify-center lg:items-center">
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