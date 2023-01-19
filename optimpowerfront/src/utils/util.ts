import Swal from 'sweetalert2';

export class Util {

  public static mensajeDialog(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      showCancelButton: false,
      confirmButtonColor: '#1F2A9A',
      confirmButtonText: 'Aceptar',
    });
  }
}
