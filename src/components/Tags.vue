<script lang="ts" setup>
import { computed, ref, toRefs, watch } from 'vue'
import { onClickOutside, onKeyUp, watchDebounced } from '@vueuse/core'

const props = defineProps<{
  options: Map<string, string>
  tags: string[]
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'query', value: string): void
  (e: 'selected', value: string): void
  (e: 'deleted', value: string): void
}>()

const inputValue = ref<string>('')
const selectedPosition = ref<number>(-1)
const selectedValue = ref<string>('')
const tagsRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

const { options, tags } = toRefs(props)

watchDebounced(
  inputValue,
  (newValue: string) => {
    emit('query', newValue)
  },
  { debounce: 500 },
)

const hasOptions = computed(() => {
  return options.value.size > 0
})

type SelectListItem = {
  key: string
  value: string
}

const selectList = computed(() => {
  const list: SelectListItem[] = []

  for (const [key, value] of options.value) {
    list.push({
      key,
      value,
    })
  }

  return list
})

watch(options, () => {
  clearSelection()
})

onClickOutside(tagsRef, () => {
  clearSelection()
  clearInput()
})

onKeyUp('Escape', () => {
  emit('query', '')
  inputRef.value?.select()
})

const clearInput = () => {
  inputValue.value = ''
}

const clearSelection = () => {
  selectedPosition.value = -1
  selectedValue.value = ''
}

const hasTags = computed(() => tags.value.length > 0)

const onDownKey = () => {
  if (hasOptions.value) {
    const nextPosition = selectedPosition.value + 1

    if (nextPosition <= options.value.size - 1) {
      selectedPosition.value = nextPosition
      selectedValue.value = selectList.value[selectedPosition.value].key
    }
  } else {
    selectedPosition.value = -1
  }
}

const onUpKey = () => {
  if (hasOptions.value) {
    if (selectedPosition.value > 0) {
      selectedPosition.value = selectedPosition.value - 1
      selectedValue.value = selectList.value[selectedPosition.value].key
    }
  } else {
    selectedPosition.value = -1
  }
}

const onEnterKey = () => {
  if (hasOptions.value) {
    if (selectedPosition.value >= 0) {
      emit('selected', selectedValue.value)
      clearSelection()
      clearInput()
    }
  }
}
</script>

<script lang="ts">
export default {
  name: 'Tags',
}
</script>
<template>
  <div class="tags" ref="tagsRef">
    <div class="tags-container">
      <input
        type="text"
        class="tags-container-input"
        ref="inputRef"
        v-model="inputValue"
        :placeholder="placeholder"
        @keydown.prevent.down="onDownKey"
        @keydown.prevent.up="onUpKey"
        @keydown.prevent.enter="onEnterKey"
      />
      <Transition name="fade">
        <div v-if="hasTags">
          <TransitionGroup name="list" tag="ul" class="tags-selected-container">
            <li
              v-for="tag in tags"
              :key="tag"
              class="tags-selected-container-item"
            >
              <div>{{ tag }}</div>
              <div @click="emit('deleted', tag)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="20px"
                  height="20px"
                  style="cursor: pointer"
                  fill="#585858"
                >
                  <path
                    d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"
                  />
                </svg>
              </div>
            </li>
          </TransitionGroup>
        </div>
      </Transition>
    </div>
    <div class="tags-options-container" v-if="hasOptions">
      <ul>
        <li
          v-for="item in selectList"
          class="tags-options-list-item"
          :class="{
            'tags-options-list-item-selected': selectedValue === item.key,
          }"
          @click="() => emit('selected', item.key)"
        >
          {{ item.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  position: relative;
}

.tags-container {
  border: 2px solid #e4e4e4;
  border-radius: 0.2rem;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.tags-container-input {
  background-color: #f4f7fe;
  border: none;
  outline: none;
  width: 100%;
  height: 2rem;
  padding: 5px;

  &::placeholder {
    color: #405fe3;
  }
}

.tags-selected-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.2rem;
  list-style: none;
  padding: 0;
}

.tags-selected-container-item {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  border: 2px solid #e4e4e4;
  border-radius: 0.2rem;
  align-items: center;
  padding: 0.1rem 0.3rem;
  font-weight: bold;
  color: #585858;
  cursor: default;
}

.tags-options-container {
  position: absolute;
  background-color: white;
  border: 2px solid #e4e4e4;
  border-radius: 0.2rem;
  width: 100%;

  ul {
    list-style: none;
    padding: 0.5rem 0.5rem;
  }
}

.tags-options-list-item {
  &:hover {
    cursor: pointer;
    background-color: #e4e4e4;
    color: black;
  }
}

.tags-options-list-item-selected {
  background-color: cornflowerblue;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
