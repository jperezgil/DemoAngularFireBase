import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PersonaService } from './Persona.service';
import { Persona } from './Persona';
import 'rxjs';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Persona';
  public index: number = 0; 
  public statusCode: number = 0; 
  public processValidation = false; 
  public personaIdToUpdate = null; 
  public requestProcessing = false;
  public allPersonas: Persona[]; 
  private successCrear = 201;
  private successActualizar = 200;
  private successEliminar = 204;
  constructor(private personaService: PersonaService) {
  }
  personaForm = new FormGroup({
    Nombre: new FormControl('', Validators.required),
    Apellidos: new FormControl('', Validators.required),
    Dni: new FormControl('', Validators.required),	   
  });
  ngOnInit(): void {
       this.getAllPersonas();
  }   
  getAllPersonas() {        
        var x = this.personaService.getAllPersonas();
        x.snapshotChanges().subscribe(item => {
        this.allPersonas = []; 
        item.forEach(element => {            
          var persona = element.payload.toJSON();
          persona["$key"] = element.key;
          this.allPersonas.push(persona as Persona);
        });
      });
  }
  validarCampo(field: string) {
    return this.personaForm.get(field).invalid && this.processValidation;
  }
  preProcessConfigurations() {
      this.statusCode = 0;
      this.requestProcessing = true;
  }
  backToCrearPersona() {
    this.personaIdToUpdate = null;
    this.personaForm.reset();	  
    this.processValidation = false;
  }
  editarPersona(personaId: string) {
    this.preProcessConfigurations();
    this.personaService.getPersonaById(personaId) 
      .subscribe(persona => {
                this.personaIdToUpdate = personaId;   
                this.personaForm.setValue({ Nombre: persona.Nombre, Apellidos: persona.Apellidos, Dni: persona.Dni });
                this.processValidation = true;
		            this.requestProcessing = false;  
      },
      errorCode =>  this.statusCode = errorCode);   
  }
  borrarPersona(personaId: string) {
    try{
      this.preProcessConfigurations();
      this.personaService.eliminarPersona(personaId)
      this.statusCode = this.successEliminar;
      this.getAllPersonas();	
      this.backToCrearPersona();    
    }catch(e){
      this.statusCode =e.errorCode;
    }
  }
  onPersonaFormSubmit() {    
    this.processValidation = true;
    this.requestProcessing = false; 
    if (this.personaForm.invalid) return;  
    this.preProcessConfigurations();
    let persona = this.personaForm.value;
    if (this.personaIdToUpdate === null) {   
      try {
        this.personaService.crearPersona(persona) 
        this.statusCode = this.successCrear;
        this.getAllPersonas();	
        this.backToCrearPersona();
      }
      catch(e) {
        this.statusCode =e.errorCode;
      }           
    } else {  
        try {
          this.personaService.actualizarPersona(persona, this.personaIdToUpdate)
          this.statusCode =this.successActualizar;
          this.getAllPersonas();	
          this.backToCrearPersona();
        }
        catch(e) {
          this.statusCode =e.errorCode;
        }           
      }
      this.personaForm.reset();	
    }
}
