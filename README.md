## FaceYelp Client

### Documents
- [FaceYelp API](http://18.210.174.179:8000/docs/)

### Dev Environment Setup
1. Make sure you are on an X86-64 or ARMv8 based machine with GLIBC >=2.28 installed
2. Install nvm
```
https://github.com/nvm-sh/nvm
```
3. Restart shell to make sure nvm is enabled
4. Install and enable latest LTS versions of NodeJS
```
nvm install --lts
nvm use --lts
```
5. Enable Yarn with Corepack
```
corepack enable
```
6. Clone FaceYelp-Client repository.
7. In src folder, make a copy of config.default.js and rename to config.js. (Ask William for details)
```
cp src/config.default.js src/config.js
```
8. Install dependencies using Yarn
```
yarn install
```
9. NOTE: The React Client will not function without an operational FaceYelp API Server and Database Server. API Server and Database Server will be fully operational on AWS EC2 instances until 01/10/2023.
10. Start the application
```
yarn start
```
11. The app will automatically launch on http://localhost:3000
12. (ONLY FOR PRODUCTION) To deploy to production, please build the app and serve it statically with Nginx
```
yarn build
```
