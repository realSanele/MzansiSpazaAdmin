import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'myspazas', loadChildren: './myspazas/myspazas.module#MyspazasPageModule' },
  { path: 'addspaza', loadChildren: './addspaza/addspaza.module#AddspazaPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'catalog', loadChildren: './catalog/catalog.module#CatalogPageModule' },
  { path: 'add-items', loadChildren: './add-items/add-items.module#AddItemsPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
