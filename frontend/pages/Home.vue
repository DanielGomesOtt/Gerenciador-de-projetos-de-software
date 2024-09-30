<script setup lang="js">
import { errorMessages } from 'vue/compiler-sfc';
import NavBar from '~/components/layoutComponents/NavBar.vue';
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

let visibleLanguage = ref(localStorage.getItem('language'));
let visibilitySupportModal = ref(false);
let errorMessage = ref('');
let successMessage = ref('');
let formData = {
    'email': JSON.parse(localStorage.getItem('userStorage')).email,
    'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
    'subject': '',
    'description': '',
}

const changeVisibilitySupportModal = () => {
    errorMessage.value = '';
    successMessage.value = '';
    formData = {
        'email': JSON.parse(localStorage.getItem('userStorage')).email,
        'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
        'subject': '',
        'description': '',
    }
    visibilitySupportModal.value = !visibilitySupportModal.value;
}

const changeLanguage = () => {
    visibleLanguage.value = localStorage.getItem('language');
}

const sendSupportEmail = async () => {
    try{
        errorMessage.value = '';
        successMessage.value = '';
        if(formData.subject.length == 0){
            if(visibleLanguage.value == 'en'){
                errorMessage.value = 'You need to select a subject';
            }else{
                errorMessage.value = 'Você precisa selecionar um assunto';
            }

        
        }else if(formData.description.length == 0){
            if(visibleLanguage.value == 'en'){
                errorMessage.value = 'You need to provide a description';
            }else{
                errorMessage.value = 'Você precisa fornecer uma descrição';
            }    
        }else{
            const response = await axios.post(runtimeConfig.public.BASE_URL + 'send_support_email', formData, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                }
            });

            if(response && response.status == 200){
                if(visibleLanguage.value == 'en'){
                    successMessage.value = 'The email was sent successfully';
                }else{
                    successMessage.value = 'The email was sent successfully';
                }

                formData = {
                    'email': JSON.parse(localStorage.getItem('userStorage')).email,
                    'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
                    'subject': '',
                    'description': '',
                }

                setTimeout(() => {
                    changeVisibilitySupportModal();
                }, 3000);
            }
        }
    }catch(error){
        console.log(error);
    }
}

</script>

<template>
    <NavBar @changeLanguageParent="changeLanguage"/>

    <div class="flex justify-center mt-10" v-if="visibleLanguage == 'en'">
        <p class="text-lg md:font-semibold text-slate-400">Contact us if you need any support from our team: <button class="p-1 md:p-2 bg-blue-600 text-white rounded-lg" @click="changeVisibilitySupportModal">Contact us</button></p>
    </div>

    <div class="flex justify-center mt-10" v-if="visibleLanguage == 'pt-br'">
        <p class="text-lg md:font-semibold text-slate-400">Entre em contato caso precise de algum suporte da nossa equipe: <button class="p-1 md:p-2 bg-blue-600 text-white rounded-lg" @click="changeVisibilitySupportModal">Entrar em contato</button></p>
    </div>

    <div class="flex flex-wrap justify-around mt-10">
        <UCard class="w-96 text-center font-bold hover:shadow-lg hover:cursor-pointer my-5 border-2"
            :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: {background: 'bg-blue-600 text-white rounded-t-lg'} }"
        >
            <template #header>
                <div>
                    <a href="/project" v-if="visibleLanguage == 'en'">Projects</a>
                    <a href="/project" v-if="visibleLanguage == 'pt-br'">Projetos</a>
                </div>
            </template>
            <div class="bg-white text-black p-5 rounded-lg w-full">
                <p class="text-justify" v-if="visibleLanguage == 'pt-br'">A página de projetos, é o lugar aonde você irá criar seus projetos e administrá-los.</p>
                <p class="text-justify mt-2" v-if="visibleLanguage == 'pt-br'">Também será possível entrar nos projetos e gerenciar as tarefas criadas para aquele projeto.</p>
                <p class="text-justify" v-if="visibleLanguage == 'en'">The projects page is where you will create and manage your projects.</p>
                <p class="text-justify mt-2" v-if="visibleLanguage == 'en'">It will also be possible to enter the projects and manage the tasks created for that project.</p>
            </div>
        </UCard>

        <UCard class="w-96 text-center font-bold hover:shadow-lg hover:cursor-pointer my-5 border-2"
            :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: {background: 'bg-blue-600 text-white rounded-t-lg'} }"
        >
            <template #header>
                <div>
                    <a href="/paid_plans" v-if="visibleLanguage == 'en'">Prices</a>
                    <a href="/paid_plans" v-if="visibleLanguage == 'pt-br'">Preços</a>
                </div>
            </template>
            <div class="bg-white text-black p-5 rounded-lg w-full">
                <p class="text-justify" v-if="visibleLanguage == 'pt-br'">A página de preços, é o lugar aonde você poderá conferir os planos e escolher o melhor para você.</p>
                <p class="text-justify mt-2" v-if="visibleLanguage == 'pt-br'">Também será possível verificar seu plano atual e melhorar seu plano mensal.</p>
                <p class="text-justify" v-if="visibleLanguage == 'en'">The pricing page is where you can review the plans and choose the one that suits you best.</p>
                <p class="text-justify mt-2" v-if="visibleLanguage == 'en'">You will also be able to check your current plan and upgrade your monthly plan.</p>
            </div>
        </UCard>

        <UCard class="w-96 text-center font-bold hover:shadow-lg hover:cursor-pointer my-5 border-2"
            :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: {background: 'bg-blue-600 text-white rounded-t-lg'} }"
        >
            <template #header>
                <div>
                    <a href="/account" v-if="visibleLanguage == 'en'">Account</a>
                    <a href="/account" v-if="visibleLanguage == 'pt-br'">Conta</a>
                </div>
            </template>
            <div class="bg-white text-black p-5 rounded-lg w-full">
                <p class="text-justify" v-if="visibleLanguage == 'pt-br'">A página da sua conta, é o lugar aonde você poderá visualizar e editar suas informações.</p>
                <p class="text-justify mt-2" v-if="visibleLanguage == 'pt-br'">Também será possível escolher uma foto de avatar ou inativar sua conta.</p>
                <p class="text-justify" v-if="visibleLanguage == 'en'">The account page is where you can view and edit your information.</p>
                <p class="text-justify mt-2" v-if="visibleLanguage == 'en'">You will also be able to choose an avatar photo or deactivate your account.</p>
            </div>
        </UCard>
    </div>

    <UModal v-model="visibilitySupportModal">
        <UCard>
            <template #header>
                <div class="font-semibold text-center text-3xl" v-if="visibleLanguage == 'pt-br'">
                    Tipo de suporte
                </div>
                <div class="font-semibold text-center text-3xl" v-if="visibleLanguage == 'en'">
                    Type of support.
                </div>
                <div class="text-center" v-if="visibleLanguage == 'pt-br'">
                    <span class="text-slate-400">Iremos entrar em contato pelo e-mail {{ runtimeConfig.public.USER_EMAIL }} para te ajudar.</span>
                </div>
                <div class="text-center" v-if="visibleLanguage == 'en'">
                    <span class="text-slate-400">We will contact you via email at {{ runtimeConfig.public.USER_EMAIL }} to assist you.</span>
                </div>
            </template>

            <div v-if="visibleLanguage == 'pt-br'">
                <form>
                    <div class="text-center text-red-600">
                        {{ errorMessage }}
                    </div>
                    <div class="text-center text-green-600">
                        {{ successMessage }}
                    </div>
                    <div>
                        <label for="topic-support" class="font-semibold">Assunto</label>
                        <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="topic-support" name="topic-support" v-model="formData.subject" required>
                            <option value="">Selecione um assunto</option>
                            <option value="project ownership">Titularidade de projeto</option>
                            <option value="plan">Plano</option>
                            <option value="bug">Bug</option>
                            <option value="account">Conta</option>
                            <option value="project">Projeto</option>
                            <option value="question">Dúvida</option>
                            <option value="task">Task</option>
                            <option value="gemini_integration">Integração com gemini</option>
                            <option value="report">Relatório</option>
                            <option value="translate">Tradução</option>
                        </select>
                    </div>
                    <div class="mt-5">
                        <label for="description-support" class="font-semibold">Descrição</label>
                        <textarea class="w-full rounded mt-2 p-2 bg-slate-200 shadow" name="description-support" id="description-support" placeholder="Forneça o máximo de detalhes sobre a solicitação" v-model="formData.description" required></textarea>
                    </div>
                </form>
            </div>

            <div v-if="visibleLanguage == 'en'">
                <form>
                    <div class="text-center text-red-600">
                        {{ errorMessage }}
                    </div>
                    <div class="text-center text-green-600">
                        {{ successMessage }}
                    </div>
                    <div>
                        <label for="topic-support" class="font-semibold">Subject</label>
                        <select class="w-full h-10 rounded mt-2 p-2 bg-slate-200 shadow" id="topic-support" name="topic-support"  v-model="formData.subject" required>
                            <option value="">Select a subject.</option>
                            <option value="project ownership">Project ownership</option>
                            <option value="plan">Plan</option>
                            <option value="bug">Bug</option>
                            <option value="account">Account</option>
                            <option value="project">Project</option>
                            <option value="question">Question</option>
                            <option value="task">Task</option>
                            <option value="gemini_integration">Integration with gemini</option>
                            <option value="report">Report</option>
                            <option value="translate">Translate</option>
                        </select>
                    </div>
                    <div class="mt-5">
                        <label for="description-support" class="font-semibold">Description</label>
                        <textarea class="w-full rounded mt-2 p-2 bg-slate-200 shadow" name="description-support" id="description-support" placeholder="Provide as many details as possible about the request."  v-model="formData.description" required></textarea>
                    </div>
                </form>
            </div>

            <template #footer>
                <div class="w-full" v-if="visibleLanguage == 'pt-br'">
                    <button class="text-white bg-blue-600 w-full p-2 rounded-lg" @click="sendSupportEmail">Enviar</button>
                </div>
                <div class="w-full" v-if="visibleLanguage == 'en'">
                    <button class="text-white bg-blue-600 w-full p-2 rounded-lg" @click="sendSupportEmail">Send</button>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
