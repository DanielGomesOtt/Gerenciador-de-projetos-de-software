<script setup lang="js">
import { errorMessages } from 'vue/compiler-sfc';
import NavBar from '~/components/layoutComponents/NavBar.vue';
import axios from 'axios';
import AccountCard from '~/components/homeComponents/AccountCard.vue';
import ProjectCard from '~/components/homeComponents/ProjectCard.vue';
import PricesCard from '~/components/homeComponents/PricesCard.vue';
import ReportCard from '~/components/homeComponents/ReportCard.vue';

const runtimeConfig = useRuntimeConfig();



let visibleLanguage = ref(localStorage.getItem('language'));
let visibilitySupportModal = ref(false);
let visibilityHelpModal = ref(false);
let errorMessage = ref('');
let successMessage = ref('');
let formData = {
    'email': JSON.parse(localStorage.getItem('userStorage')).email,
    'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
    'subject': '',
    'description': '',
}

const itemsEn = [
  {
    component: AccountCard,
    props: { visibleLanguage: 'en' }
  },
  {
    component: ProjectCard,
    props: { visibleLanguage: 'en' }
  },
  {
    component: PricesCard,
    props: { visibleLanguage: 'en' }
  },
  {
    component: ReportCard,
    props: { visibleLanguage: 'en' }
  }
]

const itemsPtBr = [
  {
    component: AccountCard,
    props: { visibleLanguage: 'pt-br' }
  },
  {
    component: ProjectCard,
    props: { visibleLanguage: 'pt-br' }
  },
  {
    component: PricesCard,
    props: { visibleLanguage: 'pt-br' }
  },
  {
    component: ReportCard,
    props: { visibleLanguage: 'pt-br' }
  }
]

const changeVisibilityHelpModal = () => {
    visibilityHelpModal.value = !visibilityHelpModal.value;
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

const uploadAvatarPath = async () => {
    try {
        let formData = new FormData();
        formData.append('id', idUser.value);
        formData.append('avatar_path', document.getElementById('upload-avatar-input').files[0]);

        const response = await axios.post(runtimeConfig.public.BASE_URL + 'account/upload_avatar', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        isOpen.value = false;

        if(response.status == 200){
            avatarPath.value = runtimeConfig.public.BASE_URL + response.data;
            window.location.reload();
        }
    } catch(error) {
        console.error(error);
    }
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

            let form = new FormData();
            form.append('email', formData.email);
            form.append('id_user', formData.id_user);
            form.append('subject', formData.subject);
            form.append('description', formData.description);
            form.append('image', document.getElementById('upload-image-support').files[0]);
            const response = await axios.post(runtimeConfig.public.BASE_URL + 'send_support_email', form, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
                    'Content-Type': 'multipart/form-data',
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
                };
                document.getElementById('upload-image-support').value = '';
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
    <NavBar @changeLanguageParent="changeLanguage" @changeVisibilityHelpModal="changeVisibilityHelpModal"/>

    <div class="flex justify-center mt-10" v-if="visibleLanguage == 'en'">
        <p class="text-lg md:font-semibold text-slate-400">Contact us if you need any support from our team: <button class="p-1 md:p-2 bg-blue-600 text-white rounded-lg" @click="changeVisibilitySupportModal">Contact us</button></p>
    </div>

    <div class="flex justify-center mt-10" v-if="visibleLanguage == 'pt-br'">
        <p class="text-lg md:font-semibold text-slate-400">Entre em contato caso precise de algum suporte da nossa equipe: <button class="p-1 md:p-2 bg-blue-600 text-white rounded-lg" @click="changeVisibilitySupportModal">Entrar em contato</button></p>
    </div>

    <div class="flex flex-wrap justify-center mt-2" v-if="visibleLanguage == 'en'">
        <UCarousel v-slot="{ item }" :items="itemsEn" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden w-[1000px] h-[550px]" arrows="">
            <component :is="item.component" v-bind="item.props" :key="item.props.visibleLanguage"/>
        </UCarousel>
    </div>

    <div class="flex flex-wrap justify-center mt-2" v-if="visibleLanguage == 'pt-br'">
        <UCarousel v-slot="{ item }" :items="itemsPtBr" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden w-[1000px] h-[550px]" arrows="">
            <component :is="item.component" v-bind="item.props" :key="item.props.visibleLanguage"/>
        </UCarousel>
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
                    <div class="mt-5">
                        <label for="upload-image-support" class="font-semibold">Enviar Imagem</label>
                        <input class="w-full rounded mt-2 p-2 bg-slate-200 shadow" type="file" id="upload-image-support" name="upload-image-support">
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
                    <div class="mt-5">
                        <label for="upload-image-support" class="font-semibold">Upload Image</label>
                        <input class="w-full rounded mt-2 p-2 bg-slate-200 shadow" type="file" id="upload-image-support" name="upload-image-support">
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
    <UModal v-model="visibilityHelpModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">Page Guide</p>
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Manual da Página</p>
            <template #footer>
                <div v-if="visibleLanguage == 'en'">
                    <p class="text-justify">In the navigation bar, we have the pages that we can navigate to by clicking on them.</p>
                    <p class="text-justify">We also have the project invitations button, which we can click to view received invitations and accept or decline them.</p>
                    <p class="text-justify">Next, we have the page language button, where we can choose the page's language. The options currently available are English and Portuguese.</p>
                    <p class="text-justify">The light bulb icon is used to open the page manual.</p>
                    <p class="text-justify">The icon representing a person, when clicked, redirects the user to their account page.</p>
                    <p class="text-justify">And the last button on the navigation bar is the log out button.</p>
                    <img src="../assets/img/navbar.png" alt="navigation bar" class=" mx-auto my-5 border-2">
                    <p class="text-justify">By clicking the contact us button, simply fill out the form and click send. Support will continue via email.</p>
                    <img src="../assets/img/formulario_suporte.png" alt="support form" class="w-64 mx-auto my-5 border-2">
                </div>
                <div v-if="visibleLanguage == 'pt-br'">
                    <p class="text-justify">Na barra de navegação temos as páginas em que podemos navegar clicando nelas.</p>
                    <p class="text-justify">Também temos o botão de convites de projetos, que podemos clicar, ver os convites recebidos e aceitar ou recusar esses convites.</p>
                    <p class="text-justify">Em seguida temos o botão de linguagem da página, onde podemos escolher a linguagem da página. As opções disponíveis no momento são inglês e português.</p>
                    <p class="text-justify">O ícone de lâmpada serve para abrir o Manual da página.</p>
                    <p class="text-justify">O ícone que representa uma pessoa, ao ser clicado, redireciona o usuário para a página da sua conta.</p>
                    <p class="text-justify">E o último botão da barra de navegação é o botão para realizar o log out.</p>
                    <img src="../assets/img/navbar.png" alt="barra de navegação" class="mx-auto my-5 border-2">
                    <p class="text-justify">Ao clicar no botão de entrar em contato, basta preencher o formulário e clicar em enviar. O atendimento continuará via e-mail</p>
                    <img src="../assets/img/formulario_suporte.png" alt="formulario de suporte" class="w-64 mx-auto my-5 border-2">
                </div>
            </template>
        </UCard>
    </UModal>
</template>
