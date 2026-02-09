# 🏥 Sistema Integral de Veterinaria - Programación IV Generación II

Un **sistema completo y profesional** que incluye App Móvil, Panel Administrativo Web y API Backend.

## 🎯 Objetivo del Proyecto

Extender el sistema administrativo web (construido en Programación IV Generación) hacia una aplicación móvil en React Native conectada al mismo API en Node.js, permitiendo que los usuarios finales puedan sacar citas desde sus dispositivos, reflejando automáticamente los cambios en el panel administrativo.

---

## 📱 Componentes del Sistema

### **1. Backend API (Node.js + Express)**
- Servidor RESTful con autenticación JWT
- Base de datos SQLite
- Gestión de usuarios, mascotas y citas
- CORS habilitado para todas las aplicaciones

### **2. Panel Administrativo (React + Vite)**
- Dashboard con estadísticas
- Gestión de citas y usuarios
- Interfaz responsive
- Autenticación de admin

### **3. App Móvil (React Native + Expo)**
- Login y registro de usuarios
- Perfil de usuario editable
- Sistema de citas
- Gestión de mascotas
- Sincronización con backend

---

## 🚀 INICIO RÁPIDO

### **Opción 1: Ejecución Manual (Recomendado)**

Abre **3 terminales** diferentes y ejecuta:

**Terminal 1 - Backend:**
```bash
cd veterinaria-backend
npm start
```

**Terminal 2 - Panel Admin:**
```bash
cd veterinaria-admin
npm run dev
```

**Terminal 3 - App Móvil:**
```bash
cd App-veterinaria-sin-error-web
npm start
```

### **Opción 2: Ejecución Automática (Windows)**
```bash
START.bat
```

### **Opción 3: Ejecución Automática (Linux/Mac)**
```bash
chmod +x START.sh
./START.sh
```

---

## 🔓 Credenciales de Prueba

### **Admin Panel**
```
Email: admin@veterinaria.com
Password: password123
```

### **Cliente Web/Mobile**
```
Email: cliente@ejemplo.com
Password: cliente123
```

O **registra un nuevo usuario** desde la app móvil

---

## 📍 URLs de Acceso

| Componente | URL |
|-----------|-----|
| Backend API | http://localhost:3001 |
| Admin Panel | http://localhost:5173 |
| App Móvil (web) | http://localhost:8081 |

---

## 📁 Estructura del Proyecto

```
react-native juntos/
│
├── veterinaria-backend/              # 🔧 Backend Node.js
│   ├── config/database.js            # Configuración SQLite
│   ├── middleware/auth.js            # Autenticación JWT
│   ├── routes/
│   │   ├── auth.js                  # Login, registro, perfil
│   │   ├── mascotas.js              # CRUD mascotas
│   │   └── citas.js                 # CRUD citas
│   ├── server.js                     # Punto de entrada
│   ├── seed.js                       # Script para datos iniciales
│   └── .env                          # Variables de entorno
│
├── veterinaria-admin/                # 🖥️ Panel Admin React
│   ├── src/
│   │   ├── api/apiClient.js         # Cliente HTTP
│   │   ├── context/AuthContext.jsx  # Contexto autenticación
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Página login
│   │   │   └── Dashboard.jsx        # Dashboard principal
│   │   ├── components/
│   │   │   ├── CitasTable.jsx       # Tabla citas
│   │   │   └── UsuariosTable.jsx    # Tabla usuarios
│   │   └── App.jsx                  # Rutas principales
│
├── App-veterinaria-sin-error-web/    # 📱 App Móvil React Native
│   ├── app/
│   │   ├── _layout.tsx              # Navegación principal
│   │   ├── login.tsx                # Pantalla login
│   │   ├── profile.tsx              # Pantalla perfil
│   │   └── (tabs)/
│   │       ├── index.tsx            # Pantalla inicio
│   │       └── explore.tsx          # Explorar funciones
│   ├── contexts/AuthContext.tsx     # Contexto autenticación
│   ├── components/
│   │   └── user-menu.tsx            # Menú usuario
│   └── app.json                     # Configuración Expo
│
├── GUIA_COMPLETA.md                 # 📖 Guía detallada
├── START.bat                        # 🪟 Ejecutar en Windows
├── START.sh                         # 🐧 Ejecutar en Linux/Mac
└── README.md                        # Este archivo
```

---

## 🔧 Funcionalidades Principales

### **Backend API**
- ✅ Autenticación con JWT (7 días de expiración)
- ✅ Hashing seguro de contraseñas con bcryptjs
- ✅ Validación de datos en solicitudes
- ✅ Rutas protegidas por rol (cliente/admin)
- ✅ CRUD completo: Usuarios, Mascotas, Citas
- ✅ Estados de cita: pendiente, confirmada, completada, cancelada

### **Panel Administrativo**
- ✅ Login seguro con validación de rol
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Tabla de citas con edición in-place
- ✅ Gestión de estado de citas
- ✅ Formulario para notas y costos
- ✅ Cierre de sesión

### **App Móvil**
- ✅ Registro de nuevos usuarios
- ✅ Login con persistencia
- ✅ Perfil de usuario con edición
- ✅ Datos guardados en AsyncStorage
- ✅ Menú de usuario con acciones rápidas
- ✅ Cierre de sesión seguro
- ✅ Interfaz responsive

---

## 📡 Endpoints de la API

### **Autenticación**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile
```

### **Mascotas**
```
GET    /api/v1/mascotas
POST   /api/v1/mascotas
GET    /api/v1/mascotas/:id
PUT    /api/v1/mascotas/:id
DELETE /api/v1/mascotas/:id
```

### **Citas**
```
GET    /api/v1/citas/user
GET    /api/v1/citas/admin/all
POST   /api/v1/citas
GET    /api/v1/citas/:id
PUT    /api/v1/citas/:id
POST   /api/v1/citas/:id/cancel
DELETE /api/v1/citas/:id
```

---

## 💾 Estructura de la Base de Datos

### **Tabla: usuarios**
```sql
id (PK) | nombre | email | password | telefono | direccion | rol | estado | fecha_creacion
```

### **Tabla: mascotas**
```sql
id (PK) | nombre | tipo | raza | edad | peso | usuario_id (FK) | fecha_creacion
```

### **Tabla: citas**
```sql
id (PK) | usuario_id (FK) | mascota_id (FK) | fecha | hora | tipo_servicio | 
descripcion | estado | costo | notas_admin | fecha_creacion
```

---

## ⚙️ Configuración y Conexión

### **Backend**
El servidor se ejecuta en `http://localhost:3001`

Archivo: `vegetinaria-backend/.env`
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_super_segura_2025
DATABASE_PATH=./database.sqlite
```

### **App Móvil - Conexión**
El sistema detecta automáticamente:
- **Web:** `http://localhost:3001`
- **Dispositivo Mobile:** `http://192.168.1.8:3001`

**Para usar tu IP local:**
Edita: `App-veterinaria-sin-error-web/contexts/AuthContext.tsx` línea 40

---

## 🐛 Solución de Problemas

### **Backend no conecta**
```bash
# Verifica que el puerto 3001 está libre
netstat -an | grep 3001

# Revisa que las dependencias estén instaladas
npm install
```

### **Admin Panel no muestra datos**
```bash
# Asegúrate estar logueado como admin
# Verifica la consola del navegador (F12)
# Revisa Network en DevTools para errores
```

### **App Móvil no conecta**
```bash
# Prueba en web primero:
# http://localhost:8081

# En dispositivo, cambia la IP en AuthContext.tsx
# Verifica que el backend está corriendo
npm start -p 3001
```

---

## 📚 Tecnologías Utilizadas

| Capa | Tecnología |
|------|-----------|
| **Backend** | Node.js v22.20.0, Express 4.18, SQLite3, JWT, bcryptjs |
| **Admin** | React 19, Vite 7, React Router, Axios |
| **Mobile** | React Native 0.81, Expo 54, React Navigation |
| **Databases** | SQLite (local) |

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs (salt rounds: 10)
- ✅ Autenticación JWT con expiración
- ✅ Validación de datos en entrada
- ✅ CORS configurado
- ✅ Roles y permisos (cliente/admin)

---

## 📊 Estadísticas del Proyecto

- **Backend:** 4 endpoints principales, 200+ líneas de código
- **Admin:** 3 páginas + 2 componentes, UI responsiva
- **Mobile:** 3 pantallas principales, 400+ líneas de código
- **Total:** ~3000 líneas de código producción

---

## 🎓 Objetivos de Aprendizaje

Este proyecto demuestra:

1. **Arquitectura de 3 capas** completa
2. **Autenticación y autorización** con JWT
3. **Sincronización de datos** entre múltiples clientes
4. **Buenas prácticas** en desarrollo fullstack
5. **Validación y seguridad** en datos
6. **Manejo de estado** complejo
7. **APIs RESTful** profesionales
8. **Responsive design** en web y mobile

---

## 📝 Notas Importantes

⚠️ **Desarrollo:**
- CORS está habilitado para todos los orígenes
- JWT_SECRET es uno de demostración, cambiar en producción
- SQLite es ideal para desarrollo, para producción usar PostgreSQL o MongoDB

⚠️ **Mobile:**
- Requiere Node.js y npm instalados
- Expo es recomendado para desarrollo rápido
- Para compilar a APK/IPA, ver documentación de Expo

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que **Node.js v22+** está instalado: `node --version`
2. Verifica que **npm 10+** está instalado: `npm --version`
3. Limpia node_modules y reinstala: `npm install`
4. Revisa los archivos de log
5. Consulta la `GUIA_COMPLETA.md`

---

## ✅ Checklist de Lanzamiento

- [ ] Backend corriendo en puerto 3001
- [ ] Admin panel accesible en puerto 5173
- [ ] App móvil iniciada
- [ ] Base de datos SQLite creada con tablas
- [ ] Usuarios de prueba creados (admin, cliente)
- [ ] Login exitoso en todas las aplicaciones
- [ ] Perfil de usuario funcional
- [ ] CORS sin errores
- [ ] Datos sincronizados entre app y admin

---

## 🎉 ¡Estás listo para presentar!

Ahora tienes un **sistema profesional de veterinaria** completo que demuestra:
- Full-stack development
- Mobile development
- Best practices
- Profesionalismo

**¡Mucho éxito con tu proyecto! 🚀**

---

**Versión:** 1.0  
**Última actualización:** Febrero 2026  
**Estado:** ✅ Completo y funcional
