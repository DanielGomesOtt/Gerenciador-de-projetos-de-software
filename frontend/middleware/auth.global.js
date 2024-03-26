export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client && to.path !== '/' && !to.path.toLowerCase().startsWith('/password_recovery')) {
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
