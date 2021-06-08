# lds-app-cli



## 安装

全局安装脚手架工具
```sh
npm install lds-app-cli -g
```

## 使用

#### 初始化项目
-  `lds init`会在命令行所在路径下创建一个名`web-app`的文件夹，并且初始话项目。
    ```sh
    lds init web-app
    ```
- 安装项目依赖
    ```sh
    cd web-app

    yarn # 或者 npm install
    ```

#### 创建工程
`lds create project_name` 会在`web-app/src`文件夹下创建一个`project_name`的工程，并根据选择的模板类型（Vue,React,普通模板）初始化工程配置文件。 
```sh
lds create project_name
```

#### 启动工程
`lds start project_name ` 启动工程，默认端口为3000
```sh
# 设置端口8080
lds start project_name -p 8080
```
启动项目后，浏览器将会打开 `http://localhost:8080/project_name`，如果直接访问`http://localhost:8080`则会访问到开发者列表页面，即`web-app/developer/index.html`页面。

#### 打包工程

```sh
lds build project_name
```

> `project_name`是相对于`web-app/src`的相对路径，例如：先打包路径为`web-app/src/example/mini-app`的`mini-app`，此时`project_name`为`example/mini-app`.




`lds build project_name` 将在项目根目录下创建一个`build`文件夹，存放打包后的工程文件。并根据传递的`project_name`打包到`build`对应的目录中，如果`project_name`为`example/mini-app`，则最终打包后的路径为`build/example/mini-app`。


#### 更新记录
|版本|描述|备注|
|----|----|----|
|v1.0.0|发版测试||
|v1.0.1|修复编码格式以及项目依赖问题||
|v1.0.2|增加初始化项目自动安装依赖功能||