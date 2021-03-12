import { Component, OnInit, ViewChild } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
// import { listData } from '../../list';
import { ElementRef } from '@angular/core';
import { AllcoursesService } from './../allcourses.service';
import { courses } from './../ApiResponse';
import { HomeDialogComponent } from './home-dialog/home-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginserviceService } from '../loginservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('searchbar')
  searchbar!: ElementRef;
  searchText = '';
  list: any;
  user: any;
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private AllcoursesService: AllcoursesService,
    public dialog: MatDialog,
    private loginservice: LoginserviceService
  ) {}

  signOut(): void {
    this.authService.signOut();
    console.log('user signed out');
    this.router.navigateByUrl('/');
  }
  // list = listData.reverse();

  toggleSearch: boolean = false;

  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }

  ngOnInit(): void {
    if (!this.loginservice.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.AllcoursesService.courses().subscribe((response: courses) => {
      console.log(response);
      this.list = response;
    });

    this.user = this.loginservice.getUser();
    console.log(this.user);
  }

  gotocourse(i: number): void {
    this.AllcoursesService.courseid = i;
    this.router.navigate(['/course', i]);
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(HomeDialogComponent, {
      width: '400px',
      height: '600px',
      data: this.user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

      console.log(result);
      this.fetch();
    });
  }

  async fetch() {
    this.list = [];

    await this.AllcoursesService.courses().subscribe((response: courses) => {
      console.log(response);
      this.list = response;
      // this.router.onSameUrlNavigation = 'reload';
      // this.router.navigateByUrl('/home');
      location.reload();
    });
  }

  delete(i: number): void {
    this.AllcoursesService.courseid = i;
    this.AllcoursesService.deleteCourseById(i).subscribe(
      (response: boolean) => {
        console.log(response);
      }
    );
    this.fetch();
  }
  showTrends() {
    this.router.navigate(['trends']);
  }
}
