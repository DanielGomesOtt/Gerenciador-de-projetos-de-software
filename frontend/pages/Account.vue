<script setup lang="js">
import NavBar from '~/components/layoutComponents/NavBar.vue';
import UserAvatar from '~/components/accountComponents/UserAvatar.vue';
import FormAccount from '~/components/accountComponents/FormAccount.vue';
let userName = ref('');

const showUserName = () => {
    let storage = JSON.parse(localStorage.getItem('userStorage'));
    userName.value = storage.name;
}

onBeforeMount(() => {
    showUserName();
})

</script>

<template>
    <div class="w-screen h-screen overflow-x-hidden">
        <NavBar />
        <div class="flex flex-col justify-center items-center mt-5">
            <div>
                <div class="flex">
                    <div class="mx-24 text-center">
                        <div class="flex">
                            <UserAvatar class="ml-10"/>
                            <button class="bg-transparent mt-24"><Icon name="mdi:account-box-plus-outline" size="2.4em" color="black" class=" bg-transparent rounded-lg"/></button>
                        </div>
                        <span class="text-slate-800 text-xl font-semibold text-center" id="user-name-account-page">{{ userName }}</span>
                    </div>
                </div>
            </div>
            <div class="w-screen flex justify-center">
                <FormAccount />
            </div>
        </div>
    </div>
</template>
