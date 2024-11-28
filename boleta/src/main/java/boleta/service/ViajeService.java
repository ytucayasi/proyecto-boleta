package boleta.service;

import boleta.entity.Viaje;
import boleta.repository.ViajeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ViajeService {
    private final ViajeRepository viajeRepository;

    public ViajeService(ViajeRepository viajeRepository) {
        this.viajeRepository = viajeRepository;
    }

    @Transactional(readOnly = true)
    public List<Viaje> buscarViajesDisponibles() {
        return viajeRepository.buscarViajesDisponibles(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<Viaje> buscarViajesPorRuta(String origen, String destino) {
        return viajeRepository.buscarViajesDisponiblesPorRuta(
                origen,
                destino,
                LocalDateTime.now()
        );
    }

    @Transactional
    public Viaje crearViaje(Viaje viaje) {
        return viajeRepository.save(viaje);
    }

    @Transactional
    public boolean actualizarAsientosDisponibles(Long viajeId, int asientosVendidos) {
        Viaje viaje = viajeRepository.findById(viajeId)
                .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));

        if (viaje.getAsientosDisponibles() < asientosVendidos) {
            return false;
        }

        viaje.setAsientosDisponibles(viaje.getAsientosDisponibles() - asientosVendidos);
        viajeRepository.save(viaje);
        return true;
    }
}

