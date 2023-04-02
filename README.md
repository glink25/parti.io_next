## Parti.io

基于Node.js的局域网多人联机项目

## Lint & Format

1. 抛弃prettier，使用eslint插件代替
2. 使用eslint-kit来生成配置，抛弃繁杂的依赖和冗长的eslintrc
3. 一定要设置vscode的formatter和defaultFormatter为eslint，不然在配合其他插件例如volar时会出现格式化打架的问题