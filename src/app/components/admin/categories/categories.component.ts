import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Category, CategoryPayload } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  categories: Category[] = [];
  loading = false;
  saving = false;
  deleting = false;
  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  modalMode: ModalMode = null;
  selectedCategory: Category | null = null;
  deleteTarget: Category | null = null;

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['active' as 'active' | 'inactive', Validators.required]
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  get filteredCategories(): Category[] {
    const term = this.searchTerm.trim().toLocaleLowerCase('vi');
    return this.categories.filter(category => {
      const matchesName = !term ||
        category.name.toLocaleLowerCase('vi').includes(term) ||
        (category.description ?? '').toLocaleLowerCase('vi').includes(term);
      const matchesStatus = this.statusFilter === 'all' || category.status === this.statusFilter;
      return matchesName && matchesStatus;
    });
  }

  get activeCount(): number {
    return this.categories.filter(c => c.status === 'active').length;
  }

  get inactiveCount(): number {
    return this.categories.filter(c => c.status === 'inactive').length;
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';
    this.categoryService.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: result => {
          // Hỗ trợ API trả về trực tiếp mảng hoặc dạng { data: [...] }.
          const rows = Array.isArray(result)
            ? result
            : ((result as unknown as { data?: Category[] }).data ?? []);
          this.categories = rows;
        },
        error: err => {
          console.error('Load categories failed:', err);
          this.errorMessage = 'Không tải được danh mục. Hãy kiểm tra backend, URL API và cấu hình CORS.';
        }
      });
  }

  openCreateModal(): void {
    this.clearMessages();
    this.selectedCategory = null;
    this.categoryForm.reset({ name: '', description: '', status: 'active' });
    this.modalMode = 'create';
  }

  openEditModal(category: Category): void {
    this.clearMessages();
    this.selectedCategory = category;
    this.categoryForm.reset({
      name: category.name,
      description: category.description ?? '',
      status: category.status
    });
    this.modalMode = 'edit';
  }

  closeModal(): void {
    if (this.saving) return;
    this.modalMode = null;
    this.selectedCategory = null;
  }

  saveCategory(): void {
    this.clearMessages();
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload: CategoryPayload = {
      name: this.categoryForm.controls.name.value.trim(),
      description: this.categoryForm.controls.description.value.trim(),
      status: this.categoryForm.controls.status.value
    };

    if (!payload.name) {
      this.categoryForm.controls.name.setErrors({ required: true });
      this.categoryForm.controls.name.markAsTouched();
      return;
    }

    this.saving = true;
    const isEdit = this.modalMode === 'edit';
    const id = this.selectedCategory ? this.getCategoryId(this.selectedCategory) : '';

    const request = isEdit
      ? this.categoryService.update(id, payload)
      : this.categoryService.create(payload);

    request.pipe(finalize(() => this.saving = false)).subscribe({
      next: () => {
        this.modalMode = null;
        this.selectedCategory = null;
        this.successMessage = isEdit ? 'Cập nhật danh mục thành công.' : 'Thêm danh mục thành công.';
        this.loadCategories();
      },
      error: err => {
        console.error('Save category failed:', err);
        this.errorMessage = this.getApiError(err, 'Không thể lưu danh mục. Hãy kiểm tra API backend.');
      }
    });
  }

  askDelete(category: Category): void {
    this.clearMessages();
    this.deleteTarget = category;
  }

  cancelDelete(): void {
    if (this.deleting) return;
    this.deleteTarget = null;
  }

  confirmDelete(): void {
    if (!this.deleteTarget) return;
    const id = this.getCategoryId(this.deleteTarget);
    if (!id) {
      this.errorMessage = 'Danh mục không có ID hợp lệ nên không thể xóa.';
      this.deleteTarget = null;
      return;
    }

    this.deleting = true;
    this.categoryService.delete(id)
      .pipe(finalize(() => this.deleting = false))
      .subscribe({
        next: () => {
          this.deleteTarget = null;
          this.successMessage = 'Xóa danh mục thành công.';
          this.loadCategories();
        },
        error: err => {
          console.error('Delete category failed:', err);
          this.errorMessage = this.getApiError(err, 'Không thể xóa danh mục. Hãy kiểm tra API backend.');
        }
      });
  }

  trackByCategory(_index: number, category: Category): string {
    return this.getCategoryId(category) || category.name;
  }

  private getCategoryId(category: Category): string {
    return String(category._id ?? category.id ?? '');
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private getApiError(err: any, fallback: string): string {
    return err?.error?.message || err?.error?.error || fallback;
  }
}
