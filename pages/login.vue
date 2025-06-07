<template>
    <section class="bg-white dark:bg-white-900">
        <div class="flex flex-col items-center justify-center min-h-screen px-6 py-8 mx-auto">
            <div
                class="w-full max-w-md bg-gradient-to-bl from-[#F6F8FB] via-[#F6F8FB] to-[#FFFFFF] rounded-lg shadow-xl dark:bg-white border-1 border-[#D7DDEC]">
                <div class="p-6 space-y-4 sm:p-8">
                    <div class="flex justify-center mb-4">
                        <svg class="w-10 h-10 text-blue-600 dark:text-blue-600" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                            </path>
                        </svg>
                    </div>
                    <h1 class="text-4xl font-bold text-center text-gray-900">Login</h1>
                    <p class="text-center text-[#6B7187] text-base">Log in to your account</p>

                    <form class="space-y-6" @submit.prevent="handleLogin">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                                Email </label> <input type="text" name="email" id="email" v-model="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Please enter your Email or Username" required>
                        </div>

                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">Password</label>
                            <div class="relative">
                                <input :type="passwordFieldType" name="password" id="password"
                                    placeholder="Please enter your password" v-model="password"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required>
                                <button type="button" @click="togglePasswordVisibility"
                                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-700"
                                    :aria-label="passwordFieldType === 'password' ? 'Show password' : 'Hide password'">
                                    <svg v-if="passwordFieldType === 'password'" class="w-5 h-5" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                        </path>
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542 7 .847 0 1.673.124 2.468.352M7.5 7.5l12 12M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <a href="#"
                                class="text-sm font-medium text-blue-600 hover:underline dark:text-[#0057D8]">Forgot
                                password?</a>
                        </div>

                        <button type="submit"
                            class="w-full text-white bg-[#0057D8] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#0057D8] dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300 dark:border-[#1877F2] border-2">
                            Sign in
                        </button>
                        <p v-if="loginMessage" :class="isError ? 'text-red-500' : 'text-green-500'"
                            class="text-sm text-center">{{
                                loginMessage }}</p>
                    </form>
                </div>
            </div>
            <footer class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Copyright &copy; {{ currentYear }} ABC Company Limited. All rights reserved.</p>
                <div class="dark:text-[#0057D8]">
                    <p class="mt-1">
                        <a href="#" class="hover:underline">Privacy Policy</a>
                        <span class="mx-2">|</span>
                        <a href="#" class="hover:underline">Terms & Conditions</a>
                    </p>
                </div>
            </footer>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/dashboard',
    }
});

const { signIn } = useAuth();

const email = ref('');
const password = ref('');
const errorMsg = ref(null);

const handleLogin = async () => {
    errorMsg.value = null;
    try {

        await signIn(
            { email: email.value, password: password.value },
            { callbackUrl: '/dashboard' }
        );
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.value = 'Login failed. Please check your credentials and try again.';
    }
};
</script>