# 云函数运行时

## 快速开始

```bash
# 运行
yarn start

# 请求示例
curl --location --request POST 'localhost:3000/inner-cgi/invoke' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "module.exports = (a, b) => a + b",
    "args": [
        1,
        2
    ]
}'
```
