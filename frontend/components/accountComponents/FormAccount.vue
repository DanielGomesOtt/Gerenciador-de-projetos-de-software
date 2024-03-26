<script lang="js" setup>
import {isValidEmail} from '~/utils/verifyValidEmail'
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let passwordConfirmIsVisible = ref(false);

let form = {
    'name': '',
    'email': '',
    'password': '',
};

let submitMessage = ref('');


const changeFormFieldsVisibility = () => {
    passwordConfirmIsVisible.value = !passwordConfirmIsVisible.value;
}

const getUserData = async () => {
    try{
        const response = await axios.get(runtimeConfig.public.BASE_URL + 'account', {headers: {
            'user': localStorage.getItem('userStorage'),
            'authorization': `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
        }});

        if(response && response.data){
            document.getElementById('user-name-account').value = response.data.name;
            document.getElementById('user-email-account').value = response.data.email;
        }
    }catch(error){
        console.error(error);
    }
}

onMounted(() => {
    getUserData()
})



</script>

<template>
    <div class="border-2 border-slate-300 shadow p-5 rounded-md h-full w-96 mt-5">
        <span class="w-full text-center text-green-600" id="submit-message">{{ submitMessage }}</span>
        <form>
            <div class="w-full" v-if="!passwordConfirmIsVisible">
                <label for="user-name-account">Name</label>
                <input type="text" name="name" id="user-name-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100 pl-1" v-model="form.name">
            </div>
            <div class="w-full" v-if="!passwordConfirmIsVisible">
                <label for="user-email-account">E-mail</label>
                <input type="email" name="email" id="user-email-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100 pl-1" placeholder="user@email.com" v-model="form.email">
            </div>
            <div class="w-full" v-if="passwordConfirmIsVisible">
                <label for="user-password-account">Password</label>
                <input type="password" name="password" id="user-password-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100 pl-1" v-model="form.password">
            </div>
            <div class="w-full" v-if="passwordConfirmIsVisible">
                <label for="user-password-confirm-account">Confirm Password</label>
                <input type="password" name="password-confirm" id="user-password-confirm-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100 pl-1">
            </div>
            <div class="w-full flex justify-center">
                <div class="w-full">
                    <button type="submit" class="text-green-600 rounded-md border-2 border-green-600 p-1 hover:text-white hover:bg-green-600 shadow-md w-full mb-3">Save Changes</button>
                    <button type="button" class="text-blue-600 rounded-md border-2 border-blue-600 p-1 hover:text-white hover:bg-blue-600 shadow-md w-full mb-3" @click="changeFormFieldsVisibility()" v-if="!passwordConfirmIsVisible">Change password</button>
                    <button type="button" class="text-red-600 rounded-md border-2 border-red-600 p-1 hover:text-white hover:bg-red-600 shadow-md w-full mb-3" @click="changeFormFieldsVisibility()" v-if="passwordConfirmIsVisible">Cancel password change</button>
                    <button type="button" class="text-red-600 rounded-md border-2 border-red-600 p-1 hover:text-white hover:bg-red-600 shadow-md w-full" v-if="!passwordConfirmIsVisible">Inactivate your account</button>
                </div>
            </div>
        </form>
    </div>
</template>