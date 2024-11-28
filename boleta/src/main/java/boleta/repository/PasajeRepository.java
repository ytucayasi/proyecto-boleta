package boleta.repository;

import boleta.entity.Pasaje;
import boleta.entity.Usuario;
import boleta.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasajeRepository extends JpaRepository<Pasaje, Long> {
    List<Pasaje> findByUsuario(Usuario usuario);

    Optional<Pasaje> findByCodigoReserva(String codigoReserva);

    List<Pasaje> findByViaje(Viaje viaje);

    List<Pasaje> findByUsuarioAndEstado(Usuario usuario, String estado);

    @Query("SELECT p FROM Pasaje p WHERE p.viaje.fechaSalida BETWEEN :inicio AND :fin")
    List<Pasaje> buscarPasajesPorRangoDeFechas(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );

    @Query("SELECT p FROM Pasaje p WHERE p.usuario = :usuario AND " +
            "p.viaje.fechaSalida >= :fecha ORDER BY p.fechaCompra DESC")
    List<Pasaje> buscarPasajesFuturosDeUsuario(
            @Param("usuario") Usuario usuario,
            @Param("fecha") LocalDateTime fecha
    );

    @Query("SELECT COUNT(p) FROM Pasaje p WHERE p.viaje = :viaje AND " +
            "p.numeroAsiento = :numeroAsiento")
    Long verificarDisponibilidadAsiento(
            @Param("viaje") Viaje viaje,
            @Param("numeroAsiento") Integer numeroAsiento
    );
    @Query("SELECT p FROM Pasaje p WHERE p.usuario.dni = :dni")
    List<Pasaje> findByUsuarioDni(@Param("dni") String dni);
}
