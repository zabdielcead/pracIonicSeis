import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados: Registro [] = [];
  constructor(private storage: Storage,
              private navCtrl: NavController,
              private inAppBrowser: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
    /*
    // estos e similar al metodo cargarStorage
    this.storage.get('registros')
    .then(registros => {
      this.guardados = registros || [];
    });
    */
    this.cargarStorage();
  }

  async cargarStorage() {
    this.guardados = (await this.storage.get('registros')) || [];
  }

  async guardarRegistro( format: string, text: string) {
      await this.cargarStorage();
      const nuevoRegistro = new Registro( format, text);
      this.guardados.unshift(nuevoRegistro);
      this.storage.set('registros', this.guardados);
      this.abrirRegistro(nuevoRegistro);
  }
  abrirRegistro( registro: Registro ) {
    this.navCtrl.navigateForward('/tabs/tab2');
    switch (registro.type ) {
      case 'http':
        // abrir el navegador web
        this.inAppBrowser.create(registro.text, '_system');
        break;
        case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
        break;
    }
  }


  enviarCorreo() {
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    const arrTemp = [];
    arrTemp.push(titulos);
    this.guardados.forEach( registro => {
        const linea = `${registro.type},${registro.format},${registro.created},${registro.text.replace(',', ' ')}\n`;
        arrTemp.push( linea );
      });
    // console.log(arrTemp.join(''));
    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string) {
    // https://ionicframework.com/docs/native/file
    // ionic cordova plugin add cordova-plugin-file
    // npm install @ionic-native/file
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
        .then(existe => {
          console.log('Existe archivo?', existe);
        })
        .catch( err => {
            return this.file.createFile(this.file.dataDirectory, 'registros.csv', false) // false es para que no lo remplace si existe
                    .then( creado => this.escribirEnArchivo(text))
                    .catch(err2 => console.log('No se pudo crear el archivo', err2));
        });
    // this.file.dataDirectory path del filesystem de la aplicacion sea android o ios
  }
  async escribirEnArchivo( text: string ) {
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text);
    const archivo = `${this.file.dataDirectory}/registros.csv`;
    console.log(this.file.dataDirectory + 'registros.csv');
    // https://ionicframework.com/docs/native/email-composer
    // ionic cordova plugin add cordova-plugin-email-composer
    // npm install @ionic-native/email-composer
    const email = {
      to: 'zabdiel.cead@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup Icons',
      body: 'bacup de <strong>scans</strong>',
      isHtml: true
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
