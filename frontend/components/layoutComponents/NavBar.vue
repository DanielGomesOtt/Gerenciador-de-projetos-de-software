<script lang="js" setup>
    import { Icon } from '#components';
    import axios from 'axios';

    const runtimeConfig = useRuntimeConfig();

    let isOpenMobile = ref(false);
    let avatarPath = ref('');
    let id_category = JSON.parse(localStorage.getItem('userStorage')).id_category; 
	let myInvites = ref([]);
    let renewAlert = ref(false);
    let expirationDay = ref(JSON.parse(localStorage.getItem('userStorage')).end_plan_premium);

    const setRenewAlert = () => {
        let endPlanDate = JSON.parse(localStorage.getItem('userStorage')).end_plan_premium.split('T');
        endPlanDate = endPlanDate[0];

        let today = new Date();

        if(JSON.parse(localStorage.getItem('userStorage')).type_premium == 'monthly'){
            today.setDate(today.getDate() + 7);
            if(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate()}` == endPlanDate){
                renewAlert.value = true;
            }
        }else if(JSON.parse(localStorage.getItem('userStorage')).type_premium == 'yearly'){
            today.setDate(today.getDate() + 7);
            if(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate()}` == endPlanDate){
                renewAlert.value = true;
            }
        }
    }

    const openMenuMobile = () => {
        isOpenMobile.value = !isOpenMobile.value;
    }

    const logOut = () => {
        localStorage.removeItem('userStorage');
        navigateTo('/');
    }

    const getAvatarPath = async () => {
        try {
            const response = await axios.get(runtimeConfig.public.BASE_URL + 'account/upload_avatar', {
                headers: {
                    'id': JSON.parse(localStorage.getItem('userStorage')).id,
                }
            });

            if (response.status == 200 && response.data && response.data.length > 0) {
                avatarPath.value = runtimeConfig.public.BASE_URL + response.data.replace('\\', '/');
            } else {
                avatarPath.value = '';
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getProjectInvites = async () => {
        try {
			const response = await axios.get(runtimeConfig.public.BASE_URL + 'project_group/invites', {
				headers: {
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`,
					'id_user': JSON.parse(localStorage.getItem('userStorage')).id
				}
			});

			if(response && response.data){
				myInvites.value = response.data;
			}
        } catch (error) {
            console.log(error);
        }
    }

    const respondInvite = async (id_invite, invite_response, id_project, administrator_invite) => {
        try{
            let data = {
                'id_user': JSON.parse(localStorage.getItem('userStorage')).id,
                'id_invite': id_invite,
                'invite_response': invite_response,
                'id_project': id_project,
                'administrator_invite': administrator_invite
            }

            const response = await axios.patch(runtimeConfig.public.BASE_URL + 'project_group/invites', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userStorage')).token}`
                }
            })

            if(response.status == 200){
                if(invite_response == 'accept'){
                    if(JSON.parse(localStorage.getItem('userStorage')).id_category == 1){
                        let userStorage = JSON.parse(localStorage.getItem('userStorage'));
                        userStorage.id_category = 3;
                        localStorage.setItem('userStorage', JSON.stringify(userStorage));
                    }
                    navigateTo(`/project_group_${id_project}`);
                }else{
                    getProjectInvites();
                }
            }
        }catch(error){
            console.log(error);
        }
    }

    const renewPlan = () => {
        navigateTo('Renew_plans');
    }

    onBeforeMount(() => {
        if(expirationDay.value !== null && expirationDay.value !== undefined){
            expirationDay.value = expirationDay.value.split('T');
        }
		getProjectInvites();
        getAvatarPath();
    });

    onMounted(() => {
        if(JSON.parse(localStorage.getItem('userStorage')).end_plan_premium !== null && JSON.parse(localStorage.getItem('userStorage')).end_plan_premium !== undefined){
            setRenewAlert();
        }
    })


    window.addEventListener('resize', function() {
        if (window.innerWidth > '600') {
            if (isOpenMobile.value == true) {
                isOpenMobile.value = false;
            }
        }
    });

    setInterval(() => {
        getProjectInvites();
    }, 10000);
</script>

<template>
    <nav class="w-screen h-16 flex justify-around items-center" id="nav-bar">
        <div id="nav-brand">
            <button class="bg-blue-800 text-white rounded-md px-4 py-2 text-lg"><a href="/home">Task Life</a></button>
        </div>
        <div id="mobile-project-invites">
            <UPopover>
                <UChip :text="myInvites.length" size="2xl">
                    <UButton icon="i-heroicons-inbox" color="blue" />
                </UChip>
                <template #panel>
                    <div class="max-h-48 overflow-y-auto">
                        <div class="p-2 w-64 text-center" v-for="invite in myInvites">
                            <span class="text-base font-bold p-2">{{ invite.Project.name }}</span>
                            <div class="flex justify-around mt-2">
                                <button class="bg-green-200 w-28 rounded-md font-semibold hover:bg-green-500 hover:text-white" @click="respondInvite(invite.id, 'accept', invite.id_project, invite.administrator_invite)">Accept</button>
                                <button class="bg-red-200 w-28 rounded-md font-semibold hover:bg-red-500 hover:text-white" @click="respondInvite(invite.id, 'reject', invite.id_project, invite.administrator_invite)">Decline</button>
                            </div>
                        </div>
                    </div>
                </template>
            </UPopover>
        </div>
        <ul class="flex justify-around items-center w-[45%]" id="nav-items" v-if="!isOpenMobile">
            <li><a href="/home" class="font-medium text-lg nav-link">Home</a></li>
            <li><a href="/project" class="font-medium text-lg nav-link">Projects</a></li>
            <li><a href="/paid_plans" class="font-medium text-lg nav-lik">Prices</a></li>
            <li>
                <UPopover>
                    <UChip :text="myInvites.length" size="2xl">
                        <UButton label="Project Invites" color="gray" />
                    </UChip>
                    <template #panel>
                        <div class="max-h-48 overflow-y-auto">
                            <div class="p-2 w-64 text-center" v-for="invite in myInvites">
                                <span class="text-base font-bold p-2">{{ invite.Project.name }}</span>
                                <div class="flex justify-around mt-2">
                                    <button class="bg-green-200 w-28 rounded-md font-semibold hover:bg-green-500 hover:text-white" @click="respondInvite(invite.id, 'accept', invite.id_project, invite.administrator_invite)">Accept</button>
                                    <button class="bg-red-200 w-28 rounded-md font-semibold hover:bg-red-500 hover:text-white" @click="respondInvite(invite.id, 'reject', invite.id_project, invite.administrator_invite)">Decline</button>
                                </div>
                            </div>
                        </div>
                    </template>
                </UPopover>
            </li>
        </ul>
        
        <div class="flex justify-around w-[10%]" id="nav-buttons-container" v-if="!isOpenMobile">
            <a href="/account">
                <Icon name="mdi:user" size="2em" v-if="avatarPath.length == 0"/>
                <img class="w-[2em] h-[2em] object-cover object-center rounded-full" :src="avatarPath.replace('\\', '/')" v-else/>
            </a>
            <button class="bg-transparent" @click="logOut()">
                <Icon name="mdi:logout" size="1.8em" color="red"/>
            </button>
        </div>
        <button class="bg-transparent" id="nav-toggle" @click="openMenuMobile()">
            <Icon name="mdi:format-list-bulleted" color="white" size="2em"/>
        </button>

        <ul class="w-screen absolute pb-2 bg-blue-400 shadow-xl z-50" v-if="isOpenMobile" id="menu-mobile" style="top: 4em;">
            <li>
                <div class="flex justify-start items-center">
                    <Icon name="mdi:home" size="1.5em" color="white" class="ml-5" />
                    <a href="/home" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Home</a>
                </div>
            </li>
            <li>
                <div class="flex justify-start items-center">
                    <Icon name="mdi:clipboard-list" size="1.5em" color="white" class="ml-5"/>
                    <a href="/project" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Projects</a>
                </div>
            </li>
            <li>
                <div class="flex justify-start items-center">
                    <Icon name="ic:baseline-price-check" size="1.5em" color="white" class="ml-5"/>
                    <a href="/paid_plans" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Prices</a>
                </div>
            </li>
            <li>
                <div class="flex justify-start items-center">
                    <Icon name="mdi:account-arrow-right" size="1.5em" color="white" class="ml-5"/>
                    <a href="/account" class="text-lg nav-link text-blue-800 ml-10" style="color: #fff">Account</a>
                </div>
            </li>
            <li>
                <div class="flex justify-start items-center">
                    <Icon name="mdi:logout" size="1.5em" color="white" class="ml-5"/>
                    <button  class="text-lg nav-link text-blue-800 bg-transparent ml-10" style="color: #fff" @click="logOut()">Logout</button>
                </div>
            </li>
        </ul>  
    </nav>
    <div class="flex w-full h-12 bg-red-600 text-white text-center items-center justify-center" v-if="renewAlert">
        <span class="mr-5">Your plan will expire on {{ expirationDay[0] }}. Renew your plan:</span>
        <button class="bg-red-600 border-2 border-white p-2 rounded-lg" @click="renewPlan">Renew</button>
    </div>
</template>

<style scoped>
    @media (max-width: 600px) {
        #nav-items {
            display: none;
        }

        #account-avatar {
            display: none;
        }

        #nav-toggle {
            display: block;
        }

        #menu-mobile {
            display: absolute;
        }

        #nav-bar {
            background-color: #60a5fa;
        }

        #nav-buttons-container {
            display: none;
        }

        #mobile-project-invites {
            display: flex;
        }
    }

    @media (min-width: 600px) {
        #nav-items {
            display: flex;
        }

        #account-avatar {
            display: block;
        }

        #nav-toggle {
            display: none;
        }

        #menu-mobile {
            display: none;
        }

        #nav-buttons-container {
            display: flex;
        }

        #mobile-project-invites {
            display: none;
        }
    }

    .nav-link {
        position: relative;
        text-decoration: none;
        color: black;
        transition: color 0.3s;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: black;
        transition: width 0.3s ease-in-out;
    }

    .nav-link:hover::after {
        width: 100%;
    }
</style>
