package boleta.controller;

import boleta.entity.Usuario;
import boleta.request.LoginRequest;
import boleta.request.RegisterRequest;
import boleta.response.JwtResponse;
import boleta.response.MessageResponse;
import boleta.service.AuthService;
import boleta.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    private final UsuarioService usuarioService;

    public AuthController(AuthService authService, UsuarioService usuarioService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginRequest loginRequest) {
        String jwt = authService.autenticar(loginRequest.getUsername(), loginRequest.getPassword());

        Usuario usuario = usuarioService.obtenerPorUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado."));

        List<String> roles = usuario.getRoles().stream()
                .map(role -> role.getNombre().name())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                roles
        ));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegisterRequest registerRequest) {
        if (usuarioService.existeUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: El nombre de usuario ya está en uso.") );
        }

        if (usuarioService.existeEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: El email ya está en uso."));
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(registerRequest.getUsername());
        usuario.setPassword(registerRequest.getPassword());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setNombre(registerRequest.getNombre());
        usuario.setApellido(registerRequest.getApellido());
        usuario.setDni(registerRequest.getDni());
        usuario.setTelefono(registerRequest.getTelefono());

        usuarioService.registrarUsuario(usuario);

        return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente."));
    }
}