import { Routes } from '@angular/router';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];