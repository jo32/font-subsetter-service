# 开发者站前端开发环境快速配置

## nginx 配置

1. 修改 `dev.xiaomi.com.conf` 相关信息，并将其拷贝到 `/path/to/nginx.conf/site-enable` 下面。
2. 在 `nginx.conf` 加上 `include site-enable/*.conf;`

## 初始化项目

在进行下面步骤之前请确保安装了 nodejs。

1. 克隆项目：
`git clone git@git.n.xiaomi.com:jiangdailin/dev-xiaomi-fe-app.git`
2. 安装 npm 依赖：
`cd dev-xiaomi-fe-app && npm install`
3. 安装 bower 依赖：
`node bower-package.js`
4. 确保已经拿到 `dependencies` 目录下的各项目的权限并 checkout 代码。

## livereload 的即时修改预览

运行命令 `grunt serve` 然后输入 `dev.xiaomi.com/index.html`  预览即可，预览支持 livereload，可安装 [Chrome Livereload 插件](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) 来进行修改即更新预览。