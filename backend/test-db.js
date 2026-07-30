process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:oMMpkgGdbQCrjiCcdVvnlUwLkrOijYXi@sakura.proxy.rlwy.net:30082/railway?sslmode=no-verify'
    }
  }
});
p.$connect()
  .then(() => { console.log('DB OK'); return p.$disconnect(); })
  .catch(e => console.error('DB FAIL:', e.message));
