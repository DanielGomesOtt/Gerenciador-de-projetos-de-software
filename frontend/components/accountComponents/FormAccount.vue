<script lang="js" setup>

let passwordConfirmIsVisible = ref(false);
</script>

<template>
    <div class="border-2 border-slate-300 shadow p-5 rounded-md h-full w-96 mt-5">
        <form>
            <div class="w-full">
                <label for="user-name-account">Name</label>
                <input type="text" name="name" id="user-name-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100">
            </div>
            <div class="w-full">
                <label for="user-email-account">E-mail</label>
                <input type="email" name="email" id="user-email-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100 pl-1" placeholder="user@email.com">
            </div>
            <div class="w-full" v-if="passwordConfirmIsVisible">
                <label for="user-password-account">Password</label>
                <input type="password" name="password" id="user-password-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100">
            </div>
            <div class="w-full" v-if="passwordConfirmIsVisible">
                <label for="user-password-confirm-account">Confirm Password</label>
                <input type="password" name="password-confirm" id="user-password-confirm-account" class="border-2 border-slate-200 rounded-md w-full h-12 my-4 bg-slate-100">
            </div>
            <div class="w-full flex justify-center">
                <div>
                    <button class="text-green-600 rounded-md border-2 border-green-600 p-1 hover:text-white hover:bg-green-600 shadow-md w-full mb-3">Save Changes</button>
                    <button class="text-blue-600 rounded-md border-2 border-blue-600 p-1 hover:text-white hover:bg-blue-600 shadow-md w-full mb-3">Change password</button>
                    <button class="text-red-600 rounded-md border-2 border-red-600 p-1 hover:text-white hover:bg-red-600 shadow-md w-full">Inactivate your account</button>
                </div>
            </div>
        </form>
    </div>
</template>