import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserBook {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  pagesRead: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserBooksService {
  private apiUrl = 'http://localhost:3001';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUserBooks(): Observable<UserBook[]> {
    return this.http.get<UserBook[]>(`${this.apiUrl}/userBooks`);
  }

  getUserBook(bookId: number): Observable<UserBook | null> {
    return this.http.get<UserBook | null>(`${this.apiUrl}/userBooks/${bookId}`);
  }

  saveUserBook(bookId: number, status: string, pagesRead: number): Observable<UserBook> {
    return this.http.post<UserBook>(`${this.apiUrl}/userBooks`, { bookId, status, pagesRead });
  }
}