#!/bin/bash

VM_NAME="fv4bquf2kk0osq7t2qgn"


ENV_CONTENT=$(base64 -w 0 .env)

cat > cloud-init.yaml << EOF
#cloud-config
bootcmd:
  - curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  - apt-get install -y nodejs git postgresql-client python3 make g++ build-essential
  - npm install -g pm2 @nestjs/cli

  - cd /root
  - git clone https://github.com/vladislavshiptenko/m3301-shiptenko-vladislav.git app || (cd app && git pull)
  - cd app
  - echo "$ENV_CONTENT" | base64 -d > .env

  - npm install @apollo/server@4.12.2
  - npm install @aws-sdk/client-s3@3.891.0
  - npm install @aws-sdk/s3-request-presigner@3.891.0
  - npm install @nestjs/apollo@13.1.0
  - npm install @nestjs/cache-manager@3.0.1
  - npm install @nestjs/common@11.1.6
  - npm install @nestjs/config@4.0.2
  - npm install @nestjs/core@11.1.6
  - npm install @nestjs/graphql@13.1.0
  - npm install @nestjs/jwt@11.0.0
  - npm install @nestjs/mapped-types@2.1.0
  - npm install @nestjs/passport@11.0.5
  - npm install @nestjs/platform-express@11.1.6
  - npm install @nestjs/serve-static@5.0.3
  - npm install @nestjs/swagger@11.2.0
  - npm install @prisma/client@6.16.1
  - npm install bcrypt@6.0.0
  - npm install class-transformer@0.5.1
  - npm install class-validator@0.14.2
  - npm install express-handlebars@8.0.3
  - npm install graphql@16.11.0
  - npm install multer@2.0.2
  - npm install passport-jwt@4.0.1
  - npm install passport-local@1.0.0
  - npm install passport@0.7.0
  - npm install pg@8.16.3
  - npm install prisma@6.16.1
  - npm install reflect-metadata@0.2.2
  - npm install rxjs@7.8.2
  - npm install source-map-support@0.5.21
  - npm install supertokens-auth-react@0.50.0
  - npm install supertokens-node@23.0.1
  - npm install supertokens-web-js@0.16.0
  - npm install swagger-ui-express@5.0.1
  - npm install toastr@2.1.4
  - npm install typescript@5.9.2

  - npm install -D @types/bcrypt@6.0.0
  - npm install -D @types/express@5.0.3
  - npm install -D @types/jest@30.0.0
  - npm install -D @types/multer@2.0.0
  - npm install -D @types/node@22.18.3
  - npm install -D @types/passport-jwt@4.0.1
  - npm install -D @types/passport-local@1.0.38
  - npm install -D @types/supertest@6.0.3
  - npm install -D @nestjs/testing@11.1.6
  - npm install -D jest@30.0.5
  - npm install -D prettier@3.6.2
  - npm install -D supertest@7.1.4
  - npm install -D ts-jest@29.4.1
  - npm install -D ts-loader@9.5.2
  - npm install -D ts-node@10.9.2
  - npm install -D tsconfig-paths@4.2.0
  - npm install -D typescript-eslint@8.40.0
  - npm install -D eslint@9.34.0
  - npm install -D eslint-config-prettier@10.1.8
  - npm install -D eslint-plugin-prettier@5.5.4
  - npm install graphql-playground-middleware-express@1.7.23 --force

  - npx prisma db push

  - npm run build

  - export HOME=/root
  - pm2 delete nestjs-app || true
  - pm2 start dist/main.js --name "nestjs-app" --instances 2 2>&1 | tee -a /var/log/deploy.log
  - pm2 save 2>&1 | tee -a /var/log/deploy.log

  - env HOME=/root pm2 startup systemd -u root --hp /root 2>&1 | tee -a /var/log/deploy.log
EOF

sed -i "s/\$ENV_CONTENT/$ENV_CONTENT/" cloud-init.yaml

yc compute instance add-metadata $VM_NAME --metadata-from-file user-data=cloud-init.yaml

yc compute instance restart $VM_NAME

sleep 60
VM_IP=$(yc compute instance get $VM_NAME --format json | jq -r '.network_interfaces[0].primary_v4_address.one_to_one_nat.address')

echo "✅ Деплой завершен!"
echo "🌐 IP: $VM_IP"
echo "🔗 Приложение: http://$VM_IP:5000"
echo "📚 Swagger: http://$VM_IP:5000/api"
echo "🎯 GraphQL: http://$VM_IP:5000/graphql"
