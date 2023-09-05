using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';
namespace inkit.custsrv.incidents;



// Define entitites
entity Incidents : cuid, managed {
   customer     : Association to Customers;
   title        : String  @title : 'Title';
   name : String;
   urgency      : Association to Urgency;
   status       : Association to Status;
//    conversations: Composition of many Conversations on conversations.incidents = $self;
}


entity Customers : cuid, managed {
  firstName     : String;
  lastName      : String;
  email         : EMailAddress;
  phone         : PhoneNumber;
  city          : City;
  postCode      : String;
  streetAddress : String;
  incidents     : Composition of many Incidents on incidents.customer = $self;
}











// Define Type
type EMailAddress : String;
type PhoneNumber : String;
type City : String;


// status code urgency code

entity Status : CodeList {
    key code: String enum {
        new = 'N';
        assigned = 'A';
        in_process = 'I';
        on_hold = 'H';
        resolved = 'R';
        closed = 'C';
};
    criticality : Integer; 
}

entity Urgency : CodeList {
    key code: String enum {
        high = 'H';
        medium = 'M';
        low = 'L';
};
}