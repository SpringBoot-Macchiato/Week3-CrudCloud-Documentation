# Autenticación en Frontend

## Componentes de Autenticación

### Login
Formulario de inicio de sesión tradicional.

**Campos:**
- Email
- Password
- Remember me (opcional)

**Validaciones:**
- Email válido
- Password no vacío

**Flujo:**
1. Usuario ingresa credenciales
2. Submit del formulario
3. POST a `/api/auth/login`
4. Almacena JWT en localStorage
5. Redirect a dashboard

### Register
Formulario de registro de nuevos usuarios.

**Campos:**
- Nombre completo
- Email
- Password
- Confirmar password

**Validaciones:**
- Email único y válido
- Password mínimo 8 caracteres
- Passwords coinciden

### Google OAuth Login

**Implementación:**
```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  <GoogleLogin
    onSuccess={(credentialResponse) => {
      handleGoogleLogin(credentialResponse.credential);
    }}
    onError={() => {
      console.log('Login Failed');
    }}
  />
</GoogleOAuthProvider>
```

**Flujo:**
1. Usuario hace clic en botón "Login with Google"
2. Popup de Google OAuth
3. Usuario autoriza
4. Recibe credential token
5. Envía token a backend `/api/auth/google`
6. Backend valida con Google y retorna JWT propio
7. Frontend almacena JWT

## AuthContext

Maneja el estado de autenticación global.

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validar token y cargar usuario
      loadUser();
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Protected Routes

Componente para proteger rutas privadas.

```jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Uso
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Persistencia de Sesión

JWT se almacena en localStorage y se incluye en cada request mediante interceptor de Axios.

**Expiración de Token:**
- Token expira después de X horas
- Interceptor detecta 401 y redirige a login
- Se limpia localStorage

## Recuperación de Contraseña (Opcional)

Flujo básico si está implementado:
1. Usuario solicita reset
2. Backend envía email con link temporal
3. Usuario accede al link
4. Establece nueva contraseña
5. Redirect a login