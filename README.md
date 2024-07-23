## Parti.io

基于Node.js的局域网多人联机项目，启动后访问本地局域网地址即可多人联机进行游戏

## Features
1.解耦房间管理和游戏实例，可以单独开发游戏代码和主平台代码

2.通过简易的Game Api实现游戏通信，可以快速改造单机类型游戏为多人联机

## Lint & Format

1. 抛弃prettier，使用eslint插件代替
2. 使用eslint-kit来生成配置，抛弃繁杂的依赖和冗长的eslintrc
3. 一定要设置vscode的formatter和defaultFormatter为eslint，不然在配合其他插件例如volar时会出现格式化打架的问题
