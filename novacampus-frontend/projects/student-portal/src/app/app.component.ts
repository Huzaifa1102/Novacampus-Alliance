import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // <-- Added Router here
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
  private router = inject(Router); // <-- Injecting Router for navigation pipeline
  
  readonly currentRole = this.authService.userRole;
  isSidebarOpen = false;

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar() { this.isSidebarOpen = false; }

  // Clear session variables and drop back to sandbox auth
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}