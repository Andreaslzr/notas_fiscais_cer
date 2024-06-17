<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { carrinho, type CarrinhoItem  } from "~/stores/carrinho";
import { type Usuario } from "~/models/usuario";
import { salvarReclamacao } from "~/services/salvarReclamacao";
import { type Warranty, WARRANTY_STATUS } from "~/models/Warranty";
const { data } = useAuth();
const { getCarrinho, removerDoCarrinho, getValorTotalDoCarrinho, getPesoTotalDoCarrinho, esvaziarCarrinho } = carrinho();

definePageMeta({
  middleware: "auth",
});

const usuarioLogado = computed<Usuario | null>(() => {
  if (data.value) {
    return data.value?.results[0] ? data.value?.results[0] as Usuario : null;
  }
  return null;
});

const itensNoCarrinho = computed<Array<CarrinhoItem>>(()=>getCarrinho());
const valorTotal = computed(() => getValorTotalDoCarrinho().toPrecision(5));
const pesoTotal = computed(() => getPesoTotalDoCarrinho().toPrecision(5));
const carregando = ref(false);
const salvo: Ref<boolean|null> = ref(null);

console.log("itens No carrinho.....", itensNoCarrinho);

const deletarDoCarrinho = (itemParaRemover: CarrinhoItem) => {
  removerDoCarrinho({
    item: itemParaRemover.item,
    quantidade: 0
  });
}

const salvarPedido = async () => {
    if (getCarrinho().length) {
        carregando.value = true;
        console.log("data", data.value?.results);

        const usuarioLogadoId = usuarioLogado.value ? usuarioLogado.value.id : null;

        if (usuarioLogadoId !== null) {
            const carrinhoItems = getCarrinho().map(item => item.item.productFK.id.toString());
            try {
                // Cria o objeto de reclamação
                const reclama: Warranty = {
                    status: WARRANTY_STATUS.Pendent,
                    createdByFK: usuarioLogadoId,
                    items: carrinhoItems
                };

                console.log("Requisição de reclamação: ", reclama);

                const vendaSalva = await salvarReclamacao(reclama);

                if (vendaSalva) {
                    console.log("venda salva: ", vendaSalva);
                    setTimeout(() => {
                        salvo.value = true;
                        esvaziarCarrinho();
                    }, 3000);
                } else {
                    salvo.value = false;
                }
            } catch (error) {
                salvo.value = false;
                console.error("Erro ao salvar venda!", error);
            } finally {
                console.log("SALVO STATUS", salvo);
                setTimeout(() => {
                    carregando.value = false;
                    salvo.value = null;
                }, 3000);
            }
        } else {
            console.error("Usuário não está logado.");
        }
    } else {
        console.error("Carrinho está vazio.");
    }
};

        

</script>

<template>
  <main class="carrinho-container flex flex-column align-items-center">
    <h2 class="mt-4 mb-4">🛒 Seu carrinho</h2>
    <div class="card flex justify-content-center" v-if="carregando">
      <ProgressSpinner/>
    </div>
    <table v-if="!carregando">
      <thead>
        <tr class="text-center">
          <td>Item</td>
          <td>Produto</td>
          <td>Descrição</td>
          <td>Categoria</td>
          <td>Peso(kg)</td>
          <td>Preço Unitário</td>
          <td>Quantidade</td>
          <td>Peso nota(kg)</td>
          <td>Subtotal</td>
          <td>Ações</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(itemCarrinho, index) in itensNoCarrinho" :key="index" class="text-center">
          <td>{{ index + 1 }}</td>
          <td><img class="fotoProduto" :src="itemCarrinho.item.productFK.image" alt="foto produto" /></td>
          <td>{{ itemCarrinho.item.productFK.name }}</td>
          <td>{{ itemCarrinho.item.productFK.categoryFK.name}}</td>
          <td>{{ itemCarrinho.item.productFK.weight }}</td>
          <td>R$ {{ itemCarrinho.item.price}}</td>
          <td>{{ itemCarrinho.quantidade }}</td>
          <td>{{ itemCarrinho.quantidade * itemCarrinho.item.productFK.weight }}</td>
          <td>R$ {{ itemCarrinho.quantidade * itemCarrinho.item.price }}</td>
          <td>
            <Button @click="deletarDoCarrinho(itemCarrinho)" label=""><i class="pi pi-trash"></i></Button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="text-center">
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>Peso total:</th>
          <th>{{ pesoTotal }}kg</th>
          <th>Valor Total:</th>
          <th>R${{ valorTotal }}</th>
        </tr>
      </tfoot>
    </table>
    <Button v-if="Number(pesoTotal) < 15" @click="salvarPedido" class="mt-2 botao-pedido bg-primary" label="Fechar pedido" />
    <h2 v-else>peso maximo de 15kg excedido</h2>
    <Message v-if="salvo === true" severity="success">
      <p>Reclamação realizada com sucesso!</p>
    </Message>
    <Message v-if="salvo === false" severity="error">
      <p>Não foi possível salvar esta venda! 😥</p>      
    </Message>

  </main>
</template>

<style scoped lang="scss">
$largura-tabela: 90vw;

.carrinho-container {
  margin: 0;
  width: 100vw;
  min-height: calc(100vh - 80px);
  background-image: url("background.jpg");
  background-repeat: repeat;
  background-size: cover;
}

table {
  width: $largura-tabela;
  background-color: white;
  border-radius: 1rem;
  background-color: rgb(130, 97, 184);
}

thead {
  font-weight: bold;

  tr {
    border-bottom: 2px solid black
  }
}

td {
  padding: 1rem;
}

.fotoProduto {
  width: 50px;
  height: 50px;
}

Button {
  background-color: white;
  color: rgb(114, 15, 15);
  border: none;
}

.valor-total {
  font-weight: bold;
  width: 900px
}

.botao-pedido {
  width: $largura-tabela;
  height: 30px;

  &:hover {
    transform: scale(1.05);
    transition: 2s;
  }
}
</style>