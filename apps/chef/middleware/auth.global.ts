export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    const data = await useRequestFetch()('/api/user');
    if (data) {
        console.log('Setting current user:', data);
        user.value = data;
    }
});
