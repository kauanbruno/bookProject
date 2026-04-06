import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { 
    
  };
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('http://localhost:3001/books');
  };
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

