<script setup lang="ts">

definePageMeta({
    middleware:'auth'
})


</script>

<template>
    <main class="notas-container flex flex-column align-items-center">
    <h1>Buscar notas fiscais</h1>
    <section>
            <div>
                <FloatLabel>
                    <InputText/>
                    <label>Buscar pelo número da nota</label>
                </FloatLabel> <br>
                <FloatLabel>
                    <InputText/>
                    <label>Buscar pela data de início</label>
                </FloatLabel> <br>
                <FloatLabel>
                    <InputText/>
                    <label>Buscar pela data de fim</label>
                </FloatLabel> <br>
                
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">

.notas-container {
  margin: 0;
  width: 100vw;
  min-height: calc(100vh - 80px);
  background-color: rgb(154, 154, 243);
  background-repeat: repeat;
  background-size: cover;
}

</style>