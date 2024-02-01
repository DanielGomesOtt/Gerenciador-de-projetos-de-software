
export default defineNuxtRouteMiddleware(async (to, from) => {
    if(process.client && to.path !== '/' && !to.path.toLowerCase().startsWith('/password_recovery')){
        try {
            let storage = JSON.parse(localStorage.getItem('userStorage'));
            if(storage && storage.token){
                const response = await useFetch('http://localhost:3333/verifyToken', {
                    headers: [ {"token": storage.token} ]
                });
                if (!response) {
                    return navigateTo('/');
                }
            }else{
                return navigateTo('/');
            }
        } catch (error) {
            return navigateTo('/');
        }
    }else if(to.path == '/'){
        try {
            let storage = JSON.parse(localStorage.getItem('userStorage'));
            if(storage && storage.token){
                const response = await useFetch('http://localhost:3333/verifyToken', {
                    headers: [ {"token": storage.token} ]
                });
                if (response) {
                    return navigateTo('/home');    
                }
            }
        } catch (error) {
            return error;
        }
    }
});