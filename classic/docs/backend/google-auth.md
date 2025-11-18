# Módulo de Google OAuth2

## Descripción

Autenticación mediante Google OAuth2 utilizando Spring Security OAuth2 Client.

## Configuración

### application.properties

```properties
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/google
```

## SecurityConfig para OAuth2

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**", "/login/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .oauth2Login()
                .successHandler(oAuth2SuccessHandler)
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## OAuth2SuccessHandler

Procesa el login exitoso de Google y genera JWT propio.

```java
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                       HttpServletResponse response,
                                       Authentication authentication) 
            throws IOException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");
        
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> createNewGoogleUser(email, name, googleId));
        
        String token = tokenProvider.generateToken(authentication);
        
        String redirectUrl = String.format(
            "https://frontend-url.com/oauth2/redirect?token=%s", 
            token
        );
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
    
    private User createNewGoogleUser(String email, String name, String googleId) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setProvider("google");
        user.setProviderId(googleId);
        user.setPassword(null); // No password for OAuth users
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}
```

## Endpoint Alternativo (Token-Based)

Para SPA que prefieren manejar OAuth2 desde frontend:

```java
@PostMapping("/auth/google")
public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleTokenRequest request) {
    // Validar token con Google
    GoogleIdToken.Payload payload = verifyGoogleToken(request.getToken());
    
    String email = payload.getEmail();
    String name = (String) payload.get("name");
    String googleId = payload.getSubject();
    
    User user = userRepository.findByEmail(email)
        .orElseGet(() -> createNewGoogleUser(email, name, googleId));
    
    // Crear autenticación manual
    UsernamePasswordAuthenticationToken authentication = 
        new UsernamePasswordAuthenticationToken(
            user.getEmail(), null, Collections.emptyList()
        );
    
    String jwt = jwtTokenProvider.generateToken(authentication);
    
    return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getName()));
}

private GoogleIdToken.Payload verifyGoogleToken(String token) throws Exception {
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
        new NetHttpTransport(), 
        GsonFactory.getDefaultInstance()
    )
    .setAudience(Collections.singletonList(googleClientId))
    .build();
    
    GoogleIdToken idToken = verifier.verify(token);
    if (idToken == null) {
        throw new BadRequestException("Invalid Google token");
    }
    
    return idToken.getPayload();
}
```

## Flujo OAuth2

### Flujo con Spring Security OAuth2

1. Usuario hace clic en "Login with Google"
2. Frontend redirige a `/oauth2/authorization/google`
3. Spring Security redirige a Google
4. Usuario autoriza en Google
5. Google redirige a `/login/oauth2/code/google`
6. Spring Security procesa el código
7. OAuth2SuccessHandler se ejecuta
8. Genera JWT y redirige al frontend con token

### Flujo con Token desde Frontend

1. Frontend inicia OAuth2 con Google
2. Obtiene `id_token` de Google
3. Envía token a `/api/auth/google`
4. Backend valida token con Google
5. Crea/actualiza usuario
6. Genera JWT propio
7. Retorna JWT al frontend

## Diferencias entre Usuarios

- **Local Users**: Tienen `provider="local"` y password hasheado
- **Google Users**: Tienen `provider="google"`, `providerId`, sin password

```java
public boolean isLocalUser(User user) {
    return "local".equals(user.getProvider());
}

public boolean isGoogleUser(User user) {
    return "google".equals(user.getProvider());
}
```

## DTOs

```java
public class GoogleTokenRequest {
    @NotBlank
    private String token;
}
```