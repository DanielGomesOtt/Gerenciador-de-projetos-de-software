<script lang="js" setup>
import axios from 'axios';

const emit = defineEmits(['changeVisibilityTestAccountModal']);
const runtimeConfig = useRuntimeConfig();

let form = {
    id_category: 1,
    premium_user: 0,
    type_premium: '',
    end_plan_premium: '',
    name: JSON.parse(localStorage.getItem('adminStorage')).name,
    email: JSON.parse(localStorage.getItem('adminStorage')).email
};

let errorMessage = ref('');

const setTestAccount = async () => {
    try{
        if(form.type_premium.length > 0){
            form.end_plan_premium = '3000-12-31'
            form.premium_user = 1;
        }

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'administrator/set_test_account', form, {
            headers:{
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminStorage')).token}`,
            }
        })

        if(response && response.status == 201){
            form.id_category = 1;
            form.premium_user = '';
            form.type_premium = '';
            form.end_plan_premium = '';
            errorMessage.value = ''
            emit('changeVisibilityTestAccountModal');
        }else{
            errorMessage.value = response.data.message;
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
            <p class="text-black font-bold text-center text-2xl">Create a Test Account</p>
            <p class="text-slate-500 font-semibold text-center text-sm">The credentials for your test account will be the same as your Task Life administrator account. You can change it within your test account</p>
        </div>

        <div class="w-full mt-10">
            <div class="text-center text-red-600">{{ errorMessage }}</div>
            <form class="w-[100%]">
                <div>
                    <label for="type-account" class="font-semibold">Account Type</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="type-account" name="type-account" required v-model="form.id_category">
                        <option value="1">Personal account</option>
                        <option value="2">Group Administrator</option>
                    </select>
                </div>

                <div class="mt-5">
                    <label for="premium-account" class="font-semibold">Premium Type</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="premium-account" name="premium-account" required v-model="form.type_premium">
                        <option value="">Normal Account</option>
                        <option value="monthly">Monthly Premium Account</option>
                        <option value="yearly">Yearly Premium Account</option>
                    </select>
                </div>
            </form>
        </div>        
        <div class="h-10 mt-10">
            <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="setTestAccount()">Create test account</button>
        </div>
    </div>
</template>

