<script lang="js" setup>
import {isValidEmail} from '~/utils/verifyValidEmail'
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();
const isOpen = ref(false);
const isOpenModalDisableAccount = ref(false);

let passwordConfirmIsVisible = ref(false);
let form = {
    'name': '',
    'email': '',
    'password': '',
};
let submitMessage = ref('');


const changeFormFieldsVisibility = () => {
    if(passwordConfirmIsVisible.value == true && document.getElementById('user-password-account') && document.getElementById('user-password-confirm-account')){
        document.getElementById('user-password-confirm-account').value = '';
        document.getElementById('user-password-account').value = '';
    }
    passwordConfirmIsVisible.value = !passwordConfirmIsVisible.value;
    if(passwordConfirmIsVisible.value == false && document.getElementById('user-name-account') && document.getElementById('user-email-account')){
        document.getElementById('user-name-account').value = form.name;
        document.getElementById('user-email-account').value = form.email;
    }
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
            form.name = response.data.name;
            form.email = response.data.email;
        }else if(response.status == 401){
            localStorage.removeItem('userStorage');
            navigateTo('/');
        }
    }catch(error){
        console.error(error);
    }
}

const submitAccountForm = async (event) => {
    try{
        event.preventDefault();
        isOpen.value = false;
        let formSubmit = {};
        if(form.email && form.email.length > 0 && isValidEmail(String(form.email).toLowerCase())){
            formSubmit.email = form.email;
        }else if(form.email && form.email.length > 0 && !isValidEmail(String(form.email).toLowerCase())){
            submitMessage.value = "The provided email is invalid";
            return false;
        }

        if(form.password && form.password.length > 0 && form.password.length >= 8 && /[0-9]/.test(form.password) && /[a-zA-Z]/.test(form.password)){
            if(document.getElementById('user-password-account').value == document.getElementById('user-password-confirm-account').value){
                formSubmit.password = form.password;
            }else{
                submitMessage.value = "The password fields must be filled and have the same values";
                return false;
            }
        }else if(form.password && form.password.length > 0){
            submitMessage.value = 'The password must be 8 characters or longer and contain letters and numbers';
            return false;
        }

        if(form.name && form.name.length > 0){
            formSubmit.name = form.name;
        }

        formSubmit.id = JSON.parse(localStorage.getItem('userStorage')).id;
        const response = await axios.patch(runtimeConfig.public.BASE_URL + 'account', formSubmit, {
            headers: {
                authorization : `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        })
        if(response.status == 200){
            passwordConfirmIsVisible.value = false;
            let userData = JSON.parse(response.config.data);
            document.getElementById('user-name-account').value = userData.name;
            document.getElementById('user-email-account').value = userData.email;
            document.getElementById('user-name-account-page').innerText = userData.name;
            let storage = JSON.parse(localStorage.getItem('userStorage'))
            storage.name = userData.name;
            localStorage.setItem('userStorage', JSON.stringify(storage));
            document.getElementById('submit-message').innerText = '';
        }else if(response.status == 401){
            localStorage.removeItem('userStorage');
            navigateTo('/');
        }
    }catch(error){
        console.error(error);
    }
}

const disableAccount = async (event) => {
    try{
        let id = JSON.parse(localStorage.getItem('userStorage')).id;

        const response = await axios.patch(runtimeConfig.public.BASE_URL + 'account/disable_account', {'id': id}, {
            headers : {
                authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
            }
        })

        if(response){
            localStorage.removeItem('userStorage');
            navigateTo('/');
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
        <div class="w-full text-center">
            <span class="text-red-600" id="submit-message">{{ submitMessage }}</span>
        </div>
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
                    <button type="button" class="text-green-600 rounded-md border-2 border-green-600 p-1 hover:text-white hover:bg-green-600 shadow-md w-full mb-3" @click="isOpen = true">Save Changes</button>
                    <button type="button" class="text-blue-600 rounded-md border-2 border-blue-600 p-1 hover:text-white hover:bg-blue-600 shadow-md w-full mb-3" @click="changeFormFieldsVisibility()" v-if="!passwordConfirmIsVisible">Change password</button>
                    <button type="button" class="text-red-600 rounded-md border-2 border-red-600 p-1 hover:text-white hover:bg-red-600 shadow-md w-full mb-3" @click="changeFormFieldsVisibility()" v-if="passwordConfirmIsVisible">Cancel password change</button>
                    <button type="button" class="text-red-600 rounded-md border-2 border-red-600 p-1 hover:text-white hover:bg-red-600 shadow-md w-full" v-if="!passwordConfirmIsVisible" @click="isOpenModalDisableAccount = true">Inactivate your account</button>
                </div>
            </div>
        </form>
    </div>

    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

            <p class="text-center text-2xl font-semibold">Confirm to save the changes</p>

            <template #footer>
                <div class="flex justify-around items-center">
                    <button class="bg-green-600 text-white rounded-md w-28 h-10" @click="submitAccountForm($event)">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="isOpen = false">Cancel</button>
                </div>
            </template>
        </UCard>
    </UModal>
    
    <UModal v-model="isOpenModalDisableAccount">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

            <p class="text-center text-2xl font-semibold">Are you sure? This action is irreversible.</p>

            <template #footer>
                <div class="flex justify-around items-center">
                    <button class="bg-green-600 text-white rounded-md w-28 h-10" @click="disableAccount($event)">Confirm</button>
                    <button type="button" class="bg-red-600 text-white rounded-md ml-10 w-28 h-10" @click="isOpenModalDisableAccount = false">Cancel</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>