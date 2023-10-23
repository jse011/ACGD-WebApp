import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User } from './user';
import { StarterService } from '../services/impl/starter.service';
import { ACLConstants } from './constants';

(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class SessionService {
  private expiresAt: number;
  private authenticated: boolean;
  accessToken: string;
  private userProfile: User;
  private permissions: string[];
  private _expired: boolean;
  private apiEndpoint: string;
  private APP_PARAMS_KEY = 'webServiceInformation';
  private aclConstants = ACLConstants;

  constructor(
    private http: HttpClient,
    private starterService: StarterService
  ) {
    //if ((this.accessToken === null || this.accessToken === undefined)  && sessionStorage.getItem('accessToken')) {
    this.expiresAt =
      Number(localStorage.getItem('expiresIn')) * 60000 + Date.now();
    this.accessToken = localStorage.getItem('accessToken');
    this.userProfile = JSON.parse(localStorage.getItem('currentUser'));
    this.permissions = null;
    this.apiEndpoint = `${environment.serviceEndpoint}/`;
    //this.authenticated = true;
  }

  setSession(authResult) {
    // Save authentication data and update login status subject
    this.expiresAt = authResult.expiresIn * 60000 + Date.now();
    this.accessToken = authResult.token;
    this.userProfile = authResult.userProfile;
    this.authenticated = true;
    localStorage.setItem('expiresIn', authResult.expiresIn);
    localStorage.setItem('accessToken', authResult.token);
    //localStorage.setItem('currentUser', JSON.stringify(authResult.userProfile));
  }

  updateExpiration() {
    // Update session expiration date
    this.expiresAt = Number(localStorage.getItem('expiresIn')) + Date.now();
  }

  expireSession() {
    this.deleteSession();
    this._expired = true;
  }

  deleteSession() {
    // remove user from local storage to log user out
    this.authenticated = false;
    this.accessToken = null;
    this.userProfile = null;
    this.expiresAt = null;
    this.permissions = null;
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.starterService.reset();

    this.http.get(`${this.apiEndpoint}`).subscribe((response) => {
      localStorage.setItem(this.APP_PARAMS_KEY, JSON.stringify(response));
    }, this.handleError);
  }

  public getAuthorities(): string[] {
    this.permissions = [];
    if (localStorage.getItem('accessToken')) {
      this.permissions = this.userProfile.permisos;
      this.permissions.push('/inicio');
      if (this.permissions.includes('/bandeja-entrada')) {
        this.permissions.push('/modulo-maestro');
        this.permissions.push('/bandeja-entrada/con-plazo');
      }
    }
    return this.permissions;
  }

  public validatePermission(permission: string): boolean {
    // Validar si usuario posee un permiso
    if (permission[0] !== '/') {
      permission = `/${permission}`;
    }
    const urls = this.getAuthorities();
    return urls.includes(permission);
  }

  setSessionPerfil(authResult: any, codigoPerfil: number, descPerfil: string) {
    this.userProfile.codPerfil = codigoPerfil;
    this.userProfile.descPerfil = descPerfil;
    this.userProfile.permisos = authResult.permisos;
    this.userProfile.menu = authResult.menu;
    this.authenticated = true;
    localStorage.setItem('currentUser', JSON.stringify(this.userProfile));
  }

  get User() {
    // Return user profile
    return this.userProfile;
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    return Date.now() < this.expiresAt && this.authenticated;
  }

  get expired(): boolean {
    // Check if current date is before token expiration
    /*if(this.expiresAt!=null){
      return Date.now() > this.expiresAt;
    }*/
    // return  (Date.now() > this.expiresAt) && this.authenticated;
    return this._expired;
  }

  public read(key: string) {
    const value = localStorage.getItem(key);
    try {
      const obj = JSON.parse(value);
      return obj;
    } catch (e) {
      return value;
    }
  }
  public save(key: string, value: any) {
    if (typeof value === 'object' || Array.isArray(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(
        key,
        typeof value !== 'string' ? value.toString() : value
      );
    }
  }
  private handleError(err) {
    console.error(`Error al obtener parametros: ${err.error}`);
  }

  get ACL() {
    return this.aclConstants;
  }
}