# PI-DDNS

> 使用场景：树莓派做动态域名解析，配合路由器端口转发完成 nas 远程访问

## 使用方法


```
// 复制配置文件并修改内容
$ cp config.default.js config.js

// 安装依赖
$ npm i

// 运行
$ node index

// 定时运行
$ pm2 start index.js --cron '*/5 * * * *' --no-autorestart
```

## 阿里云 DNS 解析 API 文档

> 进入 https://ram.console.aliyun.com/users 创建用户，选中以下权限: 
> - 只读访问HTTPDNS的权限 
> - 管理HTTPDNS的权限
> - 只读访问云解析(DNS)的权限
> - 管理云解析(DNS)的权限

- https://help.aliyun.com/document_detail/124923.html
- https://api.aliyun.com/#/?product=Alidns&api=AddDomainRecord

## PM2 定时任务

```
// 每 5 分钟执行一次
pm2 start index.js --cron '*/5 * * * *' --no-autorestart
```
> https://crontab.guru/