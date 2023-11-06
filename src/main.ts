import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DocModule } from './app/doc.module';
import { environment } from './environments/environment';

import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Mgo+DSMBaFt+QHJqVk1mQ1NbdF9AXnNPdFJyT2Neby8Nf1dGYl9RQXRdQltjS35Wd0NhWA==;Mgo+DSMBPh8sVXJ1S0R+X1pCaV1dX2NLfUNwT2JddV53ZCQ7a15RRnVfR19hSXhTdEVmWHhZcQ==;ORg4AjUWIQA/Gnt2VFhiQlJPcEBAQmFJfFBmQ2lYe1Rwc0U3HVdTRHRcQlhhS35VdkdjXH5XdnU=;MjE0MTMyNkAzMjMxMmUzMjJlMzNSaE00K1BPbElZa3VIdlROdG55dmt6NzAxcXljcWFMZS9mOGFBRUxjMWxZPQ==;MjE0MTMyN0AzMjMxMmUzMjJlMzNNVGwyUm93UHR0TXFFYkIzTGh5SzRwVERHOVMzUHNQejdVQTBEblY3ZS9FPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfVldX3xLflF1VWVTflp6dFJWESFaRnZdQV1mS3xTcEVhWXpcdnRU;MjE0MTMyOUAzMjMxMmUzMjJlMzNSYXFpRnIyaFFFdG9COHdCNWVQbDdJaUhMLzR1Vm9iYWNWK05VTXhrOHBvPQ==;MjE0MTMzMEAzMjMxMmUzMjJlMzNCRTdUU0RPdGx3WWY2U0xweExLT0lsLzdQRUlZVWhrWFdLcFYwU0FzclFnPQ==;Mgo+DSMBMAY9C3t2VFhiQlJPcEBAQmFJfFBmQ2lYe1Rwc0U3HVdTRHRcQlhhS35VdkdjXHxdc3U=;MjE0MTMzMkAzMjMxMmUzMjJlMzNiSE9Zdi9haFNQVVlOQ1h2bjM0RnozYTBkNmVycVZVcUZPdVZzbTBoZitFPQ==;MjE0MTMzM0AzMjMxMmUzMjJlMzNhamQ2VFFIV1hIMGhPWExmYUMrTWg1Mm5sNVNjbTdsNGlYb05Bekd6ek0wPQ==;MjE0MTMzNEAzMjMxMmUzMjJlMzNSYXFpRnIyaFFFdG9COHdCNWVQbDdJaUhMLzR1Vm9iYWNWK05VTXhrOHBvPQ==');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DocModule)
  .catch(err => console.error(err));
