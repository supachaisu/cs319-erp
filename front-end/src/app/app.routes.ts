import { Routes } from '@angular/router'
import { TransactionListComponent } from './transactions/transaction-list.component'
import { CategoryListComponent } from './category/category-list.component'
import { StatusListComponent } from './status/status-list.component'

export const routes: Routes = [
  { path: '', component: TransactionListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'statuses', component: StatusListComponent },
]
