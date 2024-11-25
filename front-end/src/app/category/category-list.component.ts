import { Component, signal } from '@angular/core'
import { CategoryRepositoryService } from '../services/category-repository.service'
import { Category } from '../models/category.model'
import { CommonModule } from '@angular/common'
import { EditCategoryDialogComponent } from './edit-category-dialog.component'
import { DeleteCategoryDialogComponent } from './delete-category-dialog.component'

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    EditCategoryDialogComponent,
    DeleteCategoryDialogComponent,
  ],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  categories = signal<Category[]>([])
  isAddDialogOpen = false
  isEditDialogOpen = false
  isDeleteDialogOpen = false
  selectedCategory: Category | null = null

  constructor(private categoryRepository: CategoryRepositoryService) {}

  ngOnInit() {
    this.loadCategories()
  }

  loadCategories() {
    this.categoryRepository.getCategories().subscribe((categories) => {
      this.categories.set(categories)
    })
  }

  editCategory(category: Category) {
    this.selectedCategory = category
    this.isEditDialogOpen = true
  }

  deleteCategory(category: Category) {
    this.selectedCategory = category
    this.isDeleteDialogOpen = true
  }

  async confirmDeleteCategory() {
    if (this.selectedCategory) {
      this.categoryRepository
        .deleteCategory(this.selectedCategory.id)
        .subscribe(() => {
          this.isDeleteDialogOpen = false
          this.loadCategories()
        })
    }
  }
}
