import { Component, OnInit } from '@angular/core';
import { BooksService, BookWithProgress } from 'src/app/services/books.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslationService } from 'src/app/services/translation.service';

type SortField = 'title' | 'pagesRead' | 'publishedYear';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: BookWithProgress[] = [];
  recentBooks: BookWithProgress[] = [];
  sortField: SortField = 'title';
  sortDirection: SortDirection = 'asc';
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
    if (this.isLoggedIn) {
      this.booksService.getMyLibrary().subscribe((data) => {
        this.books = data;
        this.updateSortedBooks();
      });
    } else {
      this.booksService.getAllBooks().subscribe((data) => {
        this.books = data.slice(0, 10);
        this.updateSortedBooks();
      });
    }
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
    if (this.isLoggedIn) {
      return !!(book.inLibrary && book.userStatus);
    }
    return true;
  }

  getPagesRead(book: BookWithProgress): number {
    if (this.isLoggedIn && book.userStatus) {
      return book.userPagesRead;
    }
    return book.pagesRead;
  }

  updateSortedBooks(): void {
    const sorted = [...this.books].sort((a, b) => {
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
    return this.books.filter(b => b.inLibrary && this.translation.translateStatus(b.userStatus || '') === this.translation.translateStatus('Reading')).length;
  }

  getCompletedCount(): number {
    return this.books.filter(b => b.inLibrary && this.translation.translateStatus(b.userStatus || '') === this.translation.translateStatus('Completed')).length;
  }

  getTotalPagesRead(): number {
    return this.books.reduce((sum, b) => {
      if (this.isLoggedIn && b.inLibrary) {
        return sum + (b.userPagesRead || 0);
      }
      return sum + b.pagesRead;
    }, 0);
  }

  getStatusClass(book: BookWithProgress): string {
    const status = this.getStatus(book);
    if (!status) return 'available';
    return status.toLowerCase().replace(' ', '-');
  }
}
