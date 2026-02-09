# 🏥 Sistema Integral de Veterinaria

Un sistema completo que incluye:
- ✅ **Backend API** (Node.js + Express + SQLite)
- ✅ **Panel Administrativo Web** (React + Vite)
- ✅ **App Móvil** (React Native + Expo)

---

## 📋 Estructura del Proyecto

```
react-native juntos/
├── veterinaria-backend/          # Backend API
├── veterinaria-admin/            # Panel Administrativo Web
└── App-veterinaria-sin-error-web/ # App Móvil
```

---

## 🚀 GUÍA DE INSTALACIÓN Y EJECUCIÓN

### **PASO 1: Iniciar el Backend**

```bash
cd veterinaria-backend
npm start
```

**Resultado esperado:**
```
✅ Conectado a SQLite
🚀 Servidor ejecutándose en puerto 3001
📡 CORS habilitado para todas las direcciones
```

El servidor creará automáticamente las tablas necesarias en `database.sqlite`.

---

### **PASO 2: Iniciar el Panel Administrativo**

Abre una nueva terminal:

```bash
cd veterinaria-admin
npm run dev
```

**Resultado esperado:**
```
VITE v7.3.1  ready in 411 ms
➜  Local:   http://localhost:5173/
```

---

### **PASO 3: Iniciar la App Móvil**

Abre una tercera terminal:

```bash
cd App-veterinaria-sin-error-web
npm start
```

---

## 🔐 Credenciales de Prueba

### **Admin Panel**
- **Email:** admin@veterinaria.com
- **Password:** password123

### **App Móvil (Crear usuario primero)**
- Usa el registro en la app móvil para crear un nuevo usuario cliente

---

## 📡 Rutas de la API

### **Autenticación**
```
POST   /api/v1/auth/register         # Registrar nuevo usuario
POST   /api/v1/auth/login            # Iniciar sesión
GET    /api/v1/auth/profile          # Obtener perfil actual
PUT    /api/v1/auth/profile          # Actualizar perfil
```

### **Mascotas**
```
GET    /api/v1/mascotas              # Obtener mascotas del usuario
POST   /api/v1/mascotas              # Crear mascota
GET    /api/v1/mascotas/:id          # Obtener mascota por ID
PUT    /api/v1/mascotas/:id          # Actualizar mascota
DELETE /api/v1/mascotas/:id          # Eliminar mascota
```

### **Citas**
```
GET    /api/v1/citas/user            # Citas del usuario actual
GET    /api/v1/citas/admin/all       # Todas las citas (solo admin)
POST   /api/v1/citas                 # Crear cita
GET    /api/v1/citas/:id             # Obtener cita por ID
PUT    /api/v1/citas/:id             # Actualizar cita
POST   /api/v1/citas/:id/cancel      # Cancelar cita
DELETE /api/v1/citas/:id             # Eliminar cita (solo admin)
```

---

## 🎯 Funcionalidades Principales

### **Backend**
- ✅ Autenticación con JWT
- ✅ CORS habilitado
- ✅ Gestión de usuarios (cliente/admin)
- ✅ CRUD de mascotas
- ✅ CRUD de citas
- ✅ Validaciones y seguridad

### **Panel Administrativo**
- ✅ Login con validación de rol
- ✅ Dashboard con estadísticas
- ✅ Tabla de citas con edición
- ✅ Tabla de usuarios
- ✅ Cierre de sesión seguro

### **App Móvil**
- ✅ Autenticación (login/registro)
- ✅ Perfil de usuario
- ✅ Editar perfil
- ✅ Cierre de sesión
- ✅ Conexión al backend
- ✅ Persistencia con AsyncStorage

---

## 🔧 Configuración de Conexión

### **URLs del Backend**

El sistema detecta automáticamente la plataforma:

- **Web (App Móvil en web):** `http://localhost:3001`
- **Mobile (App Móvil en dispositivo):** `http://192.168.1.8:3001`

**Para cambiar la IP en dispositivo móvil:**
Si tu IP de máquina local es diferente, edita:
- [App-veterinaria-sin-error-web/contexts/AuthContext.tsx](App-veterinaria-sin-error-web/contexts/AuthContext.tsx#L40)

---

## 📱 Funcionalidades de la App Móvil

### **Pantalla de Login**
- Registro de nuevos usuarios
- Login con email y contraseña

### **Pantalla de Inicio (Home)**
- Bienvenida personalizada
- Acciones rápidas
- Información del usuario
- Menú de usuario

### **Pantalla de Perfil**
- Ver datos del perfil
- Editar nombre, teléfono, dirección
- Cierre de sesión

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Node.js, Express, SQLite3, JWT, bcryptjs |
| **Admin Panel** | React, Vite, React Router, Axios |
| **App Móvil** | React Native, Expo, Expo Router |

---

## 📊 Estructura de Base de Datos

### **Tabla: usuarios**
```
id, nombre, email, password (hash), telefono, direccion, rol, estado, fecha_creacion
```

### **Tabla: mascotas**
```
id, nombre, tipo, raza, edad, peso, usuario_id, fecha_creacion
```

### **Tabla: citas**
```
id, usuario_id, mascota_id, fecha, hora, tipo_servicio, descripcion, estado, costo, notas_admin, fecha_creacion
```

---

## 🐛 Solución de Problemas

### **El app no se conecta al backend**
1. Verifica que el backend está corriendo en `http://localhost:3001`
2. Comprueba que CORS está habilitado (debería estar por defecto)
3. En dispositivos móviles, cambia `localhost` por tu IP local

### **El panel admin no muestra datos**
1. Asegúrate de estar logueado como admin
2. Verifica que el backend tiene datos (citas, usuarios)
3. Revisa la consola del navegador para errores

### **La app móvil muestra errores de conexión**
1. Verifica que el servidor backend está corriendo
2. Comprueba la conexión a internet
3. Prueba con `http://localhost:3001` en web

---

## 📝 Notas Importantes

- ⚠️ Las contraseñas se almacenan con hash bcrypt (seguro)
- 🔐 Los tokens JWT expiran en 7 días
- 💾 La base de datos SQLite se crea automáticamente en la primera ejecución
- 🌐 El CORS está habilitado para todas las direcciones (desarrollo)

---

## 🎓 Objetivo Educativo

Este proyecto demuestra:
1. **Arquitectura de 3 capas**: Frontend, Backend, Admin
2. **Autenticación y autorización** con JWT
3. **Comunicación entre apps** mediante API REST
4. **Sincronización de datos** en tiempo real
5. **Buenas prácticas** en desarrollo fullstack

---

## ✅ Checklist de Ejecución

- [ ] Backend corriendo en `http://localhost:3001`
- [ ] Panel admin accesible en `http://localhost:5173`
- [ ] App móvil conectada al backend
- [ ] Login exitoso con credenciales de prueba
- [ ] Perfil de usuario funcional
- [ ] Logout que limpia la sesión
- [ ] Datos sincronizados entre app y panel admin

---

**¡Tu sistema está listo para usar! 🚀**
