# API Interface

- base url: https://chat.moveflow.xyz/

 
### Request Sarah@StreamingAI Chat Botxhjb
#### Request
- Method: **POST**
- URL:  
    - :  ```https://chat.moveflow.xyz/api/chat/sarah```
- Params
    account: string, default: '0x' 
    msg: string, default: 'hello' 

#### Response:

```
{
    "code": 200,                        // status code,  200 is success，or other code is failed
    "msg": "hello , I'm Sarah ... "
}
```
 


### Request Jimmy@Finance Chat Bot
#### Request
- Method: **POST**
- URL:  
    - :  ```https://chat.moveflow.xyz/api/jimmy```
- Params
    account: string, default: '0x' 
    msg: string, default: 'hello' 

#### Response:

```json
{
    "code": 200,                        // status code,  200 is success，or other code is failed
    "msg": "hello , I'm jimmy ... "
}
```


ex:

    ```js
    let res = await fetch("http://localhost:3000/api/chat/sarah", {
        "body": "{\"account\":\"0x\",\"msg\":\"hello\"}",
        "method": "POST",
    });
    ```


 