/*
 * @Author: hugo.huang@rccchina.com
 * @Date: 2023-05-09
 * @Description: form通用处理，将外部传入的表单配置转换为formly能识别的json schema格式
 */

import * as NaiveUIComponents from 'formily-naiveui'

import { createSchemaField, createForm } from '@formily/vue'
import type { VueComponent } from '@formily/vue'
import { Form } from '@formily/core' // type

import { dealFields } from './field'
import { dealEffects } from './effect'
import { registerFormilyRules } from './validator'

/*
 * 组件注册到formily中
 * @param {Record<string, VueComponent>} components
 * @returns {VueComponent}
 */
export const createFormilySchemaField = (components: Record<string, VueComponent> = {}, scope: any = {}) => {
  return createSchemaField({
    components: {
      ...NaiveUIComponents,
      ...components
    },
    // TODO: 这里也要做一层转换比较好，现在的使用方式有点复杂，后续通过promise来处理外部的数据，需要外部使用promise
    scope
  })
}

/*
 * 创建formily表单实例
 * @param {Record<string, any>} options
 * @returns {Form}
 * @example
 * const form = createFormilyForm()
 */
export const createFormilyForm = (pattern: 'editable' | 'readPretty' = 'editable', options: Record<string, any> = {}) => {
  return createForm({
    pattern: pattern,
    initialValues: options.values || {},
    effects () {
      dealEffects(options.effects || {})()
    },
  })
}

/*
 * 创建formily表单schema
 * @param {Record<string, any>} fields
 * @param {Record<string, any>} options
 * @returns {Record<string, any>}
 */
export const createFormilySchema = (fields: Record<string, any | undefined>, options: Record<string, any> = {}) => {
  return {
    type: 'object',
    properties: dealFields(fields, options)
  }
}

/*
 * 设置form表单模式
 * @param {Form<Object>} form
 * @param {'editable' | 'readPretty'} value
 * @returns {void}
 */
export const setFormilyPattern = (form: Form<Object>, value: 'editable' | 'readPretty') => {
  form.setPattern(value)
}

/*
 * 格式化初始化传入表单的值
 * 这里需要以values的key为准，因为有些参数不在columns里（不在columns的第一层）
 * @param {Record<string, any>} values
 * @param {Record<string, any>} columns
 * @returns {Record<string, any>}
 */
export const formatInitValues = (values: Record<string, any>, columns: Record<string, any>) => {
  if (!values) return {}

  let _values: Record<string, any> = {}
  for (const key of Object.keys(values)) {
    if (columns[key] && columns[key]['x-component'] === 'Upload') {
      // （附件字段因为上传组件返回值格式不太合适，需要二次处理）
      _values[key] = values[key] ? { fileList: values[key] } : {}
      // _values[key] = values[key]
    } else {
      _values[key] = values[key]
    }
  }
  return _values
}

export {
  registerFormilyRules
}
