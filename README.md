# Generator

## 介绍

基于yeoman使用的脚手架模板，用于生成通用表单模块，技术框架为vue3+formily+naiveui

## 使用

```dash

npm i generator-vue3-naiveui-form -g

cd my-project

yo vue3-naiveui-form

```

### conflict package.json

运行 ```yo vue3-naiveui-form``` 应该会有 ``` conflict package.json ``` 的提示，可以选择 d (show the differences between the old and the new)，查看更新了什么依赖，然后继续回车并且选择  n (do not overwrite)。
最后根据自己项目的情况加上 generator  中使用的依赖即可。

