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
  public static formatNumberES = (n:any, d=0) => {
    n=new Intl.NumberFormat("es-ES").format((n).toFixed(d))
    if (d>0) {
        // Obtenemos la cantidad de decimales que tiene el numero
        const decimals=n.indexOf(",")>-1 ? n.length-1-n.indexOf(",") : 0;
 
        // añadimos los ceros necesios al numero
        n = (decimals==0) ? n+","+"0".repeat(d) : n+"0".repeat(d-decimals);
    }
    return n;
}
}
