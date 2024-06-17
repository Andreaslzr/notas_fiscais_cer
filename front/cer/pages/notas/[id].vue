<script setup lang="ts">
import { BACKEND_URL } from "~/models/app";
import { ref, computed } from "vue";
import { type InvoiceItem } from "~/models/invoiceItens";
const route = useRoute();
import { carrinho } from "~/stores/carrinho";
const { adicionarNoCarrinho, getCarrinho, estaNoCarrinho } = carrinho();

definePageMeta({
    middleware:'auth'
})

const data = ref<{ results: InvoiceItem[] }>({ results: [] });

const ProcurarItem = async () => {
    try {
        const url = `${BACKEND_URL}/invoice-item?invoiceFK=${route.params.id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar item');
        }

        const resposta = await response.json();

        if (resposta.results) {
            data.value = resposta;
            console.log('item encontrado:', data.value.results);
        } else {
            throw new Error('Nenhum resultado encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar item:', error);
    }
};

const itens = computed(() => data.value.results);

const emit = defineEmits(['eventoAdicionado']); 

const adicionarItem = (item: InvoiceItem) => {
  adicionarNoCarrinho(item);
  emit('eventoAdicionado');
  console.log("CARRINHO ATUAL: ", getCarrinho());
}

const produtoNoCarrinho = (item: InvoiceItem) => {
    return estaNoCarrinho(item);
};

ProcurarItem();


</script>

<template>
    <main class="container flex flex-column align-items-center">
    <h1>Itens</h1>
    <div class="carrinho">
      <NuxtLink to="/carrinho">
        <Button icon="pi pi-shopping-cart" label="Carrinho"/>
      </NuxtLink> 
    </div>
    <div v-if="itens.length > 0">
      <div v-for="(item,index) in itens" :key="index">
        <section class="item">
          <div class="check">      
            <Checkbox :modelValue="produtoNoCarrinho(item)" :binary="true" :readonly="true"/>
          </div>
          <div class="item-imagem">
            <img :src="item.productFK.image" />
          </div>
          <div>
            <h4 class="item-nome">{{ item.productFK.name }}</h4>
          </div>
          <div class="ml-2">
            <span>BarCode: {{ item.productFK.barCode}} </span>
          <div>
          <div>
            <label>Peso: </label>
            <span>{{ item.productFK.weight}} </span>
          </div>
            <label>Descrição: </label>
            <span>{{ item.productFK.description}} </span>
          </div>
          </div>
            <Button class="botao" label="Adicionar" @click="adicionarItem(item)"/>
        </section> <br>
      </div>  
    </div>
    </main>
</template>

<style scoped lang="scss">

.container {
  background-image: url('background.jpg');
  background-repeat: repeat;
  background-size: cover;

  .item {
  width: 350px;
  max-width: 350px;
  height: 350px;
  max-height: 350px;
  background-color: white;
  border-radius: 1.5rem;
  margin: 1.5rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    transition: 2s;
  }

  .item-imagem {
    width: 100%;
    height: 50%;
    max-width: 280px;
    max-height: 200px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .item-nome{
    margin: 0.5rem;
  }

  .botao {
    width: 80%;
    height: 2rem;
    margin: 1rem;
    background-color: rgb(105, 15, 189);
    color: black;
    border-color: black;
  }

  .check{
    width: 95%;
    
  }
  }
}
.carrinho{
    position: fixed;
    top: 0;
    right: 0;
    margin: 1rem;
}
</style>