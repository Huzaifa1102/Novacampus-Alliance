import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatbotComponent],
  templateUrl: './app.html'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isSidebarOpen = false;

  get currentRole() {
    return this.authService.getRole();
  }

  get isLoginPage() {
    return this.router.url === '/login';
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar() { this.isSidebarOpen = false; }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}