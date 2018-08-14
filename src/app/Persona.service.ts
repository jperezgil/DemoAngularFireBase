import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Persona } from './Persona';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { environment } from '../environments/environment';
@Injectable()
export class PersonaService {
  private preURL: string = environment.firebase.databaseURL +'/Personas';
  personas: AngularFireList<Persona>;
  constructor(private http:Http, private angularFire: AngularFireDatabase) { }
  private extraerDatos(res: Response) {
      let body = res.json();
      return body;
  }
  private gestionarErrores (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.status);
  }
  getAllPersonas(): AngularFireList<Persona> {
    this.personas = this.angularFire.list('Personas');
    return this.personas;    
  }
  getPersonaById(id$: string): Observable<Persona>  {
    return this.http.get(this.preURL + `/${id$}/.json`)
       .map(this.extraerDatos)
       .catch(this.gestionarErrores);
  }	
  crearPersona(persona: Persona){
    this.personas.push(persona);
  }
  actualizarPersona(persona: Persona, key$: string) {
    this.personas.update(key$,persona);
  }
  eliminarPersona(key$: string){
    this.personas.remove(key$);
  }

}
