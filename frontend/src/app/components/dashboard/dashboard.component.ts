import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BooksService, Book } from 'src/app/services/books.service';

type SortField = 'title' | 'pagesRead' | 'publishedYear';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todoBooks: Book[] = [];
  readingBooks: Book[] = [];
  completedBooks: Book[] = [];
  sortField: SortField = 'title';
  sortDirection: SortDirection = 'asc';

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getBooks().subscribe((books) => {
      this.todoBooks = this.sortBooks(books.filter(b => b.status === 'To Read'));
      this.readingBooks = this.sortBooks(books.filter(b => b.status === 'Reading'));
      this.completedBooks = this.sortBooks(books.filter(b => b.status === 'Completed'));
    });
  }

  sortBooks(books: Book[]): Book[] {
    return [...books].sort((a, b) => {
      let comparison = 0;
      switch (this.sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'pagesRead':
          comparison = a.pagesRead - b.pagesRead;
          break;
        case 'publishedYear':
          comparison = a.publishedYear - b.publishedYear;
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  setSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.todoBooks = this.sortBooks(this.todoBooks);
    this.readingBooks = this.sortBooks(this.readingBooks);
    this.completedBooks = this.sortBooks(this.completedBooks);
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'expand_less' : 'expand_more';
  }

  drop(event: CdkDragDrop<Book[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const book = event.previousContainer.data[event.previousIndex];
      const newStatus = targetStatus;
      let newPagesRead = book.pagesRead;

      if (newStatus === 'Completed') {
        newPagesRead = book.totalPages;
      } else if (newStatus === 'To Read') {
        newPagesRead = 0;
      }

      this.booksService.updateBookStatus(book.id, newStatus, newPagesRead).subscribe({
        next: (updatedBook) => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          book.status = updatedBook.status;
          book.pagesRead = updatedBook.pagesRead;
        },
        error: (err) => {
          console.error('Error updating book status:', err);
        }
      });
    }
  }

  getConnectedLists(): string[] {
    return ['todoList', 'readingList', 'completedList'];
  }
}
