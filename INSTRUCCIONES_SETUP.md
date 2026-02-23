# 🏥 Sistema Veterinaria - Instrucciones de Setup

## 📋 Descripción del Proyecto

Sistema completo de gestión veterinaria con:
- **Backend API**: Node.js + Express + PostgreSQL (Neon)
- **Panel Admin Web**: React + Vite
- **App Móvil**: React Native + Expo (Panel Cliente y Admin)

## 🌐 Servicios en Producción

- **Backend API**: https://api-express-mysql-de-jime.onrender.com
- **Base de Datos**: PostgreSQL en Neon (ya configurada)
- **Panel Admin Web**: Pendiente de desplegar en Netlify

## 👥 Usuarios de Prueba

### Admin
- Email: `admin@veterinaria.com`
- Contraseña: `password123`

### Cliente
- Email: `cliente@ejemplo.com`
- Contraseña: `cliente123`

## 🚀 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Jimenosky/App-veterinaria2.0.git
cd App-veterinaria2.0
```

### 2. Backend (veterinaria-backend)

```bash
cd veterinaria-backend
npm install
```

**Crear archivo `.env`:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_24ygwNfLnoCU@ep-snowy-mouse-ai2qasyt-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
PORT=3001
```

**Iniciar servidor local:**
```bash
node server.js
```

El servidor estará en: http://localhost:3001

### 3. Panel Admin Web (veterinaria-admin)

```bash
cd veterinaria-admin
npm install
npm run dev
```

El panel estará en: http://localhost:5173

### 4. App Móvil Cliente/Admin (App-veterinaria-sin-error-web)

**Requisitos previos:**
- Tener instalado Node.js 18+
- Tener instalado Expo Go en tu teléfono

```bash
cd App-veterinaria-sin-error-web
npm install
npx expo start
```

Escanea el código QR con:
- **Android**: Expo Go app
- **iOS**: Cámara del iPhone

## 📁 Estructura del Proyecto

```
App-veterinaria2.0/
├── veterinaria-backend/         # API Backend
│   ├── config/                  # Configuración DB
│   ├── routes/                  # Endpoints API
│   ├── middleware/              # Auth middleware
│   └── server.js                # Entrada principal
├── veterinaria-admin/           # Panel Admin Web
│   └── src/
│       ├── pages/               # Páginas React
│       └── components/          # Componentes reutilizables
└── App-veterinaria-sin-error-web/  # App Móvil
    └── app/
        ├── (tabs)/              # Panel Cliente
        └── admin/               # Panel Admin Móvil
```

## 🔧 Funcionalidades Implementadas

### ✅ Backend API
- [x] Login/Registro con JWT
- [x] CRUD de Usuarios
- [x] CRUD de Mascotas (con campo color)
- [x] CRUD de Citas
- [x] Estadísticas del dashboard
- [x] Middleware de autenticación admin/cliente

### ✅ Panel Admin Web
- [x] Login
- [x] Dashboard con estadísticas
- [x] Gestión de usuarios
- [x] Gestión de mascotas (con info del dueño)
- [x] Gestión de citas

### ✅ App Móvil - Panel Cliente
- [x] Login/Registro
- [x] Pantalla de bienvenida
- [x] Dashboard home
- [x] Gestión de mascotas (crear, editar, ver)
- [x] Gestión de citas
- [x] Historial médico
- [x] Tratamientos
- [x] Perfil de usuario
- [x] Sidebar navigation

### ✅ App Móvil - Panel Admin
- [x] Dashboard con estadísticas
- [x] Ver todos los usuarios
- [x] Ver todas las mascotas
- [x] Ver todas las citas
- [x] Perfil admin

## 🐛 Problemas Comunes y Soluciones

### Error: "Token inválido"
- Verifica que el JWT_SECRET sea el mismo en local y en Render
- Cierra sesión y vuelve a iniciar

### Error: "Cannot find module"
- Ejecuta `npm install` de nuevo
- Borra `node_modules` y reinstala: `rm -rf node_modules && npm install`

### Error en PostgreSQL
- Verifica que DATABASE_URL esté correcta
- Asegúrate de que incluye `?sslmode=require`

### App móvil no conecta con API
- Verifica que la URL de la API en el código sea correcta
- Para desarrollo local, usa la IP de tu computadora: `http://192.168.x.x:3001`

## 🔄 Actualizar el Backend en Render

1. Haz tus cambios localmente
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Tu mensaje"
   git push
   ```
3. Render detectará los cambios y hará deploy automático (tarda 2-5 min)
4. O fuerza deploy manual en dashboard.render.com

## 📱 Desplegar Panel Admin Web en Netlify

1. Ve a https://app.netlify.com
2. Conecta tu repositorio de GitHub
3. Configuración:
   - Base directory: `veterinaria-admin`
   - Build command: `npm run build`
   - Publish directory: `veterinaria-admin/dist`
4. Deploy!

## 📝 Próximas Tareas Sugeridas

- [ ] Implementar CRUD completo de Citas en app móvil
- [ ] Agregar notificaciones push
- [ ] Implementar paginación en las listas
- [ ] Agregar filtros y búsqueda
- [ ] Subir fotos de mascotas
- [ ] Historial médico detallado
- [ ] Recordatorios de citas

## 🤝 Colaboración

Para colaborar en el proyecto:

1. Clona el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m "Agregar nueva funcionalidad"`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request en GitHub

## 📞 Contacto

Si tienes dudas o problemas, revisa los archivos de test en `veterinaria-backend/test-*.js` que contienen ejemplos de uso de la API.

---

**Estado actual**: ✅ Sistema funcional y en producción
**Última actualización**: 23 de febrero de 2026
