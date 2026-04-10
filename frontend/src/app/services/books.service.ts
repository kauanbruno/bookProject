import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllBooks(): Observable<BookWithProgress[]> {
    if (this.authService.isLoggedIn()) {
      return this.http.get<BookWithProgress[]>(`${this.apiUrl}/books/with-progress`);
    }
    return this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
      map(books => books.map(b => ({
        ...b,
        inLibrary: false,
        userStatus: null,
        userPagesRead: 0
      })))
    );
  }

  getMyLibrary(): Observable<BookWithProgress[]> {
    return this.http.get<BookWithProgress[]>(`${this.apiUrl}/my-library`);
  }

  addToLibrary(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userBooks`, { 
      bookId, 
      status: 'To Read', 
      pagesRead: 0 
    });
  }

  updateBookStatus(bookId: number, status: string, pagesRead?: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userBooks`, { bookId, status, pagesRead });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/books/${book.id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
  }
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  totalPages: number;
  pagesRead: number;
  status: string;
}

export interface BookWithProgress extends Book {
  inLibrary?: boolean;
  userStatus: string | null;
  userPagesRead: number;
}