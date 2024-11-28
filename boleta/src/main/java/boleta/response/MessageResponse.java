package boleta.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class MessageResponse {
    private String mensaje;

    public MessageResponse(String mensaje) {
        this.mensaje = mensaje;
    }
}