package boleta.service;

import boleta.entity.Pasaje;
import boleta.entity.Usuario;
import boleta.entity.Viaje;
import boleta.repository.PasajeRepository;
import boleta.repository.UsuarioRepository;
import boleta.repository.ViajeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PasajeService {
    private final PasajeRepository pasajeRepository;
    private final ViajeRepository viajeRepository;
    private final ViajeService viajeService;
    private final UsuarioRepository usuarioRepository;

    public PasajeService(PasajeRepository pasajeRepository,
                         ViajeRepository viajeRepository,
                         ViajeService viajeService, UsuarioRepository usuarioRepository) {
        this.pasajeRepository = pasajeRepository;
        this.viajeRepository = viajeRepository;
        this.viajeService = viajeService;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Pasaje comprarPasaje(Long usuarioId, Long viajeId, Integer numeroAsiento) {
        // Obtener el usuario para quien se compra el pasaje
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Viaje viaje = viajeRepository.findById(viajeId)
                .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));

        // Verificar disponibilidad de asiento
        if (pasajeRepository.verificarDisponibilidadAsiento(viaje, numeroAsiento) > 0) {
            throw new RuntimeException("El asiento seleccionado no está disponible");
        }

        // Actualizar asientos disponibles
        if (!viajeService.actualizarAsientosDisponibles(viajeId, 1)) {
            throw new RuntimeException("No hay asientos disponibles");
        }

        Pasaje pasaje = new Pasaje();
        pasaje.setUsuario(usuario);  // Aquí se asigna el usuario encontrado por ID
        pasaje.setViaje(viaje);
        pasaje.setNumeroAsiento(numeroAsiento);
        pasaje.setFechaCompra(LocalDateTime.now());
        pasaje.setEstado("PAGADO");
        pasaje.setCodigoReserva(generarCodigoReserva());

        return pasajeRepository.save(pasaje);
    }



    @Transactional(readOnly = true)
    public List<Pasaje> obtenerPasajesUsuario(Usuario usuario) {
        return pasajeRepository.findByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public List<Pasaje> obtenerPasajesFuturos(Usuario usuario) {
        return pasajeRepository.buscarPasajesFuturosDeUsuario(usuario, LocalDateTime.now());
    }

    private String generarCodigoReserva() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    @Transactional(readOnly = true)
    public List<Pasaje> buscarPasajesPorDni(String dni) {
        return pasajeRepository.findByUsuarioDni(dni);
    }
}
