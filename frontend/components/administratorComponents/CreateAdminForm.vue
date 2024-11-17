<script lang="js" setup>
import axios from 'axios';

const emit = defineEmits(['changeVisibilityCreateAdminModal']);
const runtimeConfig = useRuntimeConfig();

let form = {
    admin_register: '',
    name: '',
    email: '',
    status: 1,
};

let errorMessage = ref('');

const setAdministrator = async () => {
    errorMessage.value = '';
    try{
        if(form.admin_register.length == 0){
            errorMessage.value = "Enter the employee's task life register";
        }else if(form.name.length == 0){
            errorMessage.value = "Enter the employee's name";
        }else if(form.email.length == 0){
            errorMessage.value = "Enter the employee's email";
        }else{
            const response = await axios.post(runtimeConfig.public.BASE_URL + 'administrator/set_administrator', form, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`, 
                }
            });
            console.log(response)
            if(response && response.status == 201){
                form.admin_register = '';
                form.name = '';
                form.email = '';
                emit('changeVisibilityCreateAdminModal');
            }else if(response && response.status !== 201){
                errorMessage.value = response.data.message;
            }
        }
    }catch(error){
        errorMessage.value = error.response.data.message;
        console.log(error);
    }
}

</script>

<template>
    <div>
        <div class="h-8">
            <p class="text-black font-bold text-center text-2xl">Create a Administrator</p>
        </div>

        <div class="w-full mt-10">
            <div class="text-center text-red-600">{{ errorMessage }}</div>
            <form class="w-[100%]">
                <div>
                    <label for="register" class="font-semibold">Task Life Register</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="register" name="register" placeholder="Task Life Register" required v-model="form.admin_register">
                </div>

                <div class="mt-2">
                    <label for="name" class="font-semibold">Name</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="name" name="name" placeholder="administrator name" required v-model="form.name">
                </div>

                <div class="md:mr-2">
                    <label for="email" class="font-semibold">Email</label>
                    <input type="email" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="email" name="email" placeholder="user@email.com" v-model="form.email">
                </div>
            </form>
        </div>        
        <div class="h-10 mt-10">
            <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="setAdministrator">Create Administrator</button>
        </div>
    </div>
</template>