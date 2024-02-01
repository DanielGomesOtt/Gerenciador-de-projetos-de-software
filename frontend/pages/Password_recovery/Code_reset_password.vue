<script lang="js" setup>
    let errorMessage = ref();
</script>

<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center">
        <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">Password recovery code</h2>
        <p class="text-gray-500 font-lg text-lg md:text-xl lg:text-xl text-center mt-5">Enter the code we sent to your email. If you haven't received it, please try again later</p>
        <div class="mt-5 text-red-600">{{ errorMessage }}</div>
        <input type="text" class="w-4/5 md:w-2/6 h-14 rounded-lg mt-7 mb-5 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" name="code" id="password-recovery-code" autofocus>
        <button class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-2/6 h-12 text-white font-semibold mb-5" type="submit">Verify code</button>
    </div>
</template>