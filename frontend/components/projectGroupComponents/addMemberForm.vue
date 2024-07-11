<script lang="js" setup>

let newMember = {
    'email': ''
}

const sendInvite = async () => {
    try{
        
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