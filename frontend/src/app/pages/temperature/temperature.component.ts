import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { TemperatureRecord, ExternalCollectionPoint } from '../../models/models';

@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, InputTextModule, InputNumberModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="page-header">
      <h2>温度监控</h2>
      <p-button label="录入温度" icon="pi pi-plus" (onClick)="showDialog = true"></p-button>
    </div>
    <div style="display:flex;gap:12px;align-items:flex-end;margin-bottom:16px">
      <div class="field" style="max-width:300px">
        <label>暂存箱ID</label>
        <input pInputText [(ngModel)]="boxId" placeholder="输入暂存箱ID" />
      </div>
      <p-button label="查询温度" (onClick)="loadRecords()"></p-button>
    </div>
    <p-table [value]="records" [tableStyle]="{'min-width': '30rem'}" stripedRows>
      <ng-template pTemplate="header">
        <tr><th>温度(℃)</th><th>是否报警</th><th>记录时间</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-rec>
        <tr>
          <td [style.color]="rec.isAlarm?'red':'inherit'" [style.font-weight]="rec.isAlarm?'bold':'normal'">{{rec.temperatureCelsius}}</td>
          <td>
            <p-tag *ngIf="rec.isAlarm" severity="danger" value="报警"></p-tag>
            <p-tag *ngIf="!rec.isAlarm" severity="success" value="正常"></p-tag>
          </td>
          <td>{{rec.recordedAt | date:'yyyy-MM-dd HH:mm:ss'}}</td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="录入温度" [(visible)]="showDialog" [modal]="true" [draggable]="false">
      <div class="p-fluid" style="min-width:300px">
        <div class="field"><label>暂存箱ID</label><input pInputText [(ngModel)]="newRecord.tempStorageBoxId" /></div>
        <div class="field"><label>温度(℃)</label><p-inputnumber [(ngModel)]="newRecord.temperatureCelsius" mode="decimal"></p-inputnumber></div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="取消" severity="secondary" (onClick)="showDialog=false"></p-button>
        <p-button label="录入" (onClick)="record()"></p-button>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `
})
export class TemperatureComponent implements OnInit {
  records: TemperatureRecord[] = [];
  boxId = '';
  showDialog = false;
  newRecord: any = {};

  constructor(private api: ApiService, private msg: MessageService) {}

  ngOnInit(): void {}

  loadRecords(): void {
    if (this.boxId) this.api.getTemperatureRecords(this.boxId).subscribe(d => this.records = d);
  }

  record(): void {
    this.api.recordTemperature(this.newRecord).subscribe({
      next: (r) => {
        this.showDialog = false;
        this.newRecord = {};
        this.loadRecords();
        if (r.isAlarm) {
          this.msg.add({ severity: 'error', summary: '温度超限报警', detail: `当前温度 ${r.temperatureCelsius}℃ 超出范围，相关血袋已自动锁定！` });
        } else {
          this.msg.add({ severity: 'success', summary: '温度已录入' });
        }
      },
      error: e => this.msg.add({ severity: 'error', summary: '录入失败', detail: e.message })
    });
  }
}
