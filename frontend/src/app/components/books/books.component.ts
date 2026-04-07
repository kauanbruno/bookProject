import { Component, OnInit } from '@angular/core';
import { BooksService, Book } from 'src/app/services/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = []; // inicializado como array vazio

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
    this.booksService.getBooks().subscribe((data) => {
    console.log('Array de livros:', data);
    this.books = data;
      }
    )};
  }
