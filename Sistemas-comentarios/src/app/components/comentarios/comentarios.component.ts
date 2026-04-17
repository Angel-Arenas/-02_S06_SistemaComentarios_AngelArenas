import { Component, OnInit } from '@angular/core';
import { ApiService, Comentario } from '../../services/api.service';

@Component({
  standalone: false,
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  // Variables para el listado
  comentarios: Comentario[] = [];
  comentariosOriginales: Comentario[] = [];
  cargando: boolean = false;
  error: string = '';

  // Variables para el formulario
  nuevoComentario: Comentario = {
    name: '',
    body: ''
  };
  
  // Variables de control
  mostrarMensajeExito: boolean = false;
  mensajeExito: string = '';
  contadorComentariosCreados: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  /**
   * Carga los comentarios desde la API
   */
  cargarComentarios(): void {
    this.cargando = true;
    this.error = '';

    this.apiService.obtenerComentarios().subscribe({
      next: (datos: Comentario[]) => {
        // Limitar a los primeros 10 comentarios para mejor visualización
        this.comentarios = datos.slice(0, 10);
        this.comentariosOriginales = [...this.comentarios];
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar comentarios:', err);
        this.error = 'Error al cargar los comentarios. Intenta nuevamente.';
        this.cargando = false;
      }
    });
  }

  /**
   * Envía un nuevo comentario a la API
   */
  enviarComentario(): void {
    // Validaciones
    if (!this.nuevoComentario.name.trim()) {
      alert('Por favor, ingresa un nombre');
      return;
    }

    if (!this.nuevoComentario.body.trim()) {
      alert('Por favor, ingresa un comentario');
      return;
    }

    // Preparar el comentario
    const comentarioAEnviar: Comentario = {
      name: this.nuevoComentario.name,
      body: this.nuevoComentario.body,
      postId: 1,
      email: 'usuario@ejemplo.com',
      fecha: this.obtenerFechaActual()
    };

    // Llamar al servicio
    this.apiService.crearComentario(comentarioAEnviar).subscribe({
      next: (respuesta: Comentario) => {
        console.log('Comentario creado:', respuesta);

        // Agregar el comentario a la lista (con fecha simulada)
        const nuevoComentarioLocal: Comentario = {
          ...respuesta,
          name: this.nuevoComentario.name,
          body: this.nuevoComentario.body,
          fecha: this.obtenerFechaActual()
        };

        this.comentarios.unshift(nuevoComentarioLocal);
        
        // Incrementar contador
        this.contadorComentariosCreados++;

        // Mostrar mensaje de éxito
        this.mostrarMensajeExito = true;
        this.mensajeExito = `✅ Comentario de "${this.nuevoComentario.name}" registrado exitosamente`;

        // Limpiar formulario
        this.limpiarFormulario();

        // Ocultar mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensajeExito = false;
        }, 4000);
      },
      error: (err: any) => {
        console.error('Error al crear comentario:', err);
        alert('Error al registrar el comentario. Intenta nuevamente.');
      }
    });
  }

  /**
   * Limpia el formulario
   */
  limpiarFormulario(): void {
    this.nuevoComentario = {
      name: '',
      body: ''
    };
  }

  /**
   * Obtiene la fecha actual formateada
   * @returns String con la fecha en formato legible
   */
  obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  }

  /**
   * Obtiene el total de comentarios (originales + creados)
   */
  obtenerTotalComentarios(): number {
    return this.comentarios.length;
  }

  /**
   * Resetea los comentarios a los originales
   */
  resetearComentarios(): void {
    this.comentarios = [...this.comentariosOriginales];
    this.contadorComentariosCreados = 0;
  }
}