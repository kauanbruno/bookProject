import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private apiUrl = 'http://localhost:3001/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  updateBookStatus(id: number, status: string, pagesRead?: number): Observable<Book> {
    const body: any = { status };
    if (pagesRead !== undefined) {
      body.pagesRead = pagesRead;
    }
    return this.http.patch<Book>(`${this.apiUrl}/${id}`, body);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
