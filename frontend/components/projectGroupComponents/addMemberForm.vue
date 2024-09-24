<script lang="js" setup>
import axios from 'axios';
import {isValidEmail} from '~/utils/verifyValidEmail'

let newMember = { 'email': '', 'administrator_invite': '' };
let addMemberErrorMessage = ref('');

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const props = defineProps({
    visibleLanguage: String,
});

const emit = defineEmits(['changeVisibilityModalAddMember']);

const sendInvite = async (event) => {
    event.preventDefault();
    try{
        if(isValidEmail(String(newMember.email).toLowerCase())){
            let data = {
                'email': newMember.email,
                'id_project': route.params.id_project,
                'administrator_invite': newMember.administrator_invite
            };

            const response = await axios.post(runtimeConfig.public.BASE_URL + 'project_group/send_invite', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
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
        addMemberErrorMessage.value = error.response.data.message;
        console.log(error);
    }
}

</script>

<template>
    <div v-if="props.visibleLanguage == 'en'">
        <div class="h-8">
            <p class="text-black font-bold text-center text-2xl">Add a new member</p>
        </div>

        <div class="w-full mt-10">
            <div class="text-center text-red-500">{{ addMemberErrorMessage }}</div>
            <form class="w-[100%]" :onsubmit="($event) => sendInvite($event)">
                <div>
                    <label for="new-member-email" class="font-semibold">E-mail</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="new-member-email" name="new-member-email" placeholder="new_member@email.com" required v-model="newMember.email">
                </div>
                <div class="mt-2">
                    <label for="new-member-administrator" class="font-semibold">Permission</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="new-member-administrator" name="new-member-administrator" required v-model="newMember.administrator_invite">
                        <option value="" selected disabled>Select the permission</option>
                        <option value="true">Administrator</option>
                        <option value="false">Group Member</option>
                    </select>
                </div>
                <div class="h-10 mt-10">
                    <button type="submit" class="h-full rounded w-[100%] text-white bg-emerald-600" >Send invite</button>
                </div>
            </form>
        </div> 
    </div>
    <div v-if="props.visibleLanguage == 'pt-br'">
        <div class="h-8">
            <p class="text-black font-bold text-center text-2xl">Adicionar novo membro</p>
        </div>

        <div class="w-full mt-10">
            <div class="text-center text-red-500">{{ addMemberErrorMessage }}</div>
            <form class="w-[100%]" :onsubmit="($event) => sendInvite($event)">
                <div>
                    <label for="new-member-email" class="font-semibold">E-mail</label>
                    <input type="text" class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="new-member-email" name="new-member-email" placeholder="novo_membro@email.com" required v-model="newMember.email">
                </div>
                <div class="mt-2">
                    <label for="new-member-administrator" class="font-semibold">Permissão</label>
                    <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="new-member-administrator" name="new-member-administrator" required v-model="newMember.administrator_invite">
                        <option value="" selected disabled>Selecione a permissão</option>
                        <option value="true">Administrador</option>
                        <option value="false">Membro do grupo</option>
                    </select>
                </div>
                <div class="h-10 mt-10">
                    <button type="submit" class="h-full rounded w-[100%] text-white bg-emerald-600" >Enviar Convite</button>
                </div>
            </form>
        </div> 
    </div>
       
</template>