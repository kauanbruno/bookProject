import { Component, OnInit } from '@angular/core';
import { BooksService, BookWithProgress } from 'src/app/services/books.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslationService } from 'src/app/services/translation.service';

type SortField = 'title' | 'pagesRead' | 'publishedYear';
type SortDirection = 'asc' | 'desc';
type FilterMode = 'all' | 'library';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: BookWithProgress[] = [];
  filteredBooks: BookWithProgress[] = [];
  searchTerm = '';
  sortField: SortField = 'title';
  sortDirection: SortDirection = 'asc';
  filterMode: FilterMode = 'all';
  isLoggedIn = false;

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    public translation: TranslationService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getAllBooks().subscribe((data) => {
      this.books = data;
      this.applyFilters();
    });
  }

  setFilter(mode: FilterMode): void {
    this.filterMode = mode;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.books];

    if (this.isLoggedIn && this.filterMode === 'library') {
      result = result.filter(book => book.inLibrary);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.publisher.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (this.sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'pagesRead':
          comparison = this.getPagesRead(a) - this.getPagesRead(b);
          break;
        case 'publishedYear':
          comparison = a.publishedYear - b.publishedYear;
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredBooks = result;
  }

  getPagesRead(book: BookWithProgress): number {
    return this.isLoggedIn && book.userStatus ? book.userPagesRead : book.pagesRead;
  }

  getStatus(book: BookWithProgress): string {
    if (this.isLoggedIn) {
      if (book.inLibrary && book.userStatus) {
        return this.translation.translateStatus(book.userStatus);
      }
      return '';
    }
    return this.translation.translateStatus(book.status);
  }

  hasStatus(book: BookWithProgress): boolean {
    return !!(this.isLoggedIn && book.inLibrary && book.userStatus);
  }

  addToLibrary(book: BookWithProgress): void {
    this.booksService.addToLibrary(book.id).subscribe({
      next: () => {
        book.inLibrary = true;
        book.userStatus = 'To Read';
        book.userPagesRead = 0;
        this.applyFilters();
      },
      error: (err) => console.error('Error adding to library:', err)
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  setSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'expand_less' : 'expand_more';
  }

  getStatusClass(book: BookWithProgress): string {
    const status = this.getStatus(book);
    return status.toLowerCase().replace(' ', '-');
  }
}
