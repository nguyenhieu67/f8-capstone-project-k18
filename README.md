# EduFlow CRM

Hệ thống quản lý trung tâm đào tạo (CRM): quản lý nguồn khách hàng (source), lead, học viên (student), lớp học (classe), nhân viên (employee), điểm danh và bảng lương.

## Công nghệ sử dụng

**Backend (`api/`)**

- Node.js, Express 5, TypeScript
- TypeORM + PostgreSQL
- JWT (access token + refresh token) cho xác thực
- class-validator / class-transformer cho validate request body
- Swagger (`swagger-jsdoc` + `swagger-ui-express`) cho tài liệu API

**Frontend (`web/`)**

- React 19 + Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

**Hạ tầng**

- Docker & Docker Compose (3 service: `api`, `web`, `db`)
- PostgreSQL 17

## Yêu cầu môi trường

- Docker & Docker Compose đã cài đặt
- (Tuỳ chọn) Node.js >= 20 nếu muốn chạy không qua Docker

## Cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/nguyenhieu67/f8-capstone-project-k18.git
cd f8-capstone-project-k18
```

### 2. Cấu hình biến môi trường

**Backend** — tạo file `api/.env`:

```env
# Database
DB_HOST=db
DB_PORT=5432
DB_USER_NAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=default

# Auth
AUTH_JWT_SECRET=your_jwt_secret_key
AUTH_ACCESS_TOKEN_TTL=3600
AUTH_REFRESHTOKEN_TTL=7
```

> `DB_HOST=db` phải trùng với tên service `db` khai báo trong `docker-compose.yml`. `DB_USER_NAME`/`DB_PASSWORD`/`DB_DATABASE` phải khớp với `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` trong `docker-compose.yml`.

**Frontend** — copy file mẫu có sẵn:

```bash
cp web/env.example web/.env
```

Rồi điền `VITE_API_URL` trỏ tới backend, ví dụ:

```env
VITE_API_URL="http://localhost:3000"
```

### 3. Cài đặt dependencies

```bash
docker compose run --rm web npm i
docker compose run --rm api npm i
```

### 4. Khởi tạo schema database

Database khởi động lần đầu sẽ chưa có bảng nào. Import file `exp.sql` (chứa toàn bộ `CREATE TYPE`/`CREATE TABLE`) vào Postgres, ví dụ:

```bash
docker compose up -d db
docker compose exec -T db psql -U postgres -d default < exp.sql
```

### 5. Khởi chạy toàn bộ dự án

```bash
docker compose up
```

## Truy cập

| Service                     | URL                            |
| --------------------------- | ------------------------------ |
| API                         | http://localhost:3000          |
| API Documentation (Swagger) | http://localhost:3000/api-docs |
| Web                         | http://localhost:5001          |
| PostgreSQL                  | localhost:8001                 |

## Cấu trúc thư mục

```
.
├── api/                        # Backend - Express + TypeORM
│   └── src/
│       ├── config/             # Kết nối DB, biến môi trường, constants
│       ├── controllers/        # Xử lý request/response
│       ├── services/           # Business logic, truy vấn DB
│       ├── entities/           # TypeORM entities (map với bảng DB)
│       ├── dtos/                # class-validator DTO cho từng route
│       ├── middlewares/        # authRequired, customResponse, handleError
│       ├── routes/             # Khai báo route + swagger doc
│       ├── validations/        # ValidationPipe dùng chung
│       └── utils/              # Helper (AppError, randomString...)
├── web/                         # Frontend - React + Vite
│   └── src/
├── exp.sql                      # Schema database (DDL đầy đủ)
└── docker-compose.yml
```

## Kiến trúc Backend

Áp dụng kiến trúc 5 tầng: **Route → Middleware → Controller → Service → Model (Entity)**

- `BaseController` / `BaseService`: cung cấp CRUD dùng chung (`getList`, `getOne`, `create`, `updateById`, `deleteById`), các entity con override khi cần thêm logic riêng (VD: `ClasseService` validate `trainer_id`, `StudentService` validate `lead_id`).
- Soft-delete mặc định (`is_active`, `deleted_at`) cho các entity kế thừa `BaseEntity`; `RefreshTokenEntity` dùng `SimpleEntity` (không soft-delete) vì bản chất tự hết hạn.
- Xác thực bằng JWT: access token (ngắn hạn) + refresh token (lưu DB, dài hạn, có thể thu hồi qua `revoked_at`).
- Xử lý lỗi tập trung qua middleware `handleError` + class `AppError` (throw kèm status code cụ thể: 400, 401, 404, 409...).

## Các module API chính

| Resource  | Endpoint                                                                              | Yêu cầu đăng nhập |
| --------- | ------------------------------------------------------------------------------------- | ----------------- |
| Auth      | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh-token`, `GET /auth/me` | Không (trừ `/me`) |
| Users     | `GET/PUT/DELETE /users`, `/users/:id`                                                 | Có                |
| Sources   | `GET/POST/PUT/DELETE /sources`                                                        | Có                |
| Employees | `GET/POST/PUT/DELETE /employees`                                                      | Có                |
| Classes   | `GET/POST/PUT/DELETE /classes`                                                        | Có                |
| Leads     | `GET/POST/PUT/DELETE /leads`                                                          | Có                |
| Students  | `GET/POST/PUT/DELETE /students`                                                       | Có                |

Xem chi tiết request/response schema tại `/api-docs` sau khi chạy dự án.

## Scripts

**Backend (`api/`)**

```bash
npm run dev    # tsc --noEmit (check type) + chạy server qua tsx --watch
```

**Frontend (`web/`)**

```bash
npm run dev       # chạy dev server (Vite)
npm run build     # build production
npm run lint       # kiểm tra lint
npm run preview    # preview bản build
```
