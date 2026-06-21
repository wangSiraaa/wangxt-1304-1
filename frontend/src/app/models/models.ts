export interface ExternalCollectionPoint {
  id: string;
  name: string;
  address: string;
  planDate: string;
  startTime: string;
  endTime: string;
  status: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  createdBy: string;
  createdAt: string;
}

export interface BloodDonationAppointment {
  id: string;
  donorName: string;
  donorIdNumber: string;
  donorPhone: string;
  bloodType: string;
  collectionPointId: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  status: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  collectionPointId: string;
  inspectorId: string;
  inspectorName: string;
  vehicleChecked: boolean;
  equipmentChecked: boolean;
  coldChainChecked: boolean;
  remarks?: string;
  status: string;
  inspectedAt: string;
}

export interface BloodBag {
  id: string;
  bagCode: string;
  bloodType: string;
  bloodProduct: string;
  volumeMl: number;
  collectionPointId: string;
  donorIdNumber: string;
  nurseId: string;
  nurseName: string;
  tempStorageBoxId?: string;
  status: string;
  isLocked: boolean;
  lockReason?: string;
  collectedAt: string;
}

export interface TempStorageBox {
  id: string;
  boxCode: string;
  vehicleId: string;
  collectionPointId: string;
  minTempCelsius: number;
  maxTempCelsius: number;
  status: string;
  createdAt: string;
}

export interface TemperatureRecord {
  id: string;
  tempStorageBoxId: string;
  temperatureCelsius: number;
  isAlarm: boolean;
  recordedAt: string;
}

export interface ReturnHandover {
  id: string;
  collectionPointId: string;
  handoverBy: string;
  handoverTo: string;
  vehicleId: string;
  expectedBagCount: number;
  actualBagCount: number;
  expectedTotalVolumeMl: number;
  actualTotalVolumeMl: number;
  status: string;
  discrepancyNote?: string;
  handoverAt: string;
  details: HandoverDetail[];
}

export interface HandoverDetail {
  id: string;
  returnHandoverId: string;
  bloodBagId: string;
  bagCode: string;
  bloodType: string;
  volumeMl: number;
  isReceived: boolean;
  remark?: string;
}
