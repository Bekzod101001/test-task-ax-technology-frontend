<script setup lang="ts">

const props = defineProps({
  length: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectPage = (index: number) => {
  emit('update:modelValue', index);
};
</script>


<template>
  <nav aria-label="pagination">
    <ol class="pagination">
      <li
        v-for="(page, index) in props.length"
        :key="index"
        :class="[
          'pagination__item',
          {
            'pagination__item_active': props.modelValue === page
          },
        ]"
      >
        <button
          class="pagination__item__button"
          @click.prevent="selectPage(page)"
        >
          {{ page }}
        </button>
      </li>
    </ol>
  </nav>
</template>


<style lang="scss">
.pagination {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &__item {
    margin-right: 5px;
    &_active {
      .pagination__item__button {
        background-color: #ff9800;

      }
    }
    &__button {
      height: 30px;
      width: 30px;
      display: flex;
      background-color: #363636;
      justify-content: center;
      align-items: center;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>