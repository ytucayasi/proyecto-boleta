package boleta.controller;

import boleta.entity.Pasaje;
import boleta.response.MessageResponse;
import boleta.service.PasajeService;
import boleta.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pasajes")
@CrossOrigin(origins = "*")
public class PasajeController {
    private final PasajeService pasajeService;
    private final UsuarioService usuarioService;

    public PasajeController(PasajeService pasajeService, UsuarioService usuarioService) {
        this.pasajeService = pasajeService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/comprar")
    public ResponseEntity<?> comprarPasaje(
            @RequestParam Long viajeId,
            @RequestParam Integer numeroAsiento,
            @RequestParam Long usuarioId) {
        try {
            Pasaje pasaje = pasajeService.comprarPasaje(usuarioId, viajeId, numeroAsiento);
            return ResponseEntity.ok(pasaje);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/buscar/dni/{dni}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> buscarPasajesPorDni(@PathVariable String dni) {
        try {
            List<Pasaje> pasajes = pasajeService.buscarPasajesPorDni(dni);
            if (pasajes.isEmpty()) {
                return ResponseEntity.ok()
                        .body(new MessageResponse("No se encontraron pasajes para el DNI: " + dni));
            }
            return ResponseEntity.ok(pasajes);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error al buscar pasajes: " + e.getMessage()));
        }
    }
}
