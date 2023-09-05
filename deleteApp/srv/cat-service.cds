using my.bookshop as db from '../db/schema';
service CatalogService {
  @readonly entity Books as projection on db.Books;
  @readonly entity Authors as projection on db.Authors;
  @insertonly entity Orders as projection on db.Orders;
}