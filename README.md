# Shopify App Template - Xpify

Đây là một template để xây dựng một [Shopify app](https://shopify.dev/docs/apps/getting-started) sử dụng React, kết nối với backend thông qua GraphQl API. Nó chứa các cơ bản để xây dựng một Shopify app.

Thay vì clone repo này, bạn có thể sử dụng package manager và Shopify CLI với [các bước sau](#installing-the-template).

## Lợi ích

App template này đi kèm với các tính năng sau:

-   OAuth: Cài đặt App và cấp quyền truy cập
-   GraphQL Admin API: Truy vấn hoặc thay đổi dữ liệu admin
-   REST Admin API: Các tài nguyên để tương tác với API
-   Các công cụ dành riêng cho Shopify:
    -   AppBridge
    -   Polaris
    -   Webhooks

## Bắt đầu
### Requirements
1. Bạn cần [tạo tài khoản Shopify partner](https://partners.shopify.com/signup) nếu như chưa có.
1. Bạn cần tạo một [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) nếu chưa có.
1. Bạn cần cài đặt [Node.js](https://nodejs.org/en/) phiên bản 18.17.0 hoặc cao hơn (nên sử dụng v20.10.0 vì lúc làm cái này mình dùng v20 :)).
1. Bạn cần cài đặt Npm hoặc [Yarn](https://classic.yarnpkg.com/en/docs/install) phiên bản 1.22.10 hoặc cao hơn.

### Cài đặt template

Template chạy trên Shopify CLI 3.0, một package bạn có thể thêm vào trong projecc. Có thể cài nó dùng package manager:

```shell
npm init @shopify/app@3.57.0 -- --template <url_của_repo_này>
```

Điều này sẽ clone template và cài cli vào project.

### Làm việc với template

[Shopify CLI](https://shopify.dev/docs/apps/tools/cli) sẽ kết nối App với tài khoản partner của bạn.
Nó cung cấp các biến môi trường, chạy các lệnh, cập nhật app để phát triển một cách nhanh chóng.

lần đầu sau khi đã cài đặt template:
1. đầu tiên hãy cd vào project
1. copy file `shopify.app.toml.example` và đổi tên thành `shopify.app.toml`
1. chạy lệnh `npm install`
1. chạy lệnh `touch .env`
1. chạy lệnh `npm run dev -- --reset` đối với lần đầu để khởi tạo config cho app.

các lần sau đó bạn có thể phát triển trên môi trường local sử dụng lệnh sau đây:

```shell
npm run dev
```

Mở URL được tạo trong cmd. Sau khi cấp quyền cho app, bạn có thể bắt đầu dev được rồi.

### Build

Đang cập nhật...
=======
Mở URL được tạo trong cmd. Sau khi cấp quyền cho app, bạn có thể bắt đầu dev được rồi.

#### Cài đặt thủ công

1. Clone repo này
1. copy file `shopify.app.toml.example` và đổi tên thành `shopify.app.toml`
1. chạy lệnh `npm install`
1. chạy lệnh `touch .env`
1. chạy lệnh `npm run dev -- --reset` đối với lần đầu để khởi tạo config cho app.

### Build

`npm run build`

* Khi config nginx server cho site react, cần include thêm file nginx.conf trong thư mục root của project
* Chỉnh sửa backend url trong file nginx.conf và `X-Xpify-App-Token` hợp lệ

### Các vấn đề đã biết

#### Dev trên server

Khi chạy dev trên server, shopify cli cần login để xác thực. Nhưng trên server thì không popup login giống ở trên local được

Cách giải quyết chính là sử dụng `SHOPIFY_CLI_PARTNERS_TOKEN`.

1. Truy cập vào [Shopify Partners](https://partners.shopify.com/organizations)
1. Chọn partner account. Sau đó vào Settings > CLI Token > Manage tokens
1. Tạo 1 token mới. Sau đó copy token đó.
1. Khi chạy lệnh `npm run dev -- --reset` hoặc `npm run dev` thì thêm `SHOPIFY_CLI_PARTNERS_TOKEN=<token_vừa_copy>` vào trước lệnh.
   ví dụ
```shell
SHOPIFY_CLI_PARTNERS_TOKEN=asdasasdamnasmbnkjghlkshd npm run dev -- --reset
```
