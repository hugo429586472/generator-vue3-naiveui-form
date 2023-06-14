/*
 * @Author: hugo.huang@rccchina.com
 * @Date: 2023-05-09
 * @Description: field通用处理，通过外部传入的字段配置，生成表单项和字段的数据结构
 */

const DefaultComponentProps = { style: 'min-width: 120px' }
const DefaultUploadProps = { action: 'aa.com' }

export const dealFields = (columns: Record<string, any>, options: Record<string, any> = {}): Record<string, any> => {
  let res: Record<string, any> = {}
  for (const key in columns) {
    res[key] = getFieldMap(columns[key], options)
  }
  return res
}

/*
 * 格式化字段配置，将外部传入的字段配置转换为formily能识别的格式
 * @param {Record<string, any>} column
 * @param {Record<string, any>} options
 * @returns {Record<string, any>}
 */
const getFieldMap = (column: Record<string, any>, options: Record<string, any>): Record<string, any> => {
  let res = { ...column }

  // 处理字段类型，默认设置一个form-item控制组件的change事件，用于处理表单项的联动等逻辑
  if (!res['x-decorator']) res['x-decorator'] = 'FormItem'

  // 设置字段的默认样式
  res['x-component-props'] = {
    ...DefaultComponentProps,
    ...options['x-component-props'],
    ...res['x-component-props']
  }

  // 处理特殊字段的枚举值
  if (!res.enum) {
    res.enum = options.publicData?.[res.name]?.options || []
  }
  // 处理上传字段的上传配置
  if (res.type === 'upload') {
    res['x-component-props'] = {
      ...res['x-component-props'],
      ...(options.publicData?.[res.name]?.uploadOptions || {})
    }
  }

  return res
}