export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client && to.path !== '/' && !to.path.toLowerCase().startsWith('/password_recovery') && !to.path.toLocaleLowerCase().startsWith('/administrator')) {
        try {
            let storage = JSON.parse(localStorage.getItem('userStorage'));
            if (storage && storage.token) {
                const response = await $fetch('http://localhost:3333/verifyToken', {
                    headers: { "token": storage.token }
                });
                if (!response) {
                    localStorage.removeItem('userStorage');
                    return navigateTo('/');
                }
            } else {
                localStorage.removeItem('userStorage');
                return navigateTo('/');
            }
        } catch (error) {
            localStorage.removeItem('userStorage');
            console.error(error);
            return navigateTo('/');
        }
    } else if(process.client && to.path !== '/administrator' && to.path.toLocaleLowerCase().startsWith('/administrator')){
        try {
            let storage = JSON.parse(localStorage.getItem('adminStorage'));
            if (storage && storage.token) {
                const response = await $fetch('http://localhost:3333/verifyToken', {
                    headers: { "token": storage.token }
                });
                if (!response) {
                    localStorage.removeItem('adminStorage');
                    return navigateTo('/administrator');
                }
            } else {
                localStorage.removeItem('adminStorage');
                return navigateTo('/administrator');
            }
        } catch (error) {
            localStorage.removeItem('userStorage');
            console.error(error);
            return navigateTo('/');
        }
    } else if(to.path == '/administrator'){
        try {
            let storage = JSON.parse(localStorage.getItem('adminStorage'));
            if (storage && storage.token) {
                const response = await $fetch('http://localhost:3333/verifyToken', {
                    headers: { "token": storage.token }
                });
                if (response !== false) {
                    return navigateTo('/administrator/home');
                }
            }
        } catch (error) {
            localStorage.removeItem('adminStorage');
            console.error(error);
            return navigateTo('/administrator');
        }
    } else if (to.path === '/') {
        try {
            let storage = JSON.parse(localStorage.getItem('userStorage'));
            if (storage && storage.token) {
                const response = await $fetch('http://localhost:3333/verifyToken', {
                    headers: { "token": storage.token }
                });
                if (response !== false) {
                    return navigateTo('/home');
                }
            }
        } catch (error) {
            localStorage.removeItem('userStorage');
            console.error(error);
            return navigateTo('/');
        }
    }
});
