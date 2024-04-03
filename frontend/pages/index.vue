<script setup lang="js">
import { ref } from 'vue';
import LoginForm from '~/components/indexComponents/LoginForm.vue';
import RegisterForm from '~/components/indexComponents/RegisterForm.vue';

let visible = ref(false);

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

</script>

<template>
    <div class=" grid grid-cols-1 md:flex lg:flex w-full h-full md:h-screen">
        <LoginForm v-if="visible" />
        <div class="grid grid-cols-1 w-full pt-10 md:flex md:justify-center md:items-center md:w-3/6 lg:flex lg:justify-center lg:items-center lg:w-4/ h-72 md:h-screen lg:h-screen shadow-lg bg-gradient-to-r from-blue-800 to-indigo-800" id="apresentation-container">
            <div>
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
        </div>
        <RegisterForm v-if="!visible" />
    </div>
</template>

