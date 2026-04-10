import { Component, OnInit } from '@angular/core';
import { BooksService, Book } from 'src/app/services/books.service';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css']
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  selectedBook: Book | null = null;
  isEditing = false;
  showForm = false;
  searchTerm = '';

  formData: Partial<Book> = {
    title: '',
    author: '',
    publisher: '',
    publishedYear: 0,
    totalPages: 0,
    pagesRead: 0,
    status: 'To Read'
  };

  statuses = ['To Read', 'Reading', 'Completed'];

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getBooks().subscribe((data) => {
      this.books = data;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = this.books;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.publisher.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  openForm(book?: Book): void {
    if (book) {
      this.selectedBook = book;
      this.isEditing = true;
      this.formData = { ...book };
    } else {
      this.selectedBook = null;
      this.isEditing = false;
      this.formData = {
        title: '',
        author: '',
        publisher: '',
        publishedYear: new Date().getFullYear(),
        totalPages: 0,
        pagesRead: 0,
        status: 'To Read'
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedBook = null;
    this.isEditing = false;
  }

  saveBook(): void {
    if (!this.formData.title || !this.formData.author || !this.formData.totalPages) {
      return;
    }

    if (this.isEditing && this.selectedBook) {
      const updatedBook: Book = {
        ...this.selectedBook,
        ...this.formData
      } as Book;

      this.booksService.updateBook(updatedBook).subscribe({
        next: () => {
          this.loadBooks();
          this.closeForm();
        },
        error: (err) => console.error('Error updating book:', err)
      });
    } else {
      this.booksService.createBook(this.formData as Omit<Book, 'id'>).subscribe({
        next: () => {
          this.loadBooks();
          this.closeForm();
        },
        error: (err) => console.error('Error creating book:', err)
      });
    }
  }

  deleteBook(id: number): void {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      this.booksService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
          if (this.selectedBook?.id === id) {
            this.closeForm();
          }
        },
        error: (err) => console.error('Error deleting book:', err)
      });
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
