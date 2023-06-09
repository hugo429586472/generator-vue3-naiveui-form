<script setup lang="ts">
import FormilyNaiveuiForm from '../components/form'
import { ref } from 'vue'

const formRef = ref()
const fields = {
  name: {
    type: 'void',
    title: '姓名',
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      asterisk: true,
      feedbackLayout: 'none',
    },
    'x-component': 'FormGrid',
    properties: {
      firstName: {
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '姓',
        },
      },
      lastName: {
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '名',
        },
      },
    },
  },
  email: {
    type: 'string',
    title: '邮箱',
    required: true,
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-validator': 'email',
  },
  age: {
    type: 'string',
    title: '年龄',
    'x-decorator': 'FormItem',
    'x-component': 'Input'
  },
  gender: {
    type: 'string',
    title: '性别',
    enum: [
      {
        label: '男',
        value: 1,
      },
      {
        label: '女',
        value: 2,
      },
      {
        label: '第三性别',
        value: 3,
      },
    ],
    'x-decorator': 'FormItem',
    'x-component': 'Select',
  },
  birthday: {
    type: 'string',
    required: true,
    title: '生日',
    'x-decorator': 'FormItem',
    'x-component': 'DatePicker',
    'x-component-props': {
      'value-format': 'yyyy-MM-dd'
    }
  },
  address: {
    type: 'string',
    required: true,
    title: '地址',
    'x-decorator': 'FormItem',
    'x-component': 'Cascader',
    'x-reactions': '{{fetchAddress}}',
  },
}

const effects = {
  "email": [{
    "on": ["change"], // 触发联动的事件，如 change、click 等
    "do": [
      {
        "type": "show", // 联动类型，show 表示显示隐藏
        "target": "age", // 联动目标字段名
        // "condition": {
        //   "type": "eq", // 条件类型，eq 表示相等
        //   "value": "hugo" // 条件值
        // }
        condition: (field: any) => {
          const emailValue = field.query('email').get('value')
          const nameValue = field.query('firstName').get('value')
          if (emailValue === 'hugo' && nameValue === 'hugo') {
            return true
          }
          return false
        }
      }
    ]
  }]
}

const model = {
  firstName: 'vane'
}

const scope = {
  fetchAddress: (field: any) => {
    const transform: any = (data = {}) => {
      return Object.entries(data).reduce((buf, [key, value]) => {
        if (typeof value === 'string')
          return buf.concat({
            label: value,
            value: key,
          })
        const { name, code, cities, districts } = value
        const _cities = transform(cities)
        const _districts = transform(districts)
        return buf.concat({
          label: name,
          value: code,
          children: _cities.length
            ? _cities
            : _districts.length
            ? _districts
            : undefined,
        })
      }, [])
    }

    field.loading = true
    fetch('//unpkg.com/china-location/dist/location.json')
      .then((res) => res.json())
      .then((data) => {
        field.dataSource = transform(data)
        field.loading = false
      })
  }
}

let pattern = ref('editable')

const tryEdit = () => {
  pattern.value = 'editable'
}

const cancelEdit = () => {
  pattern.value = 'readPretty'
}

const reset = () => {
  formRef.value.reset()
}

const rules = {}
</script>

<template>
  <div>
    <div>
      <FormilyNaiveuiForm
        ref="formRef"
        :pattern="pattern"
        :fields="fields"
        :effects="effects"
        :model="model"
        :scope="scope"
        :rules="rules"
        />
    </div>
    <div>
      <!-- <button @click="submit">提交</button> -->
      <button @click="tryEdit">编辑</button>
      <button @click="cancelEdit">取消编辑</button>
      <button @click="reset">重置</button>
    </div>
  </div>
</template>
