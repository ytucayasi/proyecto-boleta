package boleta.repository;

import boleta.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {
    List<Viaje> findByOrigenAndDestinoAndFechaSalidaAfter(
            String origen,
            String destino,
            LocalDateTime fecha
    );

    List<Viaje> findByAsientosDisponiblesGreaterThan(Integer asientos);

    @Query("SELECT v FROM Viaje v WHERE v.fechaSalida >= :fecha AND v.asientosDisponibles > 0")
    List<Viaje> buscarViajesDisponibles(@Param("fecha") LocalDateTime fecha);

    @Query("SELECT v FROM Viaje v WHERE v.origen = :origen AND v.destino = :destino " +
            "AND v.fechaSalida >= :fecha AND v.asientosDisponibles > 0")
    List<Viaje> buscarViajesDisponiblesPorRuta(
            @Param("origen") String origen,
            @Param("destino") String destino,
            @Param("fecha") LocalDateTime fecha
    );
}