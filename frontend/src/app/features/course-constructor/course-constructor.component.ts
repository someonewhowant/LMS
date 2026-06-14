import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { ButtonComponent } from '../../shared/ui/button/button';

@Component({
  selector: 'app-course-constructor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
<div class="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
  <div class="flex items-center justify-between mb-xl pb-md border-b border-outline-variant">
    <div>
      <h1 class="text-display-sm font-bold text-on-surface">Course Constructor</h1>
      <p class="text-body-md text-on-surface-variant">Design your curriculum by adding modules, lessons, and quizzes.</p>
    </div>
    <div class="flex gap-4">
      <button app-button variant="secondary" (click)="cancel()">Cancel</button>
      <button app-button variant="primary" (click)="onSubmit()" [disabled]="courseForm.invalid || isSubmitting">
        {{ isSubmitting ? 'Publishing...' : 'Publish Course' }}
      </button>
    </div>
  </div>

  <form [formGroup]="courseForm" class="space-y-xl">
    
    <!-- Course Details Section -->
    <div class="bg-surface-container rounded-2xl p-xl border border-outline-variant">
      <h2 class="text-title-lg font-bold text-on-surface mb-lg flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">info</span>
        Basic Information
      </h2>
      
      <div class="space-y-md">
        <div class="space-y-1">
          <label class="block text-[12px] font-label-caps text-on-surface-variant">Course Title</label>
          <input 
            type="text" 
            formControlName="title"
            class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
            placeholder="e.g., Advanced NestJS Patterns"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[12px] font-label-caps text-on-surface-variant">Description</label>
          <textarea 
            formControlName="description"
            rows="3"
            class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline resize-y"
            placeholder="What will students learn?"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Modules Section -->
    <div class="space-y-lg">
      <div class="flex items-center justify-between">
        <h2 class="text-title-lg font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-tertiary">view_list</span>
          Curriculum Modules
        </h2>
        <button type="button" app-button variant="secondary" size="sm" (click)="addModule()">
          <span class="material-symbols-outlined text-[18px]">add</span> Add Module
        </button>
      </div>

      <div formArrayName="modules" class="space-y-lg">
        <div *ngFor="let module of modules.controls; let mIndex=index" [formGroupName]="mIndex" class="bg-surface-container rounded-2xl p-xl border border-outline-variant relative group">
          
          <button type="button" class="absolute top-4 right-4 text-outline hover:text-error transition-colors" (click)="removeModule(mIndex)" title="Remove Module">
            <span class="material-symbols-outlined">delete</span>
          </button>

          <div class="flex items-center gap-4 mb-lg pr-8">
            <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface shrink-0 border border-outline-variant">
              {{ mIndex + 1 }}
            </div>
            <div class="flex-1 space-y-1">
              <input 
                type="text" 
                formControlName="title"
                class="w-full bg-transparent border-b border-outline-variant py-1 text-title-md text-on-surface focus:border-primary outline-none transition-all placeholder:text-outline"
                placeholder="Module Title (e.g., Introduction to Architecture)"
              />
            </div>
          </div>

          <div class="space-y-1 mb-xl pl-14">
            <textarea 
              formControlName="content"
              rows="2"
              class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-4 text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline resize-y"
              placeholder="Module description or objectives..."
            ></textarea>
          </div>

          <div class="pl-14 space-y-lg">
            
            <!-- Lessons (Assignments) -->
            <div formArrayName="assignments" class="space-y-4">
              <h4 class="text-[12px] font-label-caps text-on-surface-variant flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">menu_book</span> Lessons
              </h4>
              
              <div *ngFor="let assignment of getAssignments(mIndex).controls; let aIndex=index" [formGroupName]="aIndex" class="bg-surface-container-high rounded-xl p-md border border-outline-variant flex gap-4 items-start relative">
                <button type="button" class="absolute top-2 right-2 text-outline hover:text-error" (click)="removeAssignment(mIndex, aIndex)">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
                
                <span class="material-symbols-outlined text-outline mt-2">drag_indicator</span>
                <div class="flex-1 space-y-md pr-6">
                  <input type="text" formControlName="title" class="w-full bg-transparent border-b border-outline-variant py-1 text-body-md text-on-surface focus:border-primary outline-none" placeholder="Lesson Title" />
                  <textarea formControlName="content" rows="3" class="w-full bg-surface-container border border-outline-variant rounded-lg py-2 px-3 text-body-sm text-on-surface focus:border-primary outline-none" placeholder="Lesson content (Markdown supported)"></textarea>
                </div>
              </div>

              <button type="button" class="text-[14px] text-primary hover:underline flex items-center gap-1 font-bold" (click)="addAssignment(mIndex)">
                <span class="material-symbols-outlined text-[16px]">add</span> Add Lesson
              </button>
            </div>

            <!-- Quizzes -->
            <div formArrayName="quizzes" class="space-y-4 pt-md border-t border-outline-variant">
              <h4 class="text-[12px] font-label-caps text-on-surface-variant flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">quiz</span> Quizzes
              </h4>
              
              <div *ngFor="let quiz of getQuizzes(mIndex).controls; let qIndex=index" [formGroupName]="qIndex" class="bg-surface-container-high rounded-xl p-md border border-outline-variant relative">
                <button type="button" class="absolute top-2 right-2 text-outline hover:text-error" (click)="removeQuiz(mIndex, qIndex)">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
                
                <div class="space-y-4 pr-6">
                  <div class="flex gap-4">
                    <input type="text" formControlName="title" class="flex-1 bg-transparent border-b border-outline-variant py-1 text-body-md text-on-surface focus:border-tertiary outline-none" placeholder="Quiz Title" />
                    <input type="number" formControlName="passingScore" class="w-24 bg-surface-container border border-outline-variant rounded-lg py-1 px-2 text-body-sm text-on-surface focus:border-tertiary outline-none text-center" placeholder="Pass %" min="0" max="100" />
                  </div>
                  
                  <!-- Questions Array -->
                  <div formArrayName="questions" class="space-y-2 pl-4 border-l-2 border-outline-variant">
                    <div *ngFor="let question of getQuestions(mIndex, qIndex).controls; let quIndex=index" [formGroupName]="quIndex" class="flex gap-2 items-start relative bg-surface-container p-2 rounded">
                      <button type="button" class="text-outline hover:text-error absolute right-2 top-2" (click)="removeQuestion(mIndex, qIndex, quIndex)">
                         <span class="material-symbols-outlined text-[14px]">close</span>
                      </button>
                      <div class="flex-1 space-y-2 pr-6">
                        <input type="text" formControlName="text" class="w-full bg-transparent border-b border-outline-variant py-1 text-[13px] text-on-surface outline-none" placeholder="Question text" />
                        <div class="flex gap-2">
                          <input type="text" formControlName="options" class="flex-1 bg-surface-container-high border border-outline-variant rounded px-2 py-1 text-[12px] text-on-surface outline-none" placeholder="Options (comma separated)" />
                          <input type="text" formControlName="correctAnswer" class="flex-1 bg-surface-container-high border border-outline-variant rounded px-2 py-1 text-[12px] text-on-surface outline-none" placeholder="Correct Answer" />
                        </div>
                      </div>
                    </div>
                    <button type="button" class="text-[12px] text-tertiary hover:underline flex items-center gap-1 mt-2" (click)="addQuestion(mIndex, qIndex)">
                      <span class="material-symbols-outlined text-[14px]">add</span> Add Question
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" class="text-[14px] text-tertiary hover:underline flex items-center gap-1 font-bold" (click)="addQuiz(mIndex)">
                <span class="material-symbols-outlined text-[16px]">add</span> Add Quiz
              </button>
            </div>

          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="modules.length === 0" class="bg-surface-container-low border border-dashed border-outline rounded-2xl p-2xl flex flex-col items-center justify-center text-center">
        <span class="material-symbols-outlined text-4xl text-outline mb-4">post_add</span>
        <h3 class="text-title-md font-bold text-on-surface mb-2">No Modules Yet</h3>
        <p class="text-body-sm text-on-surface-variant max-w-sm mb-6">Create your first module to start building the curriculum for your students.</p>
        <button type="button" app-button variant="primary" (click)="addModule()">Add First Module</button>
      </div>
    </div>
  </form>
</div>
  `,
  styles: ``
})
export class CourseConstructorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private router = inject(Router);

  courseForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      modules: this.fb.array([])
    });
    
    // Add one default module to start
    this.addModule();
  }

  get modules() {
    return this.courseForm.get('modules') as FormArray;
  }

  // --- Modules ---
  addModule() {
    const moduleGroup = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      assignments: this.fb.array([]),
      quizzes: this.fb.array([])
    });
    this.modules.push(moduleGroup);
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  // --- Assignments (Lessons) ---
  getAssignments(moduleIndex: number) {
    return this.modules.at(moduleIndex).get('assignments') as FormArray;
  }

  addAssignment(moduleIndex: number) {
    const assignmentGroup = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.getAssignments(moduleIndex).push(assignmentGroup);
  }

  removeAssignment(moduleIndex: number, assignmentIndex: number) {
    this.getAssignments(moduleIndex).removeAt(assignmentIndex);
  }

  // --- Quizzes ---
  getQuizzes(moduleIndex: number) {
    return this.modules.at(moduleIndex).get('quizzes') as FormArray;
  }

  addQuiz(moduleIndex: number) {
    const quizGroup = this.fb.group({
      title: ['', Validators.required],
      passingScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
      questions: this.fb.array([])
    });
    this.getQuizzes(moduleIndex).push(quizGroup);
    
    // Auto-add first question
    this.addQuestion(moduleIndex, this.getQuizzes(moduleIndex).length - 1);
  }

  removeQuiz(moduleIndex: number, quizIndex: number) {
    this.getQuizzes(moduleIndex).removeAt(quizIndex);
  }

  // --- Questions ---
  getQuestions(moduleIndex: number, quizIndex: number) {
    return this.getQuizzes(moduleIndex).at(quizIndex).get('questions') as FormArray;
  }

  addQuestion(moduleIndex: number, quizIndex: number) {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      options: ['', Validators.required], // Store as comma separated for simple UI
      correctAnswer: ['', Validators.required]
    });
    this.getQuestions(moduleIndex, quizIndex).push(questionGroup);
  }

  removeQuestion(moduleIndex: number, quizIndex: number, questionIndex: number) {
    this.getQuestions(moduleIndex, quizIndex).removeAt(questionIndex);
  }

  // --- Actions ---
  cancel() {
    this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    const formValue = this.courseForm.value;
    
    // Prepare backend payload (mocking creation since backend might need sequential API calls for nested relations)
    const payload = {
      title: formValue.title,
      description: formValue.description,
      isPublished: true
    };

    console.log('Publishing course with full structure:', formValue);

    // Call API
    // In a complete implementation, this would:
    // 1. POST /courses
    // 2. Loop and POST /course-modules
    // 3. Loop and POST /assignments and /quizzes
    
    // For now, let's just simulate the backend delay and navigate
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/dashboard']);
    }, 1500);
  }
}
