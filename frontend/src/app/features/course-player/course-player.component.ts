import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { QuizService } from '../../core/services/quiz.service';
import { Course } from '../../core/models/course.model';
import { ButtonComponent } from '../../shared/ui/button/button';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
<div class="h-[calc(100vh-64px)] flex overflow-hidden bg-background">
  <!-- Sidebar Navigation -->
  <aside class="w-80 border-r border-outline-variant bg-surface-container flex flex-col h-full flex-shrink-0 transition-transform duration-300"
         [class.-translate-x-full]="!isSidebarOpen()"
         [class.hidden]="!isSidebarOpen() && isMobile()">
    <div class="p-md border-b border-outline-variant flex items-center justify-between">
      <h2 class="font-bold text-on-surface line-clamp-1 flex-1">{{ course()?.title || 'Loading...' }}</h2>
      <button class="material-symbols-outlined text-outline hover:text-on-surface" (click)="toggleSidebar()">close</button>
    </div>
    
    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <div *ngFor="let module of modules(); let i = index">
        <button class="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-surface-container-high transition-colors"
                (click)="toggleModule(i)">
          <span class="font-bold text-body-sm text-on-surface">Module {{ i + 1 }}: {{ module.title }}</span>
          <span class="material-symbols-outlined text-[18px] text-outline transition-transform"
                [class.rotate-180]="expandedModule() === i">expand_more</span>
        </button>
        
        <!-- Lessons/Quizzes list -->
        <div *ngIf="expandedModule() === i" class="pl-4 pr-2 py-2 space-y-1">
          <button *ngFor="let item of module.lessons"
                  class="w-full text-left px-3 py-2 rounded-md text-body-sm flex items-center gap-3 transition-colors"
                  [ngClass]="selectedItem()?.id === item.id ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'"
                  (click)="selectItem(item)">
            <span class="material-symbols-outlined text-[16px] shrink-0" 
                  [ngClass]="item.completed || isLessonCompleted(item.id) ? 'text-tertiary' : 'text-outline'">
              {{ item.completed || isLessonCompleted(item.id) ? 'check_circle' : (item.type === 'quiz' ? 'quiz' : 'article') }}
            </span>
            <span class="line-clamp-2">{{ item.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col h-full overflow-hidden bg-background relative"
        [class.-ml-80]="!isSidebarOpen() && !isMobile()">
    
    <!-- Top Bar -->
    <header class="h-14 border-b border-outline-variant bg-surface flex items-center justify-between px-md shrink-0">
      <div class="flex items-center gap-3">
        <button class="material-symbols-outlined text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-container"
                (click)="toggleSidebar()" *ngIf="!isSidebarOpen()">
          menu
        </button>
        <span class="text-body-sm font-label-caps text-on-surface-variant uppercase tracking-wider line-clamp-1">
          {{ selectedItem()?.title || 'Select a lesson' }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button app-button variant="secondary" size="sm" class="hidden sm:block" 
                *ngIf="selectedItem()?.type === 'assignment'"
                [disabled]="isLessonCompleted(selectedItem()?.id)"
                (click)="markLessonComplete(selectedItem())">
          {{ isLessonCompleted(selectedItem()?.id) ? 'Completed' : 'Mark as Complete' }}
        </button>
        <button class="material-symbols-outlined sm:hidden text-primary" 
                *ngIf="selectedItem()?.type === 'assignment' && isLessonCompleted(selectedItem()?.id)">
          check_circle
        </button>
      </div>
    </header>

    <!-- Reading Area / Quiz Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div *ngIf="isLoading() || isLoadingQuiz()" class="flex justify-center py-xl">
          <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>

        <!-- Lesson Render -->
        <article *ngIf="!isLoading() && !isLoadingQuiz() && selectedItem()?.type === 'assignment'" class="prose prose-invert prose-lg max-w-none prose-headings:text-on-surface prose-p:text-on-surface-variant prose-a:text-primary">
          <h1 class="text-display-sm font-bold mb-md">{{ selectedItem()?.title }}</h1>
          
          <div class="bg-surface-container rounded-xl p-md border border-outline-variant mb-lg flex items-center gap-3">
             <span class="material-symbols-outlined text-tertiary text-2xl">lightbulb</span>
             <p class="text-body-sm m-0">This lesson takes approximately 5 minutes to read.</p>
          </div>

          <div [innerHTML]="selectedItem()?.content"></div>

          <div class="mt-2xl flex items-center justify-between border-t border-outline-variant pt-lg">
            <button app-button variant="outline" (click)="navigateLesson(-1)">Previous Lesson</button>
            <button app-button variant="primary" (click)="navigateLesson(1)">Next Lesson</button>
          </div>
        </article>

        <!-- Quiz Render -->
        <div *ngIf="!isLoading() && !isLoadingQuiz() && selectedItem()?.type === 'quiz'" class="max-w-2xl mx-auto">
          <!-- Quiz Result Display -->
          <div *ngIf="quizResult()" class="bg-surface-container rounded-2xl p-xl border border-outline-variant text-center shadow-lg mt-xl">
            <div class="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-lg">
              <span class="material-symbols-outlined text-4xl">emoji_events</span>
            </div>
            <h2 class="text-display-xs font-bold text-on-surface mb-2">Quiz Completed!</h2>
            <p class="text-body-md text-on-surface-variant mb-xl">Here is your result:</p>
            
            <div class="bg-surface rounded-xl p-lg border border-outline-variant mb-xl max-w-xs mx-auto">
              <div class="text-[48px] font-bold text-primary leading-none">{{ quizResult()?.score }} / {{ quizResult()?.total }}</div>
              <div class="text-label-caps text-on-surface-variant font-label-caps mt-2">Correct Answers</div>
            </div>
            
            <div class="text-body-md text-tertiary font-bold mb-xl">
              +{{ quizResult()?.score * 10 }} XP points awarded!
            </div>

            <button app-button variant="primary" (click)="retakeQuiz()">Retake Quiz</button>
          </div>

          <!-- Active Quiz Form -->
          <div *ngIf="!quizResult()" class="space-y-xl">
            <div>
              <h1 class="text-display-sm font-bold text-on-surface mb-2">{{ selectedQuizDetails()?.title }}</h1>
              <p class="text-body-md text-on-surface-variant">{{ selectedQuizDetails()?.description || 'Answer the questions below to test your understanding.' }}</p>
            </div>

            <div class="space-y-lg">
              <div *ngFor="let question of selectedQuizDetails()?.questions; let qi = index" class="bg-surface-container rounded-xl p-lg border border-outline-variant">
                <h3 class="text-title-md font-bold text-on-surface mb-md">
                  {{ qi + 1 }}. {{ question.text }}
                </h3>
                <div class="grid grid-cols-1 gap-sm">
                  <label *ngFor="let option of question.options" 
                         class="flex items-center gap-md px-md py-sm rounded-lg border border-outline-variant hover:bg-surface-container-high cursor-pointer transition-colors"
                         [class.border-primary]="quizAnswers()[question.id] === option.id"
                         [class.bg-primary/5]="quizAnswers()[question.id] === option.id">
                    <input 
                      type="radio" 
                      [name]="'question_' + question.id" 
                      [value]="option.id"
                      [checked]="quizAnswers()[question.id] === option.id"
                      (change)="selectOption(question.id, option.id)"
                      class="w-4 h-4 text-primary bg-surface border-outline-variant focus:ring-primary focus:ring-offset-surface"
                    />
                    <span class="text-body-md text-on-surface-variant"
                          [class.text-on-surface]="quizAnswers()[question.id] === option.id">
                      {{ option.text }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="pt-lg border-t border-outline-variant flex items-center justify-between">
              <span class="text-body-sm text-on-surface-variant">
                {{ getAnsweredCount() }} of {{ selectedQuizDetails()?.questions?.length || 0 }} questions answered
              </span>
              <button app-button 
                      variant="primary" 
                      [disabled]="isSubmittingQuiz() || getAnsweredCount() === 0"
                      (click)="submitQuizAnswers()">
                {{ isSubmittingQuiz() ? 'Submitting...' : 'Submit Answers' }}
              </button>
            </div>
            <p *ngIf="quizError()" class="text-error text-body-sm mt-2 text-right">{{ quizError() }}</p>
          </div>
        </div>

      </div>
    </div>
  </main>
</div>
  `,
  styles: `
    :host { display: block; }
  `
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  private dashboardService = inject(DashboardService);
  private quizService = inject(QuizService);

  course = signal<Course | null>(null);
  isLoading = signal(true);
  isLoadingQuiz = signal(false);
  
  isSidebarOpen = signal(true);
  expandedModule = signal<number>(0);
  
  // Quiz states
  selectedItem = signal<any>(null);
  selectedQuizDetails = signal<any>(null);
  quizAnswers = signal<Record<number, number>>({});
  quizResult = signal<any>(null);
  isSubmittingQuiz = signal(false);
  quizError = signal<string | null>(null);

  // Completion local state
  completedLessons = signal<string[]>([]);

  isMobile() {
    return window.innerWidth < 768;
  }

  mockModules = [
    {
      title: 'Introduction to the Course',
      lessons: [
        { id: 'l1', dbId: 1, type: 'assignment' as const, title: 'Welcome and Overview', completed: true, content: '<p>Welcome to this course. In this lesson, we will cover the basic structure of what you will learn.</p><h3>Prerequisites</h3><ul><li>Basic understanding of programming</li><li>A code editor</li></ul>' },
        { id: 'l2', dbId: 2, type: 'assignment' as const, title: 'Setting up your environment', completed: false, content: '<p>Before we begin coding, we need to set up our tools.</p><pre><code>npm install -g @angular/cli</code></pre><p>Make sure you have Node.js installed.</p>' }
      ]
    }
  ];

  modules = computed(() => {
    const c = this.course();
    if (!c || !c.modules || c.modules.length === 0) {
      return this.mockModules;
    }

    return c.modules.map(mod => {
      const lessons = (mod.assignments || []).map(assign => ({
        id: `a_${assign.id}`,
        dbId: assign.id,
        type: 'assignment' as const,
        title: assign.title,
        completed: false,
        content: assign.description ? `<p>${assign.description.replace(/\n/g, '<br>')}</p>` : '<p>No content details provided.</p>'
      }));

      const quizzes = (mod.quizzes || []).map(quiz => ({
        id: `q_${quiz.id}`,
        dbId: quiz.id,
        type: 'quiz' as const,
        title: quiz.title,
        completed: false,
        content: quiz.description || 'Test your knowledge with this quiz.'
      }));

      return {
        title: mod.title,
        lessons: [...lessons, ...quizzes]
      };
    });
  });

  ngOnInit() {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coursesService.getCourseById(+id).subscribe({
        next: (data) => {
          this.course.set(data);
          this.isLoading.set(false);
          
          // Select first lesson by default
          const mods = this.modules();
          if (mods.length > 0 && mods[0].lessons.length > 0) {
            this.selectItem(mods[0].lessons[0]);
          }
        },
        error: () => {
          this.isLoading.set(false);
          if (this.mockModules.length > 0 && this.mockModules[0].lessons.length > 0) {
            this.selectItem(this.mockModules[0].lessons[0]);
          }
        }
      });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  toggleModule(index: number) {
    this.expandedModule.set(this.expandedModule() === index ? -1 : index);
  }

  selectItem(item: any) {
    this.selectedItem.set(item);
    this.quizResult.set(null);
    this.quizAnswers.set({});
    this.quizError.set(null);

    if (item.type === 'quiz') {
      this.isLoadingQuiz.set(true);
      this.quizService.getQuiz(item.dbId).subscribe({
        next: (data) => {
          this.selectedQuizDetails.set(data);
          this.isLoadingQuiz.set(false);
        },
        error: () => {
          this.quizError.set('Failed to load quiz questions.');
          this.isLoadingQuiz.set(false);
        }
      });
    } else {
      this.selectedQuizDetails.set(null);
      // Track action
      this.dashboardService.trackActivity('VIEW_LESSON', `Viewed lesson: ${item.title} (ID: ${item.dbId})`).subscribe();
    }

    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }

  selectOption(questionId: number, optionId: number) {
    this.quizAnswers.update(answers => ({
      ...answers,
      [questionId]: optionId
    }));
  }

  getAnsweredCount(): number {
    return Object.keys(this.quizAnswers()).length;
  }

  submitQuizAnswers() {
    const item = this.selectedItem();
    if (!item) return;

    this.isSubmittingQuiz.set(true);
    this.quizError.set(null);

    this.quizService.submitQuiz(item.dbId, this.quizAnswers()).subscribe({
      next: (res) => {
        this.quizResult.set(res);
        this.isSubmittingQuiz.set(false);
      },
      error: (err) => {
        console.error(err);
        this.quizError.set(err.error?.message || 'Failed to submit quiz.');
        this.isSubmittingQuiz.set(false);
      }
    });
  }

  retakeQuiz() {
    this.quizResult.set(null);
    this.quizAnswers.set({});
    this.quizError.set(null);
  }

  isLessonCompleted(id: string): boolean {
    return this.completedLessons().includes(id);
  }

  markLessonComplete(lesson: any) {
    if (!lesson) return;
    if (!this.completedLessons().includes(lesson.id)) {
      this.completedLessons.update(list => [...list, lesson.id]);
      this.dashboardService.trackActivity('COMPLETE_LESSON', `Completed: ${lesson.title} (ID: ${lesson.dbId})`).subscribe();
    }
  }

  navigateLesson(direction: number) {
    const currentItem = this.selectedItem();
    if (!currentItem) return;

    const allItems: any[] = [];
    this.modules().forEach(m => {
      m.lessons.forEach(l => allItems.push(l));
    });

    const index = allItems.findIndex(i => i.id === currentItem.id);
    const nextIndex = index + direction;

    if (nextIndex >= 0 && nextIndex < allItems.length) {
      this.selectItem(allItems[nextIndex]);
    }
  }
}
