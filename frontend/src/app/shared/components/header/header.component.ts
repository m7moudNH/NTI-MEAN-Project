import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = false;
  accountMenuOpen = false;
  searchTerm = '';

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleAccountMenu() {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  logout() {
    this.accountMenuOpen = false;
    this.auth.logout();
  }

  submitSearch() {
    const term = this.searchTerm.trim();
    this.menuOpen = false;
    this.router.navigate(['/shop'], { queryParams: term ? { title: term } : {} });
  }
}
