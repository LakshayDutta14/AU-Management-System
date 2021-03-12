import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SkillService } from 'src/app/skill.service';
import { AllcoursesService } from './../../allcourses.service';
import { user } from './../../ApiResponse';
import { MaterialService } from './../../material.service';
import { LoginserviceService } from './../../loginservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.css'],
})
export class HomeDialogComponent implements OnInit {
  data: any;
  openmaterial: boolean = false;
  openskill: boolean = false;
  list: any = [];
  skills: any = [];
  checked: boolean = false;
  courseid: any;
  material: any = [];
  materialObject: any = {};
  dialogformgroup!: FormGroup;
  firstform: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<HomeDialogComponent>,
    private service: AllcoursesService,
    private skillservice: SkillService,
    private materialservice: MaterialService,
    private loginservice: LoginserviceService,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  materialformgroup = new FormGroup({
    materialDescription: new FormControl('', Validators.required),
    fileType: new FormControl('', Validators.required),
    file: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.user = JSON.parse(this.user);
    console.log(typeof this.user);
    console.log(this.user['userId']);

    this.dialogformgroup = new FormGroup({
      courseDescription: new FormControl('', Validators.required),
      courseName: new FormControl('', Validators.required),
      prerequisite: new FormControl('', Validators.required),
      userId: new FormControl({ value: this.user['userId'], disabled: true }),
      imageUrl: new FormControl('', Validators.required),
    });
  }

  addcourse(): void {
    this.firstform = false;
    if (this.dialogformgroup.valid) {
      this.service
        .addCourse(this.dialogformgroup.getRawValue())
        .subscribe((response1) => {
          this.courseid = response1.courseId;
          console.log(this.courseid);
        });
      this.openmaterial = true;
      this.skillservice.getAllSkills().subscribe((response) => {
        console.log(response);
        this.list = response;
      });
    } else {
      this.close();
    }
    // this.dialogRef.close();
  }

  addmaterialandskill(): void {
    console.log(this.courseid);
    this.materialObject.courseId = this.courseid;
    this.materialObject.fileType = this.materialformgroup.controls[
      'fileType'
    ].value;
    this.materialObject.file = this.materialformgroup.controls[
      'file'
    ].value._files;
    this.materialObject.materialDescription = this.materialformgroup.controls[
      'materialDescription'
    ].value;

    this.materialservice
      .addmaterial(this.materialObject)
      .subscribe((response2) => {
        console.log(response2);
        this.material = response2;
      });
    console.log('inside material');
    this.openskill = true;
    console.log(this.skills);
  }

  addskills(ischecked: boolean, skillid: any): void {
    if (ischecked == true) {
      this.skills.push(skillid);
    } else {
      this.skills = this.skills.filter(function (dataitem: any) {
        return dataitem !== skillid;
      });
    }
    console.log(this.skills);
  }

  addfinally(): void {
    for (var i of this.skills) {
      this.skillservice
        .addSkillInCourse(this.courseid, i)
        .subscribe((response: boolean) => {
          console.log(response);
        });
    }
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
