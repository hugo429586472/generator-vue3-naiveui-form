<template>
  <div class="formily-naiveui-form">
    <FormProvider :form="form">
      <SchemaField
        :schema="schema"
      ></SchemaField>
    </FormProvider>
  </div>
</template>

<script setup lang="ts">
import {
  createFormilySchemaField,
  createFormilyForm,
  createFormilySchema,
  setFormilyPattern,
  registerFormilyRules
} from './shared/form'
import { FormProvider } from '@formily/vue'
import { formProps } from './props'
import { defineProps, defineEmits, defineExpose, watch, reactive, nextTick } from 'vue'

const props = defineProps(formProps)
defineEmits(['change', 'submit', 'reset', 'validateFailed'])
const formOptions = reactive({
  values: props.model, // 初始值
  effects: props.effects
})

const { SchemaField } = createFormilySchemaField({}, props.scope)

const form = createFormilyForm(props.pattern, formOptions)

const schema = createFormilySchema(props.fields || {})

registerFormilyRules(props.rules || {})

const submit = (cb: Function, failCb: Function | undefined) => {
  form.validate().then(() => {
    cb(form.values)
  }).catch((e: any) => {
    if (failCb) {
      failCb(e)
    } else {
      console.log(e)
    }
  })
}

// form.setInitialValues(props.model || {})

const reset = () => {
  // formily reset方法似乎对于一开始没定义值的情况会有问题，这里直接用setValues方法
  // form.reset('*')
  // form.onInit()
  nextTick(() => {
    form.setValues(props.model || {}, 'overwrite')
  })
  console.log(form, 'form')
}

const setPattern = (pattern: typeof props.pattern) => {
  setFormilyPattern(form, pattern)
}
watch(() => props.pattern, (pattern) => {
  setPattern(pattern)
})

defineExpose({
  setPattern,
  reset,
  submit
})

</script>