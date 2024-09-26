import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from './dashboard/crm/crm.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'crm', pathMatch: 'full' },
    { path: 'crm', component: CrmComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
