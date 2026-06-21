import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/collection-points', pathMatch: 'full' },
  {
    path: 'collection-points',
    loadComponent: () => import('./pages/collection-points/collection-points.component').then(m => m.CollectionPointsComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./pages/vehicles/vehicles.component').then(m => m.VehiclesComponent)
  },
  {
    path: 'inspections',
    loadComponent: () => import('./pages/inspections/inspections.component').then(m => m.InspectionsComponent)
  },
  {
    path: 'blood-bags',
    loadComponent: () => import('./pages/blood-bags/blood-bags.component').then(m => m.BloodBagsComponent)
  },
  {
    path: 'temperature',
    loadComponent: () => import('./pages/temperature/temperature.component').then(m => m.TemperatureComponent)
  },
  {
    path: 'handovers',
    loadComponent: () => import('./pages/handovers/handovers.component').then(m => m.HandoversComponent)
  }
];
