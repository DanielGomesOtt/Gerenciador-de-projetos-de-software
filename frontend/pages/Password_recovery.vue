<script lang="js" setup>
    let errorMessage = ref();
</script>

<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center">
        <h2 class="text-indigo-800 font-bold text-3xl md:text-4xl lg:text-4xl text-center">Reset your password</h2>
        <div class="mt-5 text-red-600">{{ errorMessage }}</div>
        <div class="w-full">
            <form>
                <div>
                    <input type="text" class="w-4/5 md:w-full lg:w-full h-14 rounded-lg mt-10 p-2 border-2 border-gray-200 shadow bg-gray-200 placeholder:text-zinc-600" placeholder="Your Email" name="email" id="user-email">
                </div>
            </form>
        </div>
        <div class="mt-10 w-full">
            <button class="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg border-2 w-4/5 md:w-full lg:w-full h-12 text-white font-semibold mb-5" type="submit">Send</button>
        </div>
    </div>
</template>