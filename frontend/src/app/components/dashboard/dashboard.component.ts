import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BooksService, BookWithProgress } from 'src/app/services/books.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslationService } from 'src/app/services/translation.service';

type SortField = 'title' | 'pagesRead' | 'publishedYear';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todoBooks: BookWithProgress[] = [];
  readingBooks: BookWithProgress[] = [];
  completedBooks: BookWithProgress[] = [];
  sortField: SortField = 'title';
  sortDirection: SortDirection = 'asc';

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private translation: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getMyLibrary().subscribe((books) => {
      this.todoBooks = this.sortBooks(books.filter(b => this.getStatus(b) === this.translation.translateStatus('To Read')));
      this.readingBooks = this.sortBooks(books.filter(b => this.getStatus(b) === this.translation.translateStatus('Reading')));
      this.completedBooks = this.sortBooks(books.filter(b => this.getStatus(b) === this.translation.translateStatus('Completed')));
    });
  }

  getStatus(book: BookWithProgress): string {
    if (book.userStatus) {
      return this.translation.translateStatus(book.userStatus);
    }
    return this.translation.translateStatus(book.status);
  }

  getPagesRead(book: BookWithProgress): number {
    if (this.authService.isLoggedIn() && book.userStatus) {
      return book.userPagesRead;
    }
    return book.pagesRead;
  }

  sortBooks(books: BookWithProgress[]): BookWithProgress[] {
    return [...books].sort((a, b) => {
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

  drop(event: CdkDragDrop<BookWithProgress[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const book = event.previousContainer.data[event.previousIndex];
      const newStatus = targetStatus;
      let newPagesRead = this.getPagesRead(book);

      if (newStatus === 'Concluído') {
        newPagesRead = book.totalPages;
      } else if (newStatus === 'A Ler') {
        newPagesRead = 0;
      }

      const englishStatus = this.getEnglishStatus(newStatus);
      this.booksService.updateBookStatus(book.id, englishStatus, newPagesRead).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          if (this.authService.isLoggedIn()) {
            book.userStatus = englishStatus;
            book.userPagesRead = newPagesRead;
          } else {
            book.status = englishStatus;
            book.pagesRead = newPagesRead;
          }
        },
        error: (err) => {
          console.error('Error updating book status:', err);
        }
      });
    }
  }

  private getEnglishStatus(translated: string): string {
    const map: { [key: string]: string } = {
      'A Ler': 'To Read',
      'Lendo': 'Reading',
      'Concluído': 'Completed'
    };
    return map[translated] || translated;
  }

  getConnectedLists(): string[] {
    return ['todoList', 'readingList', 'completedList'];
  }
}
