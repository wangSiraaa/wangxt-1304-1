import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { Vehicle } from '../../models/models';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>车辆库位管理</h2>
      <p-button label="新增车辆" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>
    <p-table [value]="vehicles" [tableStyle]="{'min-width': '40rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr><th>车牌号</th><th>车型</th><th>状态</th><th>司机</th><th>操作</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-vehicle>
        <tr>
          <td>{{vehicle.id}}</td>
          <td>{{vehicle.model}}</td>
          <td><p-tag [severity]="vehicle.status==='Available'?'success':vehicle.status==='InUse'?'warning':'danger'" [value]="vehicle.status"></p-tag></td>
          <td>{{vehicle.assignedDriverName || '—'}}</td>
          <td>
            <p-button *ngIf="vehicle.status==='Available'" label="投入使用" severity="warning" size="small" (onClick)="updateStatus(vehicle.id, 'InUse')"></p-button>
            <p-button *ngIf="vehicle.status==='InUse'" label="归还" severity="success" size="small" (onClick)="updateStatus(vehicle.id, 'Available')"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="新增车辆" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:300px">
        <div class="field"><label>车牌号/编号</label><input pInputText [(ngModel)]="newVehicle.id" /></div>
        <div class="field"><label>车型</label><input pInputText [(ngModel)]="newVehicle.model" /></div>
        <div class="field"><label>车牌号</label><input pInputText [(ngModel)]="newVehicle.licensePlate" /></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="保存" (onClick)="create()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  showDialog = false;
  newVehicle: any = {};

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void { this.load(); }

  load(): void { this.api.getVehicles().subscribe(d => this.vehicles = d); }

  create(): void {
    this.api.createVehicle(this.newVehicle).subscribe({
      next: () => { this.showDialog = false; this.newVehicle = {}; this.load(); this.msg.add({ severity: 'success', summary: '车辆已添加' }); },
      error: e => this.msg.add({ severity: 'error', summary: '添加失败', detail: e.message })
    });
  }

  updateStatus(id: string, status: string): void {
    this.api.updateVehicleStatus(id, status).subscribe({
      next: () => { this.load(); this.msg.add({ severity: 'success', summary: '状态已更新' }); },
      error: e => this.msg.add({ severity: 'error', summary: '操作失败', detail: e.message })
    });
  }
}
