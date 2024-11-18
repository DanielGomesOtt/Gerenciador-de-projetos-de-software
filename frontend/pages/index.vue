<script setup lang="js">
import { ref } from 'vue';
import LoginForm from '~/components/indexComponents/LoginForm.vue';
import RegisterForm from '~/components/indexComponents/RegisterForm.vue';

let visible = ref(false);
let language = ref(false);
let visibleLanguage = ref(localStorage.getItem('language'));
let visibilityHelpModal = ref(false);

const changeVisibilityHelpModal = () => {
    visibilityHelpModal.value = !visibilityHelpModal.value;
}

const changeLanguage = () => {
    language.value = !language.value;
    if(language.value == false){
        localStorage.setItem('language', 'en');
        visibleLanguage.value = 'en';
    }else{
        localStorage.setItem('language', 'pt-br');
        visibleLanguage.value = 'pt-br';
    }
}

const changeScreenSide = () => {
    visible.value = !visible.value;
    if(visible.value == true){
        document.getElementById('apresentation-container').classList.remove('h-72');
        document.getElementById('apresentation-container').classList.add('h-screen');
    }else{
        document.getElementById('apresentation-container').classList.add('h-72');
        document.getElementById('apresentation-container').classList.remove('h-screen');
    }
}

onBeforeMount(() => {
    if(localStorage.getItem('language') && (localStorage.getItem('language') == 'en' || localStorage.getItem('language') == 'pt-br')){
        visibleLanguage.value = localStorage.getItem('language');
        if(visibleLanguage.value == 'en'){
            language.value = false;
        }else if(visibleLanguage.value == 'pt-br'){
            language.value = true;
        }
    }else{
        localStorage.setItem('language', 'en');
        language.value = false
    }
});

</script>

<template>
    <div class=" grid grid-cols-1 md:flex lg:flex w-full h-full md:h-screen">
        <LoginForm v-if="visible" :visibleLanguage="visibleLanguage"/>
        <div class="absolute ml-5 mt-2">
            <div class="flex items-baseline">
                <span class="mr-2 font-bold">en</span>
                <UToggle size="md" v-model="language" @click="changeLanguage"/>
                <span class="ml-2 font-bold">pt-br</span>
            </div>
        </div>
        <div class="absolute mr-5 mt-2 right-1">
            <div class="flex items-baseline">
                <button class="bg-transparent" @click="changeVisibilityHelpModal()"><Icon name="mdi:lightbulb-question" size="2em" color="black"/></button>
            </div>
        </div>
        <div class="grid grid-cols-1 w-full pt-10 md:flex md:justify-center md:items-center md:w-3/6 lg:flex lg:justify-center lg:items-center lg:w-4/ h-72 md:h-screen lg:h-screen shadow-lg bg-gradient-to-r from-blue-800 to-indigo-800" id="apresentation-container">
            <div v-if="visibleLanguage == 'en'">
                <div class="flex justify-center items-end">
                    <h2 class="text-white font-bold text-3xl md:text-5xl lg:text-5xl text-center" v-if="visible">Create your account !</h2>
                    <h2 class="text-white font-bold text-3xl md:text-5xl lg:text-5xl text-center" v-if="!visible">Welcome back !</h2>
                </div>
                <div class="flex justify-center mt-2">
                    <p class="text-white font-lg text-lg md:text-lg lg:text-lg text-center mt-5" v-if="!visible">To keep connected with us<br>please login with your personal info</p>
                    <p class="text-white font-lg text-lg md:text-lg lg:text-lg text-center mt-5" v-if="visible">Register and enjoy our management environment for free.</p>
                </div>
                <div class="flex justify-center md:mt-10 lg:mt-10 mt-5">
                    <button class="bg-transparent rounded border-2 border-white w-48 md:w-56 lg:w-56 h-12 text-white font-semibold active:border-4 shrink" @click="changeScreenSide" v-if="!visible">Sign In</button>
                    <button class="bg-transparent rounded border-2 border-white w-48 md:w-56 lg:w-56 h-12 text-white font-semibold active:border-4 shrink" @click="changeScreenSide" v-if="visible">Sign Up</button>
                </div>
            </div>
            <div v-if="visibleLanguage == 'pt-br'">
                <div class="flex justify-center items-end">
                    <h2 class="text-white font-bold text-3xl md:text-5xl lg:text-5xl text-center" v-if="visible">Crie sua conta !</h2>
                    <h2 class="text-white font-bold text-3xl md:text-5xl lg:text-5xl text-center" v-if="!visible">Bem vindo !</h2>
                </div>
                <div class="flex justify-center mt-2">
                    <p class="text-white font-lg text-lg md:text-lg lg:text-lg text-center mt-5" v-if="!visible">Para se conectar<br>por favor realize o login com suas credenciais</p>
                    <p class="text-white font-lg text-lg md:text-lg lg:text-lg text-center mt-5" v-if="visible">Se registre e aproveite nosso ambiente de forma grátis.</p>
                </div>
                <div class="flex justify-center md:mt-10 lg:mt-10 mt-5">
                    <button class="bg-transparent rounded border-2 border-white w-48 md:w-56 lg:w-56 h-12 text-white font-semibold active:border-4 shrink" @click="changeScreenSide" v-if="!visible">Sign In</button>
                    <button class="bg-transparent rounded border-2 border-white w-48 md:w-56 lg:w-56 h-12 text-white font-semibold active:border-4 shrink" @click="changeScreenSide" v-if="visible">Sign Up</button>
                </div>
            </div>
        </div>
        <RegisterForm v-if="!visible" :visibleLanguage="visibleLanguage"/>
    </div>
    <UModal v-model="visibilityHelpModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'en'">Page Guide</p>
            <p class="text-center text-2xl font-semibold" v-if="visibleLanguage == 'pt-br'">Manual da Página</p>
            <template #footer>
                <div v-if="visibleLanguage == 'en'">
                    <p class="text-justify">To register, fill out the registration form and click Sign Up. After registering, you will be redirected to your account's homepage.</p>
                    <img src="../assets/img/registro.png" alt="Registration form" class="mx-auto my-5 border-2">
                    <p class="text-justify">By clicking Sign In, the login form will be displayed. To log in, simply fill out the login form with your credentials and click Sign In. You will be redirected to your account's homepage.</p>
                    <img src="../assets/img/fazer login.png" alt="Login form" class="mx-auto my-5 border-2">
                    <p class="text-justify">You can also recover your password by clicking on "Forgot Your Password?". Upon clicking, you will be redirected to the password recovery screen. To proceed, provide the email of the account for which you want to recover the password.</p>
                    <img src="../assets/img/recuperar senha.png" alt="Password recovery screen" class="mx-auto my-5 border-2">
                    <p class="text-justify">After providing the email of the account for which you want to recover the password, click Send, and you will be redirected to the reset code page. You will receive a reset code in your email. Take the reset code you received and enter it in the reset code field on the reset code page. After that, click Send.</p>
                    <img src="../assets/img/reset code.png" alt="Reset code screen" class="mx-auto my-5 border-2">
                    <p class="text-justify">After that, you will be redirected to the password change screen. Fill in both password fields with matching passwords and click Change Password.</p>
                    <img src="../assets/img/nova senha.png" alt="New password screen" class="mx-auto my-5 border-2">
                </div>
                <div v-if="visibleLanguage == 'pt-br'">
                    <p class="text-justify">Para se registrar preencha o formulário de cadastro e clique em Sign Up. Após ser cadastrado, você será redirecionado para a home da sua conta.</p>
                    <img src="../assets/img/registro.png" alt="Formulário de cadastro" class="mx-auto my-5 border-2">
                    <p class="text-justify">Ao clicar em Sign In, será exibido o formulário de login. Para realizar o login, basta preencher o formulário de login com suas credenciais e clicar em Sign In. Você será redirecionado para a home da sua conta.</p>
                    <img src="../assets/img/fazer login.png" alt="Formulário de login" class="mx-auto my-5 border-2">
                    <p class="text-justify">Você também pode recuperar sua senha clicando em "Esqueceu sua Senha ?". Ao clicar, você irá ser redirecionado para a tela de recuperação de senha. Para continuar, forneça o email da conta que deseja recuperar sua senha.</p>
                    <img src="../assets/img/recuperar senha.png" alt="Tela de recuperação de senha" class="mx-auto my-5 border-2">
                    <p class="text-justify">Após fornecer o e-mail da conta que deseja recuperar a senha clique em Enviar, vocêserá redirecionado para a página de reset code e receberá em seu e-mail um reset code. Pegue o reset code que recebeu em seu e-mail e o informe no campo de reset code na página de reset code. Após isso clique em Enviar.</p>
                    <img src="../assets/img/reset code.png" alt="Tela de reset code" class="mx-auto my-5 border-2">
                    <p class="text-justify">Após isso, você será redirecionado para a tela de mudança de senha. Preencha os dois campos de senha com senhas iguais e clique em Mudar senha.</p>
                    <img src="../assets/img/nova senha.png" alt="Tela de reset code" class="mx-auto my-5 border-2">
                </div>
            </template>
        </UCard>
    </UModal>
</template>

