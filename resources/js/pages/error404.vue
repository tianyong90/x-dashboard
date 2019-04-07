<template>
  <div class="main-container main-with-padding">
    <div class="welcome">
      Not found
    </div>

    <el-button class="btn-back"
               type="primary"
               size="large"
               @click="$router.back()"
    >
      返回
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.main-container {
  display: block;

  .welcome {
    display: block;
    font-size: 3rem;
    text-align: center;
    margin-top: 3rem;

    &:hover {
      color: red;
    }
  }

  .btn-back {
    display: block;
    margin: 20px auto;
  }
}
</style>
