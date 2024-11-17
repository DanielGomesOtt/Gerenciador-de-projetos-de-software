<script lang="js" setup>
import axios from 'axios';


const runtimeConfig = useRuntimeConfig();

let visibilityRecoverCredentialsModal = ref(false);

let form = {
    email: '',
    password: '',
    admin_register: '',
};

let formRecover = {
    email: '',
}

let errorMessage = ref('');
let errorMessageRecover = ref('');
let successMessageRecover = ref('');

const changeVisibilityRecoverCredentialsModal = () => {
    visibilityRecoverCredentialsModal.value = !visibilityRecoverCredentialsModal.value;
    formRecover.email = '';
    errorMessageRecover.value = '';
    successMessageRecover.value = '';
}

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

const recoverCredentials = async () => {
    try{
        errorMessageRecover.value = '';
        successMessageRecover.value = '';
        if(formRecover.email.length == 0){
            errorMessageRecover.value = 'Enter your registered email';
        }else{
            const response = await axios.get(runtimeConfig.public.BASE_URL + 'administrator/recover_credentials', {
                headers: {
                    "email": formRecover.email 
                }
            });

            if(response && response.status == 200){
                successMessageRecover.value = response.data.message;
                formRecover.email = '';
            }else if(response && response.status !== 200){
                errorMessageRecover.value = response.data.message;
            }
        }
    }catch(error){
        errorMessageRecover.value = error.response.data.message;
        console.log(error);
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
                <div class="flex justify-center">
                    <button type="button" class="bg-transparent underline underline-offset-4 text-blue-500" @click="() => visibilityRecoverCredentialsModal = true">Recover credentials</button>
                </div>
            </form>
        </div>
    </div>
    <UModal v-model="visibilityRecoverCredentialsModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex justify-end w-full">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1" @click="changeVisibilityRecoverCredentialsModal()" />
            </div>
            <div>
                <div class="h-8">
                    <p class="text-black font-bold text-center text-2xl">Recover Credentials</p>
                    <p class="text-slate-500 font-semibold text-center text-lg">The credentials will be sent to your email</p>
                </div>

                <div class="w-full mt-10">
                    <p class="text-red-600 text-center">{{ errorMessageRecover }}</p>
                    <p class="text-green-600 text-center">{{ successMessageRecover }}</p>
                    <form class="w-[100%]">
                        <div>
                            <label for="email-recover" class="font-semibold">Email</label>
                            <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="email-recover" name="email-recover" placeholder="user@email.com" required v-model="formRecover.email">
                        </div>
                    </form>
                </div>        
                <div class="h-10 mt-10">
                    <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="recoverCredentials()">Recover</button>
                </div>
            </div>
        </UCard>
    </UModal>
</template>