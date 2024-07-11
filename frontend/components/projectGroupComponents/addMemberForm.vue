<script lang="js" setup>
import axios from 'axios';
import {isValidEmail} from '~/utils/verifyValidEmail'

let newMember = { 'email': '' };
let addMemberErrorMessage = ref('');

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const emit = defineEmits(['changeVisibilityModalAddMember']);

const sendInvite = async () => {
    try{
        if(isValidEmail(String(newMember.email).toLowerCase())){
            let data = {
                'email': newMember.email,
                'id_project': route.params.id_project
            };

            const response = await axios.post(runtimeConfig.public.BASE_URL + 'project_group/send_invite', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).id}`,
                }
            });

            if(response.status == 201){
                addMemberErrorMessage.value = '';
                newMember.email = '';
                emit('changeVisibilityModalAddMember');
            }else{
                addMemberErrorMessage.value = response.data.message;
                newMember.email = '';
            }
        }else{
            addMemberErrorMessage.value = 'Enter a valid email.';
        }
    }catch(error){
        console.log(error);
    }
}

</script>

<template>
    <div class="h-8">
        <p class="text-black font-bold text-center text-2xl">Add a new member</p>
    </div>

    <div class="w-full mt-10">
        <div class="text-center text-red-500">{{ addMemberErrorMessage }}</div>
        <form class="w-[100%]">
            <div>
                <label for="new-member-email" class="font-semibold">E-mail</label>
                <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="new-member-email" name="new-member-email" placeholder="new_member@email.com" required v-model="newMember.email">
            </div>
        </form>
    </div>        
    <div class="h-10 mt-10">
        <button type="button" class="h-full rounded w-[100%] text-white bg-emerald-600" @click="sendInvite">Send invite</button>
    </div>
</template>