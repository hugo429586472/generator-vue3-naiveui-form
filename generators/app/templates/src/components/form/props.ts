import { PropType } from 'vue'

export const formProps = {
  pattern: {
    type: String as PropType<'editable' | 'readPretty'>,
    default: 'editable',
    // validator: (value: string) => ['editable', 'readPretty'].indexOf(value) !== -1
  },  // 表单状态：可编辑 | 只读
  fields: {
    type: Object as PropType<Record<string, any>>
  }, // 字段配置
  rules: {
    type: Object as PropType<Record<string, any>>
  }, // 校验规则
  publicData: {
    type: Object as PropType<Record<string, unknown>>,
    default () { return {} }
  }, // 一些公共数据，例如地区的options
  model: {
    type: Object as PropType<Record<string, unknown>>,
    default () { return {} }
  }, // 详情、编辑 的 数据
  uploadConfig: {
    type: Object as PropType<Record<string, unknown>>,
    default () { return {} }
  }, // 附件上传相关参数
  showOnlyRead: {
    type: Boolean as PropType<boolean>,
    default: true
  }, // 是否显示 只读字段，默认显示
  scope: {
    type: Object as PropType<Record<string, Function>>,
    default () { return {} }
  }, // 条件查询，根据传入的规则去获取数据作为数据源
  effects: {
    type: Object as PropType<Record<string, any>>,
    default () { return {} }
  } // 联动效果
  // 示例数据：
  // {
  //   "field1": [{
  //     "on": ["change"], // 触发联动的事件，如 change、click 等
  //     "do": [
  //       {
  //         "type": "show", // 联动类型，show 表示显示隐藏
  //         "target": "field2", // 联动目标字段名
  //         "condition": {
  //           "type": "eq", // 条件类型，eq 表示相等
  //           "value": "2" // 条件值
  //         }
  //       },
  //       {
  //         "type": "setValue", // 联动类型，setValue 表示设值
  //         "target": "field3", // 联动目标字段名
  //         "value": "xxx" // 目标值
  //       }
  //     ]
  //   }]
  // }
}
