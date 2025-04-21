npm create vite@latest vite-redmine-ish -- --template react-ts

  cd vite-redmine-ish
  npm install
  npm run dev

npm run build
docker build -t vite-redmine-ish-app .
docker tag vite-redmine-ish-app localhost:32000/vite-redmine-ish-app:latest
docker push localhost:32000/vite-redmine-ish-app:latest
microk8s kubectl rollout restart deploy vite-redmine-ish-app -n go-redmine-ish
-----------------

https://erp.mydomain.com/

-----------------
npm install react-bootstrap
npm install react-icons
npm install react-query ??????
npm install dayjs
npm install bootswatch
npm install bootstrap
npm install prettier --save-dev

npm install --save react@19 react-dom@19
npm install --save react-bootstrap@2
npm install --save typescript@5
npm install --save-dev typescript-eslint
npm install --save-dev @types/react@19 @types/react-dom@19
npm install --save-dev @eslint/js eslint eslint-plugin-react-refresh
npm install --save-dev globals prettier
npm install --save react-router-dom@6
npm install --save vite@6
----------

npm outdated

npm add -D sass-embedded
