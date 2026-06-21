import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { VehicleInspection, ExternalCollectionPoint, Vehicle } from '../../models/models';

@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, DropdownModule, CheckboxModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>车辆设备点检</h2>
      <p-button label="提交点检" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>
    <div class="p-fluid" style="margin-bottom:12px">
      <div class="field" style="max-width:400px">
        <label>选择外采点</label>
        <p-dropdown [(ngModel)]="selectedCpId" [options]="collectionPoints" optionLabel="name" optionValue="id" placeholder="选择外采点" (onChange)="loadInspections()"></p-dropdown>
      </div>
    </div>
    <p-table [value]="inspections" [tableStyle]="{'min-width': '50rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr><th>车辆</th><th>点检人</th><th>车辆检查</th><th>设备检查</th><th>冷链检查</th><th>状态</th><th>操作</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-insp>
        <tr>
          <td>{{insp.vehicleId}}</td>
          <td>{{insp.inspectorName}}</td>
          <td><i [class]="insp.vehicleChecked?'pi pi-check':'pi pi-times'" [style.color]="insp.vehicleChecked?'green':'red'"></i></td>
          <td><i [class]="insp.equipmentChecked?'pi pi-check':'pi pi-times'" [style.color]="insp.equipmentChecked?'green':'red'"></i></td>
          <td><i [class]="insp.coldChainChecked?'pi pi-check':'pi pi-times'" [style.color]="insp.coldChainChecked?'green':'red'"></i></td>
          <td><p-tag [severity]="insp.status==='Passed'?'success':'danger'" [value]="insp.status"></p-tag></td>
          <td>
            <p-button *ngIf="insp.status==='Pending'" label="通过" severity="success" size="small" (onClick)="passInspection(insp.id)"></p-button>
            <p-button *ngIf="insp.status==='Pending'" label="不通过" severity="danger" size="small" (onClick)="failInspection(insp.id)"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="提交点检" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:350px">
        <div class="field"><label>外采点</label><p-dropdown [(ngModel)]="newInsp.collectionPointId" [options]="collectionPoints" optionLabel="name" optionValue="id"></p-dropdown></div>
        <div class="field"><label>车辆</label><p-dropdown [(ngModel)]="newInsp.vehicleId" [options]="vehicles" optionLabel="licensePlate" optionValue="id"></p-dropdown></div>
        <div class="field"><label>点检人ID</label><input pInputText [(ngModel)]="newInsp.inspectorId" /></div>
        <div class="field"><label>点检人姓名</label><input pInputText [(ngModel)]="newInsp.inspectorName" /></div>
        <div class="field"><p-checkbox [(ngModel)]="newInsp.vehicleChecked" label="车辆检查通过"></p-checkbox></div>
        <div class="field"><p-checkbox [(ngModel)]="newInsp.equipmentChecked" label="设备检查通过"></p-checkbox></div>
        <div class="field"><p-checkbox [(ngModel)]="newInsp.coldChainChecked" label="冷链检查通过"></p-checkbox></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="提交" (onClick)="submit()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `
})
export class InspectionsComponent implements OnInit {
  inspections: VehicleInspection[] = [];
  collectionPoints: ExternalCollectionPoint[] = [];
  vehicles: Vehicle[] = [];
  selectedCpId = '';
  showDialog = false;
  newInsp: any = { vehicleChecked: false, equipmentChecked: false, coldChainChecked: false };

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void {
    this.api.getCollectionPoints().subscribe(d => this.collectionPoints = d);
    this.api.getVehicles().subscribe(d => this.vehicles = d);
  }

  loadInspections(): void {
    if (this.selectedCpId) this.api.getInspections(this.selectedCpId).subscribe(d => this.inspections = d);
  }

  submit(): void {
    this.api.submitInspection(this.newInsp).subscribe({
      next: () => { this.showDialog = false; this.newInsp = { vehicleChecked: false, equipmentChecked: false, coldChainChecked: false }; this.loadInspections(); this.msg.add({ severity: 'success', summary: '点检已提交' }); },
      error: e => this.msg.add({ severity: 'error', summary: '提交失败', detail: e.message })
    });
  }

  passInspection(id: string): void {
    this.api.passInspection(id).subscribe({
      next: () => { this.loadInspections(); this.msg.add({ severity: 'success', summary: '点检通过' }); },
      error: e => this.msg.add({ severity: 'error', summary: '操作失败', detail: e.message })
    });
  }

  failInspection(id: string): void {
    this.api.failInspection(id, '点检未通过').subscribe({
      next: () => { this.loadInspections(); this.msg.add({ severity: 'warning', summary: '点检未通过' }); },
      error: e => this.msg.add({ severity: 'error', summary: '操作失败', detail: e.message })
    });
  }
}
