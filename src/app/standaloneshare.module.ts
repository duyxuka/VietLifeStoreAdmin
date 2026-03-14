import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';      
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';       
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ChipModule } from 'primeng/chip';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  exports: [
    CommonModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    SelectModule,     
    InputTextModule,
    BlockUIModule,
    DynamicDialogModule,
    InputNumberModule,
    CheckboxModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    ImageModule,
    PanelModule,
    BadgeModule,
    ToolbarModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TextareaModule,
    ToggleSwitchModule,
    ChipModule,
    CKEditorModule,
    FileUploadModule,
    TooltipModule
  ]
})
export class StandaloneSharedModule {}
