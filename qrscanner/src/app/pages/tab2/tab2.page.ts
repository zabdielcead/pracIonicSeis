import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // Abrir un explorador web la pagina los comandos son:
  // ionic cordova plugin add cordova-plugin-inappbrowser
  //  npm install @ionic-native/in-app-browser

  constructor(public dataLocal: DataLocalService) {}

  enviarCorreo() {
    console.log('enviando Correo');
    // se genera un archivo csv
    this.dataLocal.enviarCorreo();
  }
  abrirRegistro(registro) {
    console.log(registro);
    this.dataLocal.abrirRegistro(registro);
  }

}
