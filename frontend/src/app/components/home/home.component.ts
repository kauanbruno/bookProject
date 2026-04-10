import { Component, OnInit } from '@angular/core';
import { BooksService, Book } from 'src/app/services/books.service';

type SortField = 'title' | 'pagesRead' | 'publishedYear';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  recentBooks: Book[] = [];
  sortField: SortField = 'title';
  sortDirection: SortDirection = 'asc';

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getBooks().subscribe((data) => {
      this.books = data;
      this.updateSortedBooks();
    });
  }

  updateSortedBooks(): void {
    const sorted = [...this.books].sort((a, b) => {
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
    this.recentBooks = sorted.slice(0, 3);
  }

  setSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.updateSortedBooks();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'expand_less' : 'expand_more';
  }

  getReadingCount(): number {
    return this.books.filter(b => b.status === 'Reading').length;
  }

  getCompletedCount(): number {
    return this.books.filter(b => b.status === 'Completed').length;
  }

  getTotalPagesRead(): number {
    return this.books.reduce((sum, b) => sum + b.pagesRead, 0);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
