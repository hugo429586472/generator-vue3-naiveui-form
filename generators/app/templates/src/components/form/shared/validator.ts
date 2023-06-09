/*
 * @Author: hugo.huang@rccchina.com
 * @Date: 2023-05-10
 * @Description: 校验规则通用处理，将外部传入的rules配置转换为formly能识别的格式
 */

import { registerValidateRules } from "@formily/core"

export const registerFormilyRules = (rules: Record<string, any>) => {
  registerValidateRules(rules)
}