# 本色 H5 源码

需要 Node.js 18 或更高版本，不用装依赖。

启动命令：`PORT=80 node server.js`，不设 PORT 时默认端口 8788。

- 页面：访问根路径 `/`
- 数据看板：`/stats?k=bs2026`，可以看访问人数、访问次数、满意和不满意人数、付费漏斗、手机号
- 改看板密码：修改 `server.js` 里的 `TOKEN`
- 原始数据：都写在 `events.jsonl`，一行一条事件

页面里的 `index.html` 会把数据发到相对路径 `api/e`，所以页面和 server.js 部署在同一个域名下就行。
