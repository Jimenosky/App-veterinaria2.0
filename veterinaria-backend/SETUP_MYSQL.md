# ⚙️ Configuración de MySQL para Veterinaria

## 🔴 ERROR: MySQL No está corriendo

El sistema detectó que MySQL no está disponible en `localhost:3306`.

### ✅ SOLUCIÓN PASO A PASO

#### **Paso 1: Iniciar MySQL en Windows**

Opción A - Con MySQL Workbench:
1. Abre **MySQL Workbench**
2. Busca y haz clic en **Local instance MySQL80** (o tu versión)
3. Debería iniciar el servidor automáticamente

Opción B - Con Servicios de Windows:
```powershell
# En PowerShell como Administrador:
Get-Service MySQL80 | Start-Service
```

Opción C - Línea de comandos:
```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
```

#### **Paso 2: Verificar que MySQL está corriendo**

```powershell
# En PowerShell:
Test-NetConnection -ComputerName localhost -Port 3306
```

Deberías ver: `TcpTestSucceeded : True`

#### **Paso 3: Crear base de datos `usuarios_db`**

En **MySQL Workbench**, ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS usuarios_db;
USE usuarios_db;
```

#### **Paso 4: Verificar conexión desde Node.js**

```bash
cd veterinaria-backend
node -e "
const mysql = require('mysql2/promise');
mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Doky2021',
  database: 'usuarios_db',
  port: 3306
}).getConnection().then(conn => {
  console.log('✅ Conexión exitosa a MySQL');
  conn.release();
  process.exit(0);
}).catch(err => {
  console.log('❌ Error:', err.message);
  process.exit(1);
});
"
```

#### **Paso 5: Ejecutar seed**

Cuando MySQL esté corriendo:

```bash
cd veterinaria-backend
npm run seed
```

---

## 🔧 Checklis de Configuración

- [ ] MySQL Server está instalado
- [ ] Servicio MySQL está corriendo
- [ ] Puedes conectarte con user: `root`, password: `Doky2021`
- [ ] Base de datos `usuarios_db` existe
- [ ] Credenciales están correctas en `.env`
- [ ] Node.js puede conectarse a MySQL
- [ ] Seed ha creado usuarios de prueba

---

## 📝 Archivo .env Correcto

```
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Doky2021
DB_NAME=usuarios_db

API_PREFIX=/api/v1

JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h
```

---

## 🚀 Comandos a Ejecutar (en orden)

```bash
# 1. Verificar MySQL está corriendo
Test-NetConnection -ComputerName localhost -Port 3306

# 2. Crear base de datos (en MySQL Workbench o CLI)
CREATE DATABASE usuarios_db;

# 3. Instalar dependencias
npm install

# 4. Crear usuarios de prueba
npm run seed

# 5. Iniciar servidor
npm start
```

---

## ❓ Solución de Problemas

### ❌ "ECONNREFUSED"
- MySQL no está corriendo
- Revisa los pasos 1-2 arriba

### ❌ "ER_ACCESS_DENIED_FOR_USER"
- Contraseña incorrecta
- Verifica que es `Doky2021` en `.env`

### ❌ "ER_BAD_DB_ERROR"
- Base de datos no existe
- Ejecuta: `CREATE DATABASE usuarios_db;`

### ❌ "PROTOCOL_CONNECTION_LOST"
- Conexión perdida con MySQL
- Reinicia el servicio MySQL

---

## 💡 Alternativas

Si no tienes MySQL instalado:

**Opción 1: Instalar MySQL Community Server**
- Descarga desde: https://dev.mysql.com/downloads/mysql/
- Sigue el wizard de instalación

**Opción 2: Usar Docker**
```bash
docker run --name mysql-veterinaria \
  -e MYSQL_ROOT_PASSWORD=Doky2021 \
  -e MYSQL_DATABASE=usuarios_db \
  -p 3306:3306 \
  -d mysql:8.0
```

Luego ejecuta:
```bash
npm run seed
npm start
```

---

**Una vez que MySQL esté corriendo, el backend funcionará perfectamente! 🚀**
