<script setup lang="ts">
import { BACKEND_URL } from "~/models/app";
import { ref, computed } from 'vue';
import { type Invoice } from '~/models/invoice';

definePageMeta({
    middleware: 'auth'
});

const code = ref<string>('');
const dataNota = ref<string>('');
const data = ref<{ results: Invoice[] }>({ results: [] });

const ProcurarNota = async () => {
    try {
        const url = `${BACKEND_URL}/invoice?code=${code.value}&emissionDate_before=${dataNota.value}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token cf44981f5d7290d1207594282ee3655d5e6d7a94'
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar nota');
        }

        const resposta = await response.json();

        if (resposta.results) {
            data.value = resposta;
            console.log('Notas fiscais encontradas:', data.value.results[0]);
        } else {
            throw new Error('Nenhum resultado encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar nota:', error);
    }
};

const notas = computed(() => data.value.results);
</script>

<template>
    <main class="notas flex flex-column align-items-center">
    <h1>Buscar notas fiscais</h1>
    <section>
            <div class="busca">
                <FloatLabel>
                    <InputText id="nota" v-model="code"/>
                    <label>Número da nota</label>
                </FloatLabel> <br>
            </div>
            <div class="busca">
                <FloatLabel>
                    <InputText id="nota" v-model="dataNota"/>
                    <label>Data</label>
                </FloatLabel> <br>  
            </div>
            <div class="botao-busca">
                <Button @click="ProcurarNota" label="Buscar" id="botão"></Button>
            </div> 
            <div v-if="notas.length > 0 && code !== '' && dataNota !== ''">
                <h3>Nota Encontrada:</h3>
                <span>Numero da nota: {{ notas[0].code }}</span> <br> <br>
                <span>Data de emissão: {{ notas[0].emissionDate }}</span> <br> <br>
                <span>Nome do cliente: {{ notas[0].customerName }}</span> <br> <br>
                <span>CNPJ do cliente: {{ notas[0].customerCNPJ }}</span> <br> <br>
                <span>Nome do vendedor: {{ notas[0].sellerName }}</span> <br> <br>
                <span>CNPJ do vendedor: {{ notas[0].sellerCNPJ }}</span> <br> <br>
                <span>Valor da nota: {{ notas[0].totalValue }}</span> <br> <br>
            </div>
            <div v-if="notas.length > 0 && code !== '' && dataNota !== ''" class="botao-item">
                <NuxtLink :to="`/notas/${notas[0].id}`">
                    <Button label="Itens da nota" id="botão"></Button>
                </NuxtLink> 
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">

.notas {
  margin: 0;
  width: 100vw;
  min-height: calc(100vh - 80px);
  background-image: url('background.jpg');
  background-repeat: repeat;
  background-size: cover;

  .busca {
            margin: 1rem 0 1rem 0;
            #nota{
                border-color: black;
            }

  }
  .botao-busca {
            margin: 1rem 0 1rem 0;
            #botão {
                width: 250px;
                height: 30px;
                background-color: rgb(105, 15, 189);
                color: black;
                border-color: black;
            }
  }
  .botao-item{ 
    #botão {
            width: 100px;
            height: 40px;
            background-color: rgb(105, 15, 189);
            color: black;
            border-color: black;
            }
  }
}

</style>