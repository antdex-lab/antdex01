// import { Component } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { RouterLink } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgIf } from '@angular/common';
// import { Router } from '@angular/router';
// import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

// @Component({
//     selector: 'app-sign-in',
//     standalone: true,
//     imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
//     templateUrl: './sign-in.component.html',
//     styleUrl: './sign-in.component.scss'
// })
// export class SignInComponent {

//     // isToggled
//     isToggled = false;

//     constructor(
//         private fb: FormBuilder,
//         private router: Router,
//         public themeService: CustomizerSettingsService
//     ) {
//         this.authForm = this.fb.group({
//             email: ['', [Validators.required, Validators.email]],
//             password: ['', [Validators.required, Validators.minLength(8)]],
//         });
//         this.themeService.isToggled$.subscribe(isToggled => {
//             this.isToggled = isToggled;
//         });
//     }

//     // Password Hide
//     hide = true;

//     // Form
//     authForm: FormGroup;
//     onSubmit() {
//         if (this.authForm.valid) {
//             this.router.navigate(['/']);
//         } else {
//             console.log('Form is invalid. Please check the fields.');
//         }
//     }

// }
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../auth.service'; // Import AuthService

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  // isToggled
  isToggled = false;

  // Password Hide
  hide = true;

  // Form
  authForm: FormGroup;
  error: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService, // Inject AuthService
    public themeService: CustomizerSettingsService
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  onSubmit() {
    const { username, password } = this.authForm.value;

    if (this.authForm.valid) {
      if (this.authService.login(username, password)) {
        // Successful login
        this.router.navigate(['/crm']);
      } else {
        // Invalid credentials
        this.error = 'Username or password is incorrect';
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}

