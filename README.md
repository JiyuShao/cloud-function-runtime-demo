# 云函数运行时 DEMO

## 快速开始

```bash
# 安装
yarn install

# 运行
yarn start

# 请求示例
curl --location --request POST 'localhost:8080/inner-cgi/invoke' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "(a, b) => a + b",
    "args": [
        1,
        2
    ]
}'
```
