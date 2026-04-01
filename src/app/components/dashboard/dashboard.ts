import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CrudUser } from '../../models/crud-user.model';
import { UpdateUserDto, UserCrudService } from '../../services/user-crud.service';
import { Router } from '@angular/router';

type ToastKind = 'success' | 'error';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  myRoute = inject(Router)

  records: CrudUser[] = [];

  viewMode: 'all' | 'byId' | null = null;
  activeId = '';

  idInput: number | null = null;

  loggedInEmail: string | null = null;

  showUpdateModal = false;
  updateTarget: CrudUser | null = null;
  updateDraft: {
    fullName: string;
    email: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
    city: string;
    password: string;
  } = {
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    city: '',
    password: '',
  };
  cityOptions: string[] = ['Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];

  showDeleteModal = false;
  deleteTarget: CrudUser | null = null;

  toastText = '';
  toastKind: ToastKind = 'success';
  private toastTimer: number | undefined;

  constructor(
    private readonly userCrud: UserCrudService,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loggedInEmail = this.auth.getLoggedInEmail();
  }

  logout(): void {
    this.auth.logout();
  }

  private showToast(message: string, kind: ToastKind): void {
    this.toastText = message;
    this.toastKind = kind;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toastText = '';
    }, 2800);
  }

  getAll(): void {
    this.userCrud.getAll().subscribe({
      next: (users) => {
        this.records = users;
        this.viewMode = 'all';
        this.activeId = '';
        if (!users.length) {
          this.showToast('No registrations found yet.', 'error');
        }
      },
      error: () => this.showToast('Failed to load data.', 'error'),
    });
  }

  profileDetails(id: any): void {
  this.myRoute.navigate(['profile', id]);
}

  getById(): void {
    const raw = this.idInput;
    const id = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(id) || id <= 0) {
      this.showToast('Please enter a valid numeric ID.', 'error');
      return;
    }

    this.userCrud.getById(id).subscribe({
      next: (user) => {
        if (!user) {
          this.records = [];
          this.viewMode = 'byId';
          this.activeId = String(id);
          this.showToast(`No record found for ID ${id}.`, 'error');
          return;
        }
        this.records = [user];
        this.viewMode = 'byId';
        this.activeId = String(id);
      },
      error: () => this.showToast('Failed to load record by ID.', 'error'),
    });
  }

  deleteAll(): void {
    const confirmed = window.confirm(
      'Delete ALL records? This will remove every registration from the table.'
    );
    if (!confirmed) return;

    this.userCrud.deleteAll().subscribe({
      next: (count) => {
        this.records = [];
        this.viewMode = null;
        this.activeId = '';
        this.showToast(`Deleted ${count} record(s).`, 'success');
      },
      error: () => this.showToast('Failed to delete all records.', 'error'),
    });
  }

  openUpdate(user: CrudUser): void {
    console.log('Clicked update for:', user);
    this.updateTarget = user;
    this.updateDraft = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      city: user.city,
      password: '',
    };
    this.showUpdateModal = true;
  }

  cancelUpdate(): void {
    this.showUpdateModal = false;
    this.updateTarget = null;
  }

  // saveUpdate(): void {
  //   if (!this.updateTarget) return;

  //   const patch: UpdateUserDto = {
  //     // fullName: this.updateDraft.fullName,
  //     // email: this.updateDraft.email,
  //     // phone: this.updateDraft.phone,
  //     // gender: this.updateDraft.gender,
  //     // city: this.updateDraft.city,
  //   };

  // if (this.updateDraft.fullName !== this.updateTarget.fullName) patch.fullName = this.updateDraft.fullName;
  // if (this.updateDraft.email !== this.updateTarget.email) patch.email = this.updateDraft.email;
  // if (this.updateDraft.phone !== this.updateTarget.phone) patch.phone = this.updateDraft.phone;
  // if (this.updateDraft.gender !== this.updateTarget.gender) patch.gender = this.updateDraft.gender;
  // if (this.updateDraft.city !== this.updateTarget.city) patch.city = this.updateDraft.city;

  //   const password = this.updateDraft.password.trim();
  //   if (password) {
  //     patch.password = password;
  //   }
  //   console.log('Sending update payload:', patch);

  //   this.userCrud.updateById(this.updateTarget.id, patch).subscribe({
  //     next: (updated) => {
  //       console.log('Backend updated response:', updated)
  //       this.showUpdateModal = false;
  //       this.updateTarget = null;

  //        this.getAll();

  //       // const idx = this.records.findIndex((r) => r.id === updated.id);
  //       // if (idx >= 0) this.records[idx] = updated;
  //       // else this.records = [updated];

  //       this.showToast('Record updated successfully.', 'success');
  //     },
  //     error: (err: unknown) => {
  //       const msg = err instanceof Error ? err.message : 'Update failed.';
  //       this.showToast(msg, 'error');
  //     },
  //   });
  // }

 saveUpdate(): void {
  if (!this.updateTarget) return;

  const patch: UpdateUserDto = {};
  if (this.updateDraft.fullName !== this.updateTarget.fullName) patch.fullName = this.updateDraft.fullName;
  if (this.updateDraft.email !== this.updateTarget.email) patch.email = this.updateDraft.email;
  if (this.updateDraft.phone !== this.updateTarget.phone) patch.phone = this.updateDraft.phone;
  if (this.updateDraft.gender !== this.updateTarget.gender) patch.gender = this.updateDraft.gender;
  if (this.updateDraft.city !== this.updateTarget.city) patch.city = this.updateDraft.city;
  if (this.updateDraft.password.trim()) patch.password = this.updateDraft.password.trim();

  if (Object.keys(patch).length === 0) {
    this.showToast('No changes made.', 'error');
    return;
  }

  console.log('Sending update payload:', patch);

  this.userCrud.updateById(this.updateTarget.id, patch).subscribe({
    next: () => {
      this.showUpdateModal = false;
      this.updateTarget = null;

      // Refresh the table to reflect backend changes
      this.getAll();

      this.showToast('Record updated successfully.', 'success');
    },
    error: (err) => {
      console.error(err);
      this.showToast('Update failed.', 'error');
    },
  });
}

  openDelete(user: CrudUser): void {
    this.deleteTarget = user;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }

  confirmDelete(): void {
    if (!this.deleteTarget) return;
    const id = this.deleteTarget.id;

    this.userCrud.deleteById(id).subscribe({
      next: (deleted) => {
        this.showDeleteModal = false;
        this.deleteTarget = null;

        if (deleted) {
          this.records = this.records.filter((r) => r.id !== id);
          this.showToast(`Deleted record ID ${id}.`, 'success');
        } else {
          this.showToast('Delete failed: record not found.', 'error');
        }
      },
      error: () => this.showToast('Delete failed.', 'error'),
    });
  }
}
