import axios from 'axios';
import http from '../http-commons'
import authHeader from "./auth/authHeader";


class AdminData {
  getAllWatches(user) {
    return http.post("/admin/get-all", { user: user },{headers:authHeader()});
  }
  getAllMessages(user) {
    return http.post("/admin/messages/get-all", { user: user },{headers:authHeader()});
  }
  getAllRolexMessages(user) {
    return http.post("/admin/messages/rolex-get-all", { user: user },{headers:authHeader()});
  }

  checkAvailability(list, user) {


    return http.post("/admin/update/store-analytics", {
      values: list,
      user: user
    }),{headers:authHeader()}
  }

  updateAvailability(list, user) {

    return http.post("/admin/update/store-availability", {
      values: list,
      user: user
    }),{headers:authHeader()}
  }

  // metodo enviado desde adminDataServices.js
  createWatch(data) {

    return http.post("/admin/create/store-product", data,{headers:authHeader()})
  }


  updateSingleWatch(id, user) {
    return http.post("/admin/update/store-availability-single", {
      user: user,
      id: id
    }),{headers:authHeader()}
  }
  updateCollection(id,collection, user) {
    return http.post("/admin/update/store-availability-single-collection", {
      user: user,
      id: id,
      collection:collection
    }),{headers:authHeader()}
  }





}

export default new AdminData();