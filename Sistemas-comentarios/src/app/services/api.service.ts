import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comentario {
  postId?: number;
  id?: number;
  name: string;
  email?: string;
  body: string;
  fecha?: string; // Para comentarios creados localmente
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/comments';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de comentarios de la API
   * @returns Observable con los comentarios
   */
  obtenerComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.apiUrl);
  }

  /**
   * Crea un nuevo comentario
   * @param comentario - Objeto con los datos del comentario
   * @returns Observable con el resultado de la creación
   */
  crearComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(this.apiUrl, comentario);
  }
}