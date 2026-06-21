import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { BloodDonationAppointment, ExternalCollectionPoint } from '../../models/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, DropdownModule, CalendarModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>献血预约管理</h2>
      <p-button label="新增预约" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>
    <div class="p-fluid" style="margin-bottom:12px">
      <div class="field" style="max-width:400px">
        <label>选择外采点</label>
        <p-dropdown [(ngModel)]="selectedCpId" [options]="collectionPoints" optionLabel="name" optionValue="id" placeholder="选择外采点" (onChange)="loadAppointments()"></p-dropdown>
      </div>
    </div>
    <p-table [value]="appointments" [tableStyle]="{'min-width': '50rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr><th>姓名</th><th>身份证号</th><th>手机号</th><th>血型</th><th>预约时间</th><th>状态</th><th>操作</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-appt>
        <tr>
          <td>{{appt.donorName}}</td>
          <td>{{appt.donorIdNumber}}</td>
          <td>{{appt.donorPhone}}</td>
          <td>{{appt.bloodType}}</td>
          <td>{{appt.appointmentTime | date:'yyyy-MM-dd HH:mm'}}</td>
          <td><p-tag [severity]="appt.status==='Completed'?'success':appt.status==='Cancelled'?'danger':'info'" [value]="appt.status"></p-tag></td>
          <td>
            <p-button *ngIf="appt.status==='Scheduled'" label="完成" severity="success" size="small" (onClick)="updateStatus(appt.id, 'Completed')"></p-button>
            <p-button *ngIf="appt.status==='Scheduled'" label="取消" severity="danger" size="small" (onClick)="updateStatus(appt.id, 'Cancelled')"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="新增预约" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:300px">
        <div class="field"><label>外采点</label><p-dropdown [(ngModel)]="newAppt.collectionPointId" [options]="collectionPoints" optionLabel="name" optionValue="id"></p-dropdown></div>
        <div class="field"><label>献血者姓名</label><input pInputText [(ngModel)]="newAppt.donorName" /></div>
        <div class="field"><label>身份证号</label><input pInputText [(ngModel)]="newAppt.donorIdNumber" /></div>
        <div class="field"><label>手机号</label><input pInputText [(ngModel)]="newAppt.donorPhone" /></div>
        <div class="field"><label>血型</label><p-dropdown [(ngModel)]="newAppt.bloodType" [options]="bloodTypes"></p-dropdown></div>
        <div class="field"><label>预约时间</label><p-calendar [(ngModel)]="newAppt.appointmentTime" [showTime]="true"></p-calendar></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="保存" (onClick)="create()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: BloodDonationAppointment[] = [];
  collectionPoints: ExternalCollectionPoint[] = [];
  selectedCpId = '';
  showDialog = false;
  newAppt: any = {};
  bloodTypes = [
    { label: 'A型', value: 'A' }, { label: 'B型', value: 'B' },
    { label: 'AB型', value: 'AB' }, { label: 'O型', value: 'O' }
  ];

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void { this.api.getCollectionPoints().subscribe(d => this.collectionPoints = d); }

  loadAppointments(): void {
    if (this.selectedCpId) this.api.getAppointments(this.selectedCpId).subscribe(d => this.appointments = d);
  }

  create(): void {
    this.api.createAppointment(this.newAppt).subscribe({
      next: () => { this.showDialog = false; this.newAppt = {}; this.loadAppointments(); this.msg.add({ severity: 'success', summary: '预约成功' }); },
      error: e => this.msg.add({ severity: 'error', summary: '预约失败', detail: e.message })
    });
  }

  updateStatus(id: string, status: string): void {
    this.api.updateAppointmentStatus(id, status).subscribe({
      next: () => { this.loadAppointments(); this.msg.add({ severity: 'success', summary: '状态已更新' }); },
      error: e => this.msg.add({ severity: 'error', summary: '操作失败', detail: e.message })
    });
  }
}
