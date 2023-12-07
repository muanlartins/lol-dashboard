import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackerRoutingModule } from './tracker-routing.module';
import { TrackerComponent } from './tracker.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TrackerComponent],
  imports: [CommonModule, TrackerRoutingModule, ReactiveFormsModule],
  exports: [TrackerComponent],
})
export class TrackerModule {}
