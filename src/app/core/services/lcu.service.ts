import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Summoner } from '../models/summoner';
import { Champions } from '../models/champions';
import { Loot } from '../models/loot';
import { Champion } from '../models/champion';
import { Observable } from 'rxjs';
import { Mastery } from '../models/masteries';

@Injectable({
  providedIn: 'root',
})
export class LcuService {
  public baseUrl: string = `http://localhost:5297`;

  constructor(private http: HttpClient) {}

  public sendAuth(baseAddress: string, header: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth`, {
      baseAddress,
      header,
    });
  }

  public getSummoner(): Observable<Summoner> {
    return this.http.get<Summoner>(`${this.baseUrl}/summoner`);
  }

  public getChampions(): Observable<Champions> {
    return this.http.get<Champions>(`${this.baseUrl}/champions`);
  }

  public getChampion(
    summonerId: number,
    championId: string,
  ): Observable<Champion> {
    return this.http.get<Champion>(
      `${this.baseUrl}/summoner/${summonerId}/champion/${championId}`,
    );
  }

  public getLoots(): Observable<Loot[]> {
    return this.http.get<Loot[]>(`${this.baseUrl}/loots`);
  }

  public getMasteries(summonerId: number): Observable<Mastery[]> {
    return this.http.get<Mastery[]>(
      `${this.baseUrl}/summoner/${summonerId}/masteries`,
    );
  }
}
