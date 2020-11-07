# Open Sauce Authorisation API

## Auth:

- Register User **/api/user/register**

  - POST - Access level: 0
    - username: string 6-16 char required
    - password: string 6-32 char required
    - email: string email 6-32 char required
    - name: string 3-32 char required

- Login **/api/user/login**

  - POST - Access level: 0
    - username: string 6-16 char required
    - password: string 6-32 char required
  - RETURN - Header: `auth-token: TOKEN`

- Change Password **/api/user/changepassword**
  - POST - Access level: 1
    - newpassword: string 6-32 char required

## Posts:

- New Post **/api/post/new**
  - POST - Access level: 5
    - title: string 8-32 char required
    - body: string 8-4096 char required
    - image: string -256 char optional

## Users:

- Get User data **/api/data/userinfo/**

  - GET - Access level: 1
    - null

- Set User data \*\*
