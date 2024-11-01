# Simplest News Api

Postman Docs:
[![Run in Postman](https://run.pstmn.io/button.svg)](NewsApiDocs.postman_collection.json)


# Running the Application

Follow these steps to run the application:

1. Run `npm install` to install dependencies.
2. Run `npx prisma migrate reset` to migrate the database.
3. Run `node prisma/seed.js` to initialize with dummy data. The username and password can be found in the file.
4. Finally, run the entry point using `node serve.js`.

## Unit & Integration Test

`npm test tests/`

```plaintext
PASS tests/hash.test.js
  Hash Password and Decrypt Password
    ✓ should hash the password (112 ms)
    ✓ should decrypt the password (56 ms)
    ✓ should not decrypt with wrong password (56 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.345 s, estimated 1 s

 PASS  tests/token.test.js
  Token Functions
    CreateToken
      ✓ should create a valid token (4 ms)
    ParseToken
      ✓ should parse a valid token (1 ms)
      ✓ should throw an error for an invalid token (4 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.246 s, estimated 1 s

 PASS  tests/service_auth.test.js
  POST /v1/auth/login
    ✓ should can login (279 ms)
    ✓ should reject login if request is invalid (62 ms)
    ✓ should reject login if password is wrong (119 ms)
    ✓ should reject login if username is wrong (61 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.9 s, estimated 1 s

 PASS  tests/service_category.test.js
  Category API Tests
    ✓ should create a new category (45 ms)
    ✓ should retrieve a category by ID (10 ms)
    ✓ should retrieve category by ID Not Found (5 ms)
    ✓ should retrieve all categories (3 ms)
    ✓ should update a category by ID (11 ms)
    ✓ should delete a category by ID (17 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.719 s, estimated 1 s
Ran all test suites matching /tests\//i.
```

# Endpoint:

[**Admin**](#admin)

- [Simplest News Api](#simplest-news-api)
- [Running the Application](#running-the-application)
  - [Unit \& Integration Test](#unit--integration-test)
- [Endpoint:](#endpoint)
    - [Login](#login)
  - [--- Admin Role ---](#----admin-role----)
    - [Create Category](#create-category)
    - [Update Category](#update-category)
    - [Delete Category](#delete-category)
  - [--- Users/Visitors Role ---](#----usersvisitors-role----)
    - [Get Category By ID](#get-category-by-id)
    - [Get Category](#get-category)
  - [--- Admin Role ---](#----admin-role-----1)
    - [Create News](#create-news)
    - [Update News](#update-news)
    - [Delete News](#delete-news)
  - [--- Users/Visitors Role ---](#----usersvisitors-role-----1)
    - [Get News By ID](#get-news-by-id)
    - [Get News](#get-news)
    - [Search News](#search-news)

### Login

- Endpoint
  - /v1/auth/login
- Method
  - POST
- Request Body
  - username = string
  - password = string , min 6
- Response

```json
{
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzMwMzc3NzEzLCJleHAiOjE3MzAzNzgzMTN9.BJHoYGJ3fgGRJswLo4pfA82MJ2BBmTIihv-W55iEUlc",
        "user": {
            "id": 5,
            "username": "test_admin"
        }
    },
    "code": 200,
    "message": "Login successful"
}
```

## --- Admin Role ---


### Create Category
- Endpoint
  - /v1/categories 
- Method
  - POST
- Request Header
  - Authorization: Bearer token 
- Request Body
  - name = string (Unique)
- Response
```json
{
    "data": {
        "id": 11,
        "name": "Politics",
        "createdAt": "2024-10-31T14:02:25.797Z"
    },
    "code": 201,
    "message": "Created"
}
```

### Update Category
- Endpoint
  - /v1/categories/{id_category}
- Method
  - PUT
- Request Header
  - Authorization: Bearer token 
- Request Body
  - name = string (Unique)
- Response
```json
{
    "data": {
        "id": 11,
        "name": "Sporttations",
        "createdAt": "2024-10-31T14:02:25.797Z"
    },
    "code": 200,
    "message": "Updated"
}
```

### Delete Category
- Endpoint
  - /v1/categories/{id_category}
- Method
  - DELETE
- Request Header
  - Authorization: Bearer token 
- Request Body
  - id_category = integer
- Response
```json
{
    "data": {
        "id": 11,
        "name": "Sporttations",
        "createdAt": "2024-10-31T14:02:25.797Z"
    },
    "code": 200,
    "message": "Deleted"
}
```

## --- Users/Visitors Role ---

### Get Category By ID
- Endpoint
  - /v1/categories/{id_category}
- Method
  - GET
- Response
```json
{
    "data": {
        "id": 12,
        "name": "Sports",
        "createdAt": "2024-10-31T14:03:50.057Z"
    },
    "code": 200,
    "message": "Ok"
}
```

### Get Category
- Endpoint
  - /v1/categories
- Method
  - GET
- Response
```json
{
    "data": [
        {
            "id": 9,
            "name": "UpUC_1730378058260",
            "createdAt": "2024-10-31T12:34:18.259Z"
        },
        {
            "id": 12,
            "name": "Sports",
            "createdAt": "2024-10-31T14:03:50.057Z"
        }
    ],
    "code": 200,
    "message": "Ok"
}
```

## --- Admin Role ---

### Create News
- Endpoint
  - /v1/news 
- Method
  - POST
- Request Header
  - Authorization: Bearer token 
- Request Body
  - title = string (Unique)
  - content = string
  - category_id = integer
- Response
```json
{
    "data": {
        "id": 3,
        "title": "YOOOOOOO",
        "content": "YESSS.",
        "published_by": 1,
        "published_at": "2024-10-31T14:52:25.149Z",
        "updated_at": "2024-10-31T14:52:25.149Z",
        "category_id": 2
    },
    "code": 201,
    "message": "Created"
}
```

### Update News
- Endpoint
  - /v1/news/{id_news}
- Method
  - PUT
- Request Header
  - Authorization: Bearer token 
- Request Body
  - title = string (Unique)
  - content = string
  - category_id = integer
- Response
```json
{
    "data": {
        "id": 2,
        "title": "Oaoe kapiten",
        "content": "aku adalah seorang kapitenkapitenkapiten",
        "published_by": 1,
        "published_at": "2024-10-31T14:49:57.144Z",
        "updated_at": "2024-10-31T14:51:25.564Z",
        "category_id": 2
    },
    "code": 200,
    "message": "Updated"
}
```

### Delete News
- Endpoint
  - /v1/news/{id_news}
- Method
  - DELETE
- Request Header
  - Authorization: Bearer token 
- Request Body
  - id_news = integer
- Response
```json
{
    "data": {
        "id": 3,
        "title": "YOOOOOOO",
        "content": "YESSS.",
        "published_by": 1,
        "published_at": "2024-10-31T14:52:25.149Z",
        "updated_at": "2024-10-31T14:52:25.149Z",
        "category_id": 2
    },
    "code": 200,
    "message": "Deleted"
}
```

## --- Users/Visitors Role ---

### Get News By ID
- Endpoint
  - /v1/news/{id_news}
- Method
  - GET
- Response
```json
{
    "data": {
        "id": 2,
        "title": "Oaoe kapiten",
        "content": "aku adalah seorang kapitenkapitenkapiten",
        "published_by": 1,
        "published_at": "2024-10-31T14:49:57.144Z",
        "updated_at": "2024-10-31T14:51:25.564Z",
        "category_id": 2
    },
    "code": 200,
    "message": "Updated"
}
```

### Get News
- Endpoint
  - /v1/news
- Method
  - GET
- Response
```json
{
    "data": [
        {
            "id": 1,
            "title": "Fafifu",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            "published_by": 1,
            "published_at": "2024-10-31T14:49:25.954Z",
            "updated_at": "2024-10-31T14:49:25.954Z",
            "category_id": 1
        },
        {
            "id": 2,
            "title": "Oaoe kapiten",
            "content": "aku adalah seorang kapitenkapitenkapiten",
            "published_by": 1,
            "published_at": "2024-10-31T14:49:57.144Z",
            "updated_at": "2024-10-31T14:51:25.564Z",
            "category_id": 2
        }
    ],
    "code": 200,
    "message": "Ok"
}
```

### Search News
- Endpoint
  - /v1/news/search?query={want to search for}
- Method
  - GET
- Response
```json
{
    "data": [
        {
            "id": 1,
            "title": "Fafifu",
            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            "published_by": 1,
            "published_at": "2024-10-31T14:49:25.954Z",
            "updated_at": "2024-10-31T14:49:25.954Z",
            "category_id": 1
        }
    ],
    "code": 200,
    "message": "Ok"
}
```

Written By:
 - Anugrah Tri Ramadhan (ramareksotinoyo@gmail.com)  