<script setup lang="ts">
import { reactive, ref } from 'vue';
const { signIn } = useAuth();

definePageMeta({
    layout: 'login'
})



const credenciais = reactive({
    email: '',
    password: ''
});
const mensagemErro = ref('');

const fazerLogin = () => {
    console.log("login: ", credenciais);
    signIn(credenciais, { redirect: false })
        .then(() => {
            console.log("logado com sucesso....");
            navigateTo('/notas');
        })  
}


</script>

<template>
    <main class="login-main flex align-items-center justify-content-center">

        <section class="login-container flex flex-column align-items-center justify-content-center">
            <h4 class="row-login">Notas Fiscais</h4>
            <div class="row-login">
                <FloatLabel>
                    <InputText v-model="credenciais.email" type="email" id="email-input" class="input-text" />
                    <label for="email-input">Email</label>
                </FloatLabel>
            </div>
            <div class="row-login">
                <FloatLabel>
                    <InputText v-model="credenciais.password" type="password" id="password-input" class="input-text" />
                    <label for="password-input">Senha</label>
                </FloatLabel>
            </div>
            <div class="row-login" v-if="mensagemErro !== ''">
                <p id="erro">{{ mensagemErro }}</p>
            </div>
            <div class="row-login">
                <Button @click="fazerLogin" label="Entrar" id="login-button"></Button>
            </div>
        </section>
    </main>
</template>


<style scoped lang="scss">
.login-main {
    width: 100vw;
    height: 100vh;
    background-image: url('background.jpg');
    background-repeat: repeat;
    background-size: cover;

    .login-container {
        width: 30vw;
        height: 70vh;
        background-color: white;

        .row-login {
            margin: 1rem 0 1rem 0;

            .input-text {
                height: 2.5rem;
                width: 250px;
            }

            #login-button {
                width: 250px;
                height: 30px;
                background-color: rgb(105, 15, 189);
                color: black;
                border-color: black;
            }

            #erro {
                color: tomato;
                font-size: 0.8rem;
            }
        }
    }
}

</style>