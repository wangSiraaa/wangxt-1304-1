import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExternalCollectionPoint,
  BloodDonationAppointment,
  Vehicle,
  VehicleInspection,
  BloodBag,
  TemperatureRecord,
  ReturnHandover,
  TempStorageBox
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:19604/api';

  constructor(private http: HttpClient) {}

  getCollectionPoints(): Observable<ExternalCollectionPoint[]> {
    return this.http.get<ExternalCollectionPoint[]>(`${this.baseUrl}/collectionpoints`);
  }

  getCollectionPoint(id: string): Observable<ExternalCollectionPoint> {
    return this.http.get<ExternalCollectionPoint>(`${this.baseUrl}/collectionpoints/${id}`);
  }

  createCollectionPoint(point: Partial<ExternalCollectionPoint>): Observable<ExternalCollectionPoint> {
    return this.http.post<ExternalCollectionPoint>(`${this.baseUrl}/collectionpoints`, point);
  }

  publishCollectionPoint(id: string): Observable<ExternalCollectionPoint> {
    return this.http.put<ExternalCollectionPoint>(`${this.baseUrl}/collectionpoints/${id}/publish`, {});
  }

  assignVehicle(id: string, vehicleId: string, driverId: string): Observable<ExternalCollectionPoint> {
    return this.http.put<ExternalCollectionPoint>(`${this.baseUrl}/collectionpoints/${id}/assign-vehicle`, { vehicleId, driverId });
  }

  dispatchCollectionPoint(id: string): Observable<ExternalCollectionPoint> {
    return this.http.put<ExternalCollectionPoint>(`${this.baseUrl}/collectionpoints/${id}/dispatch`, {});
  }

  getAppointments(cpId: string): Observable<BloodDonationAppointment[]> {
    return this.http.get<BloodDonationAppointment[]>(`${this.baseUrl}/appointments/collection-point/${cpId}`);
  }

  createAppointment(appt: Partial<BloodDonationAppointment>): Observable<BloodDonationAppointment> {
    return this.http.post<BloodDonationAppointment>(`${this.baseUrl}/appointments`, appt);
  }

  updateAppointmentStatus(id: string, status: string): Observable<BloodDonationAppointment> {
    return this.http.put<BloodDonationAppointment>(`${this.baseUrl}/appointments/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } });
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`);
  }

  getVehicle(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`);
  }

  createVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicle);
  }

  updateVehicleStatus(id: string, status: string): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/vehicles/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } });
  }

  getInspections(cpId: string): Observable<VehicleInspection[]> {
    return this.http.get<VehicleInspection[]>(`${this.baseUrl}/vehicleinspections/collection-point/${cpId}`);
  }

  submitInspection(inspection: Partial<VehicleInspection>): Observable<VehicleInspection> {
    return this.http.post<VehicleInspection>(`${this.baseUrl}/vehicleinspections`, inspection);
  }

  passInspection(id: string): Observable<VehicleInspection> {
    return this.http.put<VehicleInspection>(`${this.baseUrl}/vehicleinspections/${id}/pass`, {});
  }

  failInspection(id: string, reason: string): Observable<VehicleInspection> {
    return this.http.put<VehicleInspection>(`${this.baseUrl}/vehicleinspections/${id}/fail`, JSON.stringify(reason), { headers: { 'Content-Type': 'application/json' } });
  }

  getBloodBags(cpId: string): Observable<BloodBag[]> {
    return this.http.get<BloodBag[]>(`${this.baseUrl}/bloodbags/collection-point/${cpId}`);
  }

  registerBloodBag(bag: Partial<BloodBag>): Observable<BloodBag> {
    return this.http.post<BloodBag>(`${this.baseUrl}/bloodbags`, bag);
  }

  assignBagToBox(bagId: string, boxId: string): Observable<BloodBag> {
    return this.http.put<BloodBag>(`${this.baseUrl}/bloodbags/${bagId}/assign-box/${boxId}`, {});
  }

  unlockBloodBag(bagId: string): Observable<BloodBag> {
    return this.http.put<BloodBag>(`${this.baseUrl}/bloodbags/${bagId}/unlock`, {});
  }

  getTemperatureRecords(boxId: string): Observable<TemperatureRecord[]> {
    return this.http.get<TemperatureRecord[]>(`${this.baseUrl}/temperaturerecords/storage-box/${boxId}`);
  }

  recordTemperature(record: Partial<TemperatureRecord>): Observable<TemperatureRecord> {
    return this.http.post<TemperatureRecord>(`${this.baseUrl}/temperaturerecords`, record);
  }

  getHandovers(cpId: string): Observable<ReturnHandover[]> {
    return this.http.get<ReturnHandover[]>(`${this.baseUrl}/returnhandovers/collection-point/${cpId}`);
  }

  createHandover(handover: Partial<ReturnHandover>): Observable<ReturnHandover> {
    return this.http.post<ReturnHandover>(`${this.baseUrl}/returnhandovers`, handover);
  }

  confirmHandover(id: string): Observable<ReturnHandover> {
    return this.http.put<ReturnHandover>(`${this.baseUrl}/returnhandovers/${id}/confirm`, {});
  }

  rejectHandover(id: string, reason: string): Observable<ReturnHandover> {
    return this.http.put<ReturnHandover>(`${this.baseUrl}/returnhandovers/${id}/reject`, JSON.stringify(reason), { headers: { 'Content-Type': 'application/json' } });
  }
}
