import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { BloodBag, ExternalCollectionPoint } from '../../models/models';

@Component({
  selector: 'app-blood-bags',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, InputNumberModule, DropdownModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>采血袋管理</h2>
      <p-button label="登记血袋" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>
    <div class="p-fluid" style="margin-bottom:12px">
      <div class="field" style="max-width:400px">
        <label>选择外采点</label>
        <p-dropdown [(ngModel)]="selectedCpId" [options]="collectionPoints" optionLabel="name" optionValue="id" placeholder="选择外采点" (onChange)="loadBags()"></p-dropdown>
      </div>
    </div>
    <p-table [value]="bags" [tableStyle]="{'min-width': '60rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr><th>血袋编码</th><th>血型</th><th>血制品</th><th>容量(ml)</th><th>护士</th><th>状态</th><th>锁定</th><th>操作</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-bag>
        <tr>
          <td>{{bag.bagCode}}</td>
          <td>{{bag.bloodType}}</td>
          <td>{{bag.bloodProduct}}</td>
          <td>{{bag.volumeMl}}</td>
          <td>{{bag.nurseName}}</td>
          <td><p-tag [severity]="bag.isLocked?'danger':bag.status==='Collected'?'success':'info'" [value]="bag.status"></p-tag></td>
          <td>
            <i *ngIf="bag.isLocked" class="pi pi-lock" style="color:red"></i>
            <i *ngIf="!bag.isLocked" class="pi pi-unlock" style="color:green"></i>
            <span *ngIf="bag.isLocked" style="margin-left:4px;font-size:0.85em;color:red">{{bag.lockReason}}</span>
          </td>
          <td>
            <p-button *ngIf="bag.isLocked" label="解锁" severity="success" size="small" (onClick)="unlock(bag.id)"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="登记血袋" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:350px">
        <div class="field"><label>外采点</label><p-dropdown [(ngModel)]="newBag.collectionPointId" [options]="collectionPoints" optionLabel="name" optionValue="id"></p-dropdown></div>
        <div class="field"><label>血袋编码</label><input pInputText [(ngModel)]="newBag.bagCode" /></div>
        <div class="field"><label>血型</label><p-dropdown [(ngModel)]="newBag.bloodType" [options]="bloodTypes"></p-dropdown></div>
        <div class="field"><label>血制品</label><input pInputText [(ngModel)]="newBag.bloodProduct" /></div>
        <div class="field"><label>容量(ml)</label><p-inputnumber [(ngModel)]="newBag.volumeMl"></p-inputnumber></div>
        <div class="field"><label>献血者身份证号</label><input pInputText [(ngModel)]="newBag.donorIdNumber" /></div>
        <div class="field"><label>护士ID</label><input pInputText [(ngModel)]="newBag.nurseId" /></div>
        <div class="field"><label>护士姓名</label><input pInputText [(ngModel)]="newBag.nurseName" /></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="登记" (onClick)="register()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `
})
export class BloodBagsComponent implements OnInit {
  bags: BloodBag[] = [];
  collectionPoints: ExternalCollectionPoint[] = [];
  selectedCpId = '';
  showDialog = false;
  newBag: any = {};
  bloodTypes = [
    { label: 'A型', value: 'A' }, { label: 'B型', value: 'B' },
    { label: 'AB型', value: 'AB' }, { label: 'O型', value: 'O' }
  ];

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void { this.api.getCollectionPoints().subscribe(d => this.collectionPoints = d); }

  loadBags(): void {
    if (this.selectedCpId) this.api.getBloodBags(this.selectedCpId).subscribe(d => this.bags = d);
  }

  register(): void {
    this.api.registerBloodBag(this.newBag).subscribe({
      next: () => { this.showDialog = false; this.newBag = {}; this.loadBags(); this.msg.add({ severity: 'success', summary: '血袋已登记' }); },
      error: e => this.msg.add({ severity: 'error', summary: '登记失败', detail: e.message })
    });
  }

  unlock(bagId: string): void {
    this.api.unlockBloodBag(bagId).subscribe({
      next: () => { this.loadBags(); this.msg.add({ severity: 'success', summary: '血袋已解锁' }); },
      error: e => this.msg.add({ severity: 'error', summary: '解锁失败', detail: e.message })
    });
  }
}
