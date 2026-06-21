import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { ReturnHandover, ExternalCollectionPoint, Vehicle } from '../../models/models';

@Component({
  selector: 'app-handovers',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, DropdownModule, InputTextareaModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>回站交接</h2>
      <p-button label="创建交接" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>
    <div class="p-fluid" style="margin-bottom:12px">
      <div class="field" style="max-width:400px">
        <label>选择外采点</label>
        <p-dropdown [(ngModel)]="selectedCpId" [options]="collectionPoints" optionLabel="name" optionValue="id" placeholder="选择外采点" (onChange)="loadHandovers()"></p-dropdown>
      </div>
    </div>
    <p-table [value]="handovers" [tableStyle]="{'min-width': '60rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr><th>交接人</th><th>接收人</th><th>车辆</th><th>预期数量</th><th>实际数量</th><th>状态</th><th>差异说明</th><th>操作</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-h>
        <tr>
          <td>{{h.handoverBy}}</td>
          <td>{{h.handoverTo}}</td>
          <td>{{h.vehicleId}}</td>
          <td>{{h.expectedBagCount}}</td>
          <td>{{h.actualBagCount}}</td>
          <td><p-tag [severity]="h.status==='Confirmed'?'success':h.status==='Discrepancy'||h.status==='Rejected'?'danger':'info'" [value]="h.status"></p-tag></td>
          <td>{{h.discrepancyNote || '—'}}</td>
          <td>
            <p-button *ngIf="h.status==='Pending'" label="确认交接" severity="success" size="small" (onClick)="confirm(h.id)"></p-button>
            <p-button *ngIf="h.status==='Pending'" label="驳回" severity="danger" size="small" (onClick)="reject(h.id)"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="创建交接" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:350px">
        <div class="field"><label>外采点</label><p-dropdown [(ngModel)]="newHandover.collectionPointId" [options]="collectionPoints" optionLabel="name" optionValue="id"></p-dropdown></div>
        <div class="field"><label>车辆</label><p-dropdown [(ngModel)]="newHandover.vehicleId" [options]="vehicles" optionLabel="licensePlate" optionValue="id"></p-dropdown></div>
        <div class="field"><label>交接人</label><input pInputText [(ngModel)]="newHandover.handoverBy" /></div>
        <div class="field"><label>接收人</label><input pInputText [(ngModel)]="newHandover.handoverTo" /></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="创建" (onClick)="create()"></p-button>
      </ng-template>
    </p-dialog>
    <p-dialog header="驳回原因" [(visible)]="showRejectDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid">
        <div class="field"><textarea pInputTextarea [(ngModel)]="rejectReason" rows="3"></textarea></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showRejectDialog=false"></p-button>
        <p-button label="确认驳回" severity="danger" (onClick)="doReject()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `
})
export class HandoversComponent implements OnInit {
  handovers: ReturnHandover[] = [];
  collectionPoints: ExternalCollectionPoint[] = [];
  vehicles: Vehicle[] = [];
  selectedCpId = '';
  showDialog = false;
  showRejectDialog = false;
  newHandover: any = {};
  rejectId = '';
  rejectReason = '';

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void {
    this.api.getCollectionPoints().subscribe(d => this.collectionPoints = d);
    this.api.getVehicles().subscribe(d => this.vehicles = d);
  }

  loadHandovers(): void {
    if (this.selectedCpId) this.api.getHandovers(this.selectedCpId).subscribe(d => this.handovers = d);
  }

  create(): void {
    this.api.createHandover(this.newHandover).subscribe({
      next: () => { this.showDialog = false; this.newHandover = {}; this.loadHandovers(); this.msg.add({ severity: 'success', summary: '交接已创建' }); },
      error: e => this.msg.add({ severity: 'error', summary: '创建失败', detail: e.message })
    });
  }

  confirm(id: string): void {
    this.api.confirmHandover(id).subscribe({
      next: () => { this.loadHandovers(); this.msg.add({ severity: 'success', summary: '交接已确认' }); },
      error: e => this.msg.add({ severity: 'error', summary: '确认失败', detail: e.message })
    });
  }

  reject(id: string): void {
    this.rejectId = id;
    this.showRejectDialog = true;
  }

  doReject(): void {
    this.api.rejectHandover(this.rejectId, this.rejectReason).subscribe({
      next: () => { this.showRejectDialog = false; this.loadHandovers(); this.msg.add({ severity: 'warning', summary: '已驳回' }); },
      error: e => this.msg.add({ severity: 'error', summary: '操作失败', detail: e.message })
    });
  }
}
