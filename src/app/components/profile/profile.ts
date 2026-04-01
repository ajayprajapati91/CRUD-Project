import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserCrudService } from '../../services/user-crud.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true,
   imports: [CommonModule]
})
export class Profile implements OnInit {

  myActiveRoutes = inject(ActivatedRoute);
  myService = inject(UserCrudService);
  changeDetector = inject(ChangeDetectorRef);

  myId: any;
  user: any = null;

  ngOnInit(): void {

    this.myActiveRoutes.paramMap.subscribe((params: ParamMap) => {

      this.myId = params.get('id');
      console.log('User ID:', this.myId);

      // ✅ API call AFTER ID is available
      this.myService.getById(this.myId).subscribe((resp: any) => {
        console.log('API Response:', resp);

        this.user = resp; // ✅ IMPORTANT

        this.changeDetector.detectChanges(); // optional
      });

    });

  }
}