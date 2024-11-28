package boleta.controller;

import boleta.entity.Viaje;
import boleta.service.ViajeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viajes")
@CrossOrigin(origins = "*")
public class ViajeController {
    private final ViajeService viajeService;

    public ViajeController(ViajeService viajeService) {
        this.viajeService = viajeService;
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Viaje>> obtenerViajesDisponibles() {
        List<Viaje> viajes = viajeService.buscarViajesDisponibles();
        return ResponseEntity.ok(viajes);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Viaje>> buscarViajes(
            @RequestParam String origen,
            @RequestParam String destino) {
        List<Viaje> viajes = viajeService.buscarViajesPorRuta(origen, destino);
        return ResponseEntity.ok(viajes);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Viaje> crearViaje(@RequestBody Viaje viaje) {
        Viaje nuevoViaje = viajeService.crearViaje(viaje);
        return ResponseEntity.ok(nuevoViaje);
    }
}
