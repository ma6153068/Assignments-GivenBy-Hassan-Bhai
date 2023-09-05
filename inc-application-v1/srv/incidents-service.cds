using { inkit.custsrv.incidents as my } from '../db/schema';


service incidentservice {

    entity Incidents as projection on my.Incidents;
    entity Customers as projection on my.Customers{
          *, firstName || ' ' || lastName as fullname : String
    };
    entity Urgency as projection on my.Urgency;
    entity status as projection on my.Status;

}