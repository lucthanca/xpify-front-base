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

### Cài đặt template

Template chạy trên Shopify CLI 3.0, một package bạn có thể thêm vào trong projecc. Có thể cài nó dùng package manager:

Dùng yarn:

```shell
yarn create @shopify/app --template <url_của_repo_này>
```
Dùng npx:

```shell
npm init @shopify/app@latest -- --template <url_của_repo_này>
```

Điều này sẽ clone template và cài cli vào project.

### Làm việc với template

[Shopify CLI](https://shopify.dev/docs/apps/tools/cli) sẽ kết nối App với tài khoản partner của bạn.
Nó cung cấp các biến môi trường, chạy các lệnh, cập nhật app để phát triển một cách nhanh chóng.

lần đầu sau khi đã cài đặt template:
1. đầu tiên hãy cd vào project
1. copy file `shopify.app.toml.example` và đổi tên thành `shopify.app.toml`
1. chạy lệnh `yarn dev --reset` hoặc `npm run dev --reset` đối với lần đầu để khởi tạo config cho app.

các lần sau đó bạn có thể phát triển trên môi trường local sử dụng một trong các lệnh sau đây:

Sử dụng yarn (khuyên dùng):

```shell
yarn dev
```
dùng npm:

```shell
npm run dev
```

Mở URL được tạo trong cmd. Sau khi cấp quyền cho app, bạn có thể bắt đầu dev được rồi.

### Build

Đang cập nhật...