import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface RepositoryItem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  languageColor: string;
  updatedAt: string;
  visibility: string;
  htmlUrl: string;
  cloneUrl: string;
  topics: string[];
  lastCommitMsg: string;
  lastCommitAuthor: string;
  lastCommitDate: string;
  isMainRepo?: boolean;
}

@Component({
  selector: 'app-repositories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      
      <!-- Page Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-border-light shadow-sm">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-text-main flex items-center gap-2">
                GitHub Repositories Showcase
                <span class="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">Live Sync</span>
              </h1>
              <p class="text-sm text-text-muted mt-0.5">Explore source code, microservices, commit histories, and project architecture.</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full lg:w-auto">
          <button (click)="syncGitHubData()" [disabled]="isSyncing" class="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
            <svg class="w-4 h-4" [ngClass]="{'animate-spin': isSyncing}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isSyncing ? 'Syncing GitHub...' : 'Sync GitHub API' }}
          </button>
          
          <a href="https://github.com/D-A-D-group-3/novacampus-alliance" target="_blank" class="px-4 py-2.5 border border-border-light hover:bg-surface text-text-main rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            Open on GitHub
          </a>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div class="bg-white p-5 rounded-2xl border border-border-light shadow-sm flex items-center justify-between border-l-4 border-l-brand-primary">
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Main Repository</p>
            <p class="text-lg font-extrabold text-text-main mt-1">novacampus-alliance</p>
            <span class="text-xs text-brand-primary font-medium mt-1 inline-block">D-A-D-group-3</span>
          </div>
          <div class="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-border-light shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Total Microservices</p>
            <p class="text-2xl font-bold text-text-main mt-1">6 Services</p>
            <span class="text-xs text-amber-600 font-medium mt-1 inline-block">Node.js + Python FastAPI</span>
          </div>
          <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-border-light shadow-sm flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Frontend Portals</p>
            <p class="text-2xl font-bold text-text-main mt-1">4 Portals</p>
            <span class="text-xs text-purple-600 font-medium mt-1 inline-block">Angular 19 Standalone</span>
          </div>
          <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-border-light shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p class="text-xs font-bold text-text-muted uppercase tracking-wider">Latest Commit</p>
            <p class="text-sm font-bold text-text-main mt-1 truncate max-w-[140px]">{{ mainRepo.lastCommitMsg }}</p>
            <span class="text-xs text-emerald-600 font-medium mt-1 inline-block">{{ mainRepo.lastCommitDate }}</span>
          </div>
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white p-4 rounded-2xl border border-border-light shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Search Input -->
        <div class="relative w-full md:w-80">
          <input type="text" [(ngModel)]="searchQuery" (input)="filterRepos()" placeholder="Search repositories & microservices..." 
            class="w-full bg-surface border border-border-light text-text-main text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary/50">
          <svg class="w-4 h-4 text-text-muted absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <!-- Language Pill Filters -->
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          <button *ngFor="let lang of languageFilters" 
            (click)="selectLanguage(lang)"
            [class]="(selectedLanguage === lang ? 'bg-slate-900 text-white font-semibold' : 'bg-surface hover:bg-slate-100 text-text-muted') + ' px-3.5 py-1.5 rounded-xl text-xs transition-colors shrink-0'">
            {{ lang }}
          </button>
        </div>
      </div>

      <!-- Toast Notification for Clone Copy -->
      <div *ngIf="copyToast" class="p-3 bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg max-w-sm animate-bounce">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          {{ copyToast }}
        </span>
        <button (click)="copyToast = null" class="text-gray-400 hover:text-white">✕</button>
      </div>

      <!-- Repositories Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div *ngFor="let repo of filteredRepos" class="bg-white rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between relative group">
          
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="repo.languageColor"></span>
                <h3 class="text-lg font-bold text-text-main hover:text-brand-primary transition-colors cursor-pointer" (click)="openRepoModal(repo)">
                  {{ repo.name }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span *ngIf="repo.isMainRepo" class="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Primary Repo
                </span>
                <span class="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                  {{ repo.visibility }}
                </span>
              </div>
            </div>

            <p class="text-sm text-text-muted leading-relaxed">
              {{ repo.description }}
            </p>

            <!-- Topics / Badges -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span *ngFor="let topic of repo.topics" class="text-[11px] bg-surface text-text-muted hover:text-brand-dark px-2.5 py-1 rounded-lg border border-border-light font-medium">
                #{{ topic }}
              </span>
            </div>
          </div>

          <!-- Commit & Metadata Footer -->
          <div class="pt-5 mt-5 border-t border-border-light space-y-3">
            
            <div class="bg-surface p-3 rounded-xl flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 truncate">
                <svg class="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <span class="font-medium text-text-main truncate">{{ repo.lastCommitMsg }}</span>
              </div>
              <span class="text-[11px] text-text-muted shrink-0 ml-2 font-mono">{{ repo.lastCommitDate }}</span>
            </div>

            <div class="flex items-center justify-between text-xs text-text-muted">
              
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1 font-semibold text-text-main">
                  <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.165L12 18.896l-7.333 3.863 1.399-8.165-5.934-5.784 8.2-1.192zm0 0"></path></svg>
                  {{ repo.stars }}
                </span>
                <span class="flex items-center gap-1 font-semibold text-text-main">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  {{ repo.forks }}
                </span>
                <span class="font-medium text-slate-600 font-mono">{{ repo.language }}</span>
              </div>

              <div class="flex items-center gap-2">
                <button (click)="copyCloneUrl(repo.cloneUrl)" class="px-2.5 py-1 text-[11px] font-semibold text-brand-dark hover:bg-brand-primary/10 rounded-lg transition-colors flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  Clone URL
                </button>
                <button (click)="openRepoModal(repo)" class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] rounded-lg transition-colors">
                  Details
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- Repo Detail Modal -->
      <div *ngIf="selectedRepoModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <div class="flex justify-between items-start pb-4 border-b border-border-light">
            <div class="flex items-center gap-3">
              <span class="w-4 h-4 rounded-full" [style.background-color]="selectedRepoModal.languageColor"></span>
              <div>
                <h2 class="text-xl font-bold text-text-main font-mono">{{ selectedRepoModal.fullName }}</h2>
                <p class="text-xs text-text-muted mt-0.5">{{ selectedRepoModal.visibility }} • Main Branch: <span class="font-semibold text-text-main">main</span></p>
              </div>
            </div>
            <button (click)="selectedRepoModal = null" class="text-text-muted hover:text-slate-900 text-lg">✕</button>
          </div>

          <div class="space-y-4">
            <div>
              <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Description</h4>
              <p class="text-sm text-text-main leading-relaxed bg-surface p-3.5 rounded-xl border border-border-light">
                {{ selectedRepoModal.description }}
              </p>
            </div>

            <div>
              <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Clone Commands</h4>
              <div class="bg-slate-900 text-emerald-400 font-mono text-xs p-3.5 rounded-xl flex items-center justify-between shadow-inner">
                <span class="truncate">git clone {{ selectedRepoModal.cloneUrl }}</span>
                <button (click)="copyCloneUrl('git clone ' + selectedRepoModal.cloneUrl)" class="text-white hover:text-emerald-300 text-xs px-2 py-1 bg-white/10 rounded-md">
                  Copy
                </button>
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Recent Git Commit Feed</h4>
              <div class="space-y-2">
                <div class="p-3 bg-surface rounded-xl border border-border-light flex items-center justify-between text-xs">
                  <div>
                    <p class="font-bold text-text-main">{{ selectedRepoModal.lastCommitMsg }}</p>
                    <p class="text-[11px] text-text-muted mt-0.5">Author: {{ selectedRepoModal.lastCommitAuthor }}</p>
                  </div>
                  <span class="font-mono text-text-muted text-[11px]">{{ selectedRepoModal.lastCommitDate }}</span>
                </div>
                <div class="p-3 bg-surface rounded-xl border border-border-light flex items-center justify-between text-xs">
                  <div>
                    <p class="font-bold text-text-main">Integrated Student Grades and Timetable UIs</p>
                    <p class="text-[11px] text-text-muted mt-0.5">Author: Huzaifa1102</p>
                  </div>
                  <span class="font-mono text-text-muted text-[11px]">2026-06-10</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Technologies & Topics</h4>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let topic of selectedRepoModal.topics" class="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-medium border border-slate-200">
                  #{{ topic }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-border-light">
            <button (click)="selectedRepoModal = null" class="px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface rounded-xl">
              Close
            </button>
            <a [href]="selectedRepoModal.htmlUrl" target="_blank" class="px-4 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              View on GitHub
            </a>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class RepositoriesComponent implements OnInit {
  private http = inject(HttpClient);

  searchQuery = '';
  selectedLanguage = 'All';
  isSyncing = false;
  copyToast: string | null = null;
  selectedRepoModal: RepositoryItem | null = null;

  languageFilters = ['All', 'TypeScript', 'Node.js', 'Python', 'Angular', 'Docker'];

  mainRepo: RepositoryItem = {
    id: '1',
    name: 'novacampus-alliance',
    fullName: 'D-A-D-group-3/novacampus-alliance',
    description: 'A distributed microservices-based Academic ERP for a multi-campus higher education group featuring 6 backend microservices and 4 Angular frontend portals.',
    stars: 12,
    forks: 4,
    openIssues: 0,
    language: 'TypeScript',
    languageColor: '#3178c6',
    updatedAt: '2026-06-12',
    visibility: 'Public',
    htmlUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance',
    cloneUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance.git',
    topics: ['academic-erp', 'angular-19', 'fastapi', 'microservices', 'docker', 'kong-gateway', 'keycloak'],
    lastCommitMsg: 'Pushed UI/UX enhancements and backend API integrations',
    lastCommitAuthor: 'Huzaifa1102',
    lastCommitDate: '2026-06-12',
    isMainRepo: true
  };

  repositories: RepositoryItem[] = [
    this.mainRepo,
    {
      id: '2',
      name: 'academic-service',
      fullName: 'D-A-D-group-3/academic-service',
      description: 'Core Academic microservice handling courses, grading plugins, student attendance, and curriculum scheduling.',
      stars: 5,
      forks: 2,
      openIssues: 0,
      language: 'Node.js',
      languageColor: '#68a063',
      updatedAt: '2026-06-10',
      visibility: 'Internal',
      htmlUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance/tree/main/services/academic-service',
      cloneUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance.git',
      topics: ['express', 'postgresql', 'prisma-orm', 'grading-plugin'],
      lastCommitMsg: 'Refactored attendance plugin and grade calculation logic',
      lastCommitAuthor: 'Huzaifa1102',
      lastCommitDate: '2026-06-10'
    },
    {
      id: '3',
      name: 'chatbot-service',
      fullName: 'D-A-D-group-3/chatbot-service',
      description: 'AI Academic Assistant microservice powered by Python FastAPI, PyMongo, and NLP query handlers.',
      stars: 8,
      forks: 3,
      openIssues: 0,
      language: 'Python',
      languageColor: '#3572A5',
      updatedAt: '2026-06-10',
      visibility: 'Internal',
      htmlUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance/tree/main/services/chatbot-service',
      cloneUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance.git',
      topics: ['fastapi', 'mongodb', 'nlp', 'ai-chatbot'],
      lastCommitMsg: 'Login access to all faculty and chatbot widget integration',
      lastCommitAuthor: 'Huzaifa1102',
      lastCommitDate: '2026-06-10'
    },
    {
      id: '4',
      name: 'financial-service',
      fullName: 'D-A-D-group-3/financial-service',
      description: 'Student financial ledger microservice for tuition payment processing, invoices, and automated reminders.',
      stars: 4,
      forks: 1,
      openIssues: 0,
      language: 'Node.js',
      languageColor: '#68a063',
      updatedAt: '2026-06-08',
      visibility: 'Internal',
      htmlUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance/tree/main/services/financial-service',
      cloneUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance.git',
      topics: ['payments', 'invoices', 'express', 'postgresql'],
      lastCommitMsg: 'Added payment notification plugin and ledger queries',
      lastCommitAuthor: 'Huzaifa1102',
      lastCommitDate: '2026-06-08'
    },
    {
      id: '5',
      name: 'student-service',
      fullName: 'D-A-D-group-3/student-service',
      description: 'Student registration and file management microservice managing student profiles, enrollment, and status.',
      stars: 6,
      forks: 2,
      openIssues: 0,
      language: 'TypeScript',
      languageColor: '#3178c6',
      updatedAt: '2026-06-09',
      visibility: 'Internal',
      htmlUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance/tree/main/services/student-service',
      cloneUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance.git',
      topics: ['student-registration', 'enrollment-plugin', 'express'],
      lastCommitMsg: 'Updated student file controller and status plugins',
      lastCommitAuthor: 'Huzaifa1102',
      lastCommitDate: '2026-06-09'
    },
    {
      id: '6',
      name: 'scheduling-service',
      fullName: 'D-A-D-group-3/scheduling-service',
      description: 'Room scheduling and physical space logistics microservice for campus timetable collision detection.',
      stars: 3,
      forks: 1,
      openIssues: 0,
      language: 'TypeScript',
      languageColor: '#3178c6',
      updatedAt: '2026-06-07',
      visibility: 'Internal',
      htmlUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance/tree/main/services/scheduling-service',
      cloneUrl: 'https://github.com/D-A-D-group-3/novacampus-alliance.git',
      topics: ['timetable', 'room-scheduling', 'logistics'],
      lastCommitMsg: 'Implemented room availability map API',
      lastCommitAuthor: 'Huzaifa1102',
      lastCommitDate: '2026-06-07'
    }
  ];

  filteredRepos: RepositoryItem[] = [];

  ngOnInit() {
    this.filteredRepos = [...this.repositories];
    this.syncGitHubData();
  }

  syncGitHubData() {
    this.isSyncing = true;
    this.http.get<any>('https://api.github.com/repos/D-A-D-group-3/novacampus-alliance').subscribe({
      next: (data) => {
        if (data) {
          this.mainRepo.stars = data.stargazers_count || this.mainRepo.stars;
          this.mainRepo.forks = data.forks_count || this.mainRepo.forks;
          this.mainRepo.openIssues = data.open_issues_count || 0;
          this.mainRepo.updatedAt = data.updated_at ? data.updated_at.split('T')[0] : this.mainRepo.updatedAt;
        }
        this.isSyncing = false;
      },
      error: () => {
        this.isSyncing = false;
      }
    });
  }

  filterRepos() {
    this.filteredRepos = this.repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            repo.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            repo.topics.some(t => t.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesLang = this.selectedLanguage === 'All' || 
                          repo.language.toLowerCase() === this.selectedLanguage.toLowerCase() ||
                          repo.topics.some(t => t.toLowerCase().includes(this.selectedLanguage.toLowerCase()));
      
      return matchesSearch && matchesLang;
    });
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.filterRepos();
  }

  copyCloneUrl(url: string) {
    navigator.clipboard.writeText(url);
    this.copyToast = `Copied: ${url}`;
    setTimeout(() => {
      if (this.copyToast?.includes(url)) {
        this.copyToast = null;
      }
    }, 3500);
  }

  openRepoModal(repo: RepositoryItem) {
    this.selectedRepoModal = repo;
  }
}
