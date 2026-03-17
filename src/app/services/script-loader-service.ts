import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {

  private loadedScripts: any = {};

  loadScripts(scripts: string[]) {
    return Promise.all(scripts.map(src => this.loadScript(src)));
  }

  loadScript(src: string) {
    return new Promise((resolve, reject) => {

      if (this.loadedScripts[src]) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = false;

      script.onload = () => {
        this.loadedScripts[src] = true;
        resolve(true);
      };

      script.onerror = () => reject(`Failed to load ${src}`);

      document.body.appendChild(script);
    });
  }
}
