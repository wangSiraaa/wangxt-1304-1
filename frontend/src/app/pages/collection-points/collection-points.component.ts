import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { ExternalCollectionPoint, Vehicle } from '../../models/models';

@Component({
  selector: 'app-collection-points',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    DialogModule, InputTextModule, CalendarModule, DropdownModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>外采排班管理</h2>
      <p-button label="新增外采点" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>

    <p-table [value]="points" [tableStyle]="{'min-width': '60rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr>
          <th>名称</th><th>地址</th><th>计划日期</th><th>时段</th><th>状态</th><th>车辆</th><th>操作</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-point>
        <tr>
          <td>{{point.name}}</td>
          <td>{{point.address}}</td>
          <td>{{point.planDate | date:'yyyy-MM-dd'}}</td>
          <td>{{point.startTime | date:'HH:mm'}} - {{point.endTime | date:'HH:mm'}}</td>
          <td><p-tag [severity]="getStatusSeverity(point.status)" [value]="point.status"></p-tag></td>
          <td>{{point.assignedVehicleId || '—'}}</td>
          <td>
            <p-button *ngIf="point.status==='Planned'" label="发布" severity="info" size="small" (onClick)="publish(point.id)"></p-button>
            <p-button *ngIf="point.status==='Published'" label="分配车辆" severity="help" size="small" (onClick)="openAssign(point)"></p-button>
            <p-button *ngIf="point.status==='VehicleAssigned'" label="出车" severity="success" size="small" (onClick)="dispatch(point.id)"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog header="新增外采点" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:300px">
        <div class="field">
          <label>名称</label>
          <input pInputText [(ngModel)]="newPoint.name" />
        </div>
        <div class="field">
          <label>地址</label>
          <input pInputText [(ngModel)]="newPoint.address" />
        </div>
        <div class="field">
          <label>计划日期</label>
          <p-calendar [(ngModel)]="newPoint.planDate" [showTime]="false"></p-calendar>
        </div>
        <div class="field">
          <label>开始时间</label>
          <p-calendar [(ngModel)]="newPoint.startTime" [timeOnly]="true"></p-calendar>
        </div>
        <div class="field">
          <label>结束时间</label>
          <p-calendar [(ngModel)]="newPoint.endTime" [timeOnly]="true"></p-calendar>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="保存" (onClick)="create()"></p-button>
      </ng-template>
    </p-dialog>

    <p-dialog header="分配车辆" [(visible)]="showAssignDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:300px">
        <div class="field">
          <label>车辆</label>
          <p-dropdown [(ngModel)]="selectedVehicleId" [options]="vehicles" optionLabel="licensePlate" optionValue="id" placeholder="选择车辆"></p-dropdown>
        </div>
        <div class="field">
          <label>司机ID</label>
          <input pInputText [(ngModel)]="driverId" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showAssignDialog=false"></p-button>
        <p-button label="确认分配" (onClick)="assignVehicle()"></p-button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `
})
export class CollectionPointsComponent implements OnInit {
  points: ExternalCollectionPoint[] = [];
  vehicles: Vehicle[] = [];
  showDialog = false;
  showAssignDialog = false;
  newPoint: any = {};
  selectedPoint?: ExternalCollectionPoint;
  selectedVehicleId = '';
  driverId = '';

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void {
    this.load();
    this.api.getVehicles().subscribe(v => this.vehicles = v);
  }

  load(): void {
    this.api.getCollectionPoints().subscribe(d => this.points = d);
  }

  create(): void {
    this.api.createCollectionPoint(this.newPoint).subscribe({
      next: () => { this.showDialog = false; this.newPoint = {}; this.load(); this.msg.add({ severity: 'success', summary: '创建成功' }); },
      error: e => this.msg.add({ severity: 'error', summary: '创建失败', detail: e.message })
    });
  }

  publish(id: string): void {
    this.api.publishCollectionPoint(id).subscribe({
      next: () => { this.load(); this.msg.add({ severity: 'success', summary: '已发布' }); },
      error: e => this.msg.add({ severity: 'error', summary: '发布失败', detail: e.message })
    });
  }

  openAssign(point: ExternalCollectionPoint): void {
    this.selectedPoint = point;
    this.showAssignDialog = true;
  }

  assignVehicle(): void {
    if (!this.selectedPoint) return;
    this.api.assignVehicle(this.selectedPoint.id, this.selectedVehicleId, this.driverId).subscribe({
      next: () => { this.showAssignDialog = false; this.load(); this.msg.add({ severity: 'success', summary: '车辆已分配' }); },
      error: e => this.msg.add({ severity: 'error', summary: '分配失败', detail: e.message })
    });
  }

  dispatch(id: string): void {
    this.api.dispatchCollectionPoint(id).subscribe({
      next: () => { this.load(); this.msg.add({ severity: 'success', summary: '已出车' }); },
      error: e => this.msg.add({ severity: 'error', summary: '出车失败', detail: e.message })
    });
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    const map: Record<string, 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast'> = { Planned: 'info', Published: 'warning', VehicleAssigned: 'secondary', Dispatched: 'success' };
    return map[status] || 'info';
  }
}
