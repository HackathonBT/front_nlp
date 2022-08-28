import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  sidePanelOpened = true;
  editorData = '';
  sourceData = [];
  isLoading = false;
  @ViewChild('textEl', {static: false}) text: any = {};
  constructor(private http: HttpClient) {}

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }
  ngOnInit(): void {
  }
  check(): void {
    this.isLoading = true;
    this.http.post('http://192.168.0.15:8000/npl/check', this.sourceData).subscribe((res: any) => {
      this.isLoading = false;
      this.editorData = '';
      res.map((sent: any) => {
        this.editorData += '<span style="background-color: ' + sent.color + '">' + sent.row + '<span>' + '<br>'; });
      this.text.nativeElement.innerHTML = this.editorData;
    });
  }


  selectFile(event: any): void {
    const file = event.target.files[0];

    if (file) {
      // this.fileName = file.name;
      const formData = new FormData();
      formData.append('file', file);

      this.http.post('http://192.168.0.15:8000/npl/loading', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe((res: any) => {
        this.editorData = '';
        if ('body' in res) {
          this.sourceData = res.body.sentences;
          res.body.sentences.map((sent: string) => {
            this.editorData += sent + '<br>';
          });
          this.text.nativeElement.innerHTML = this.editorData;
        }
      });
    }
  }
}
