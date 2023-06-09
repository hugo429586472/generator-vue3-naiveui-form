/*
 * @Author: hugo.huang@rccchina.com
 * @Date: 2023-05-09
 * @Description: 联动逻辑通用处理，将外部传入的effects配置转换为formly能识别的useFormEffects格式
 */
import { onFieldReact } from '@formily/core'

type FieldValue = string | number | boolean | null | undefined;

interface LinkageCondition {
  type: 'eq'; // 目前只支持相等条件
  value: FieldValue;
}

interface ShowLinkageAction {
  type: 'show'; // 显示/隐藏联动
  target: string; // 目标字段名
  condition: LinkageCondition | Function; // 联动条件
}

interface SetValueLinkageAction {
  type: 'setValue'; // 设置字段值联动
  target: string; // 目标字段名
  value: FieldValue; // 目标值
  condition: LinkageCondition; // 联动条件
}

type LinkageAction = ShowLinkageAction | SetValueLinkageAction;

interface LinkageConfig {
  [fieldName: string]: {
    on: string[]; // 触发联动的事件，如 change、click 等
    do: LinkageAction[]; // 联动操作
  }[];
}

/*
 * 转换effect为formily识别的格式
 * @param {Record<string, any>} effects
 * @returns {Record<string, any>}
 * @example
 * 传入
    {
      "field1": [{
        "on": ["change"], // 触发联动的事件，如 change、click 等
        "do": [
          {
            "type": "show", // 联动类型，show 表示显示隐藏
            "target": "field2", // 联动目标字段名
            "condition": {
              "type": "eq", // 条件类型，eq 表示相等
              "value": "2" // 条件值
            }
          },
          {
            "type": "setValue", // 联动类型，setValue 表示设值
            "target": "field3", // 联动目标字段名
            "value": "xxx", // 目标值
            "condition": {
              "type": "eq", // 条件类型，eq 表示相等
              "value": "2" // 条件值
            }
          }
        ]
      }]
    }
 * 转换为
    function () {
      onFieldValueChange('field1', (field) => {
        form.setFieldState('field2', (state) => {
          //对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
          state.display = field.value === '2' ? 'visible' : 'hidden'
        })
        form.setFieldState('field3', (state) => {
          //对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
          if (field.value === '2') state.value = 'xxx'
        })
      })
    }
 */
export const dealEffects = (effects: LinkageConfig) => {
  return () => {
    for (const field in effects) {
      const linkages = effects[field]
      for (const linkage of linkages) {
        if (!linkage.do) continue

        for (const action of linkage.do) {
          onFieldReact(action.target, (effectField) => {
            switch (action.type) {
              case 'setValue':
                if (conditionJudgment(action.condition, effectField.query(field).get('value')))
                  effectField.value = action.value
                break
              case 'show':
                effectField.display = conditionJudgment(action.condition, effectField.query(field).get('value')) ? 'visible' : 'hidden'
                break
            }
          })
        }
      }
    }
  }
}


const conditionJudgment = (condition: LinkageCondition, value: FieldValue) => {
  switch (condition.type) {
    case 'eq':
      return value === condition.value
  }
}