import http from '../http-commons'

class Rolex {
 

  getByCollection(id) {
    // getCollectionDetailsV2
    return http.get(`/v2/collection/${id}/`);
  }

  getPaginated(page, query = '') {
    // getCollectionDetailsV2
    return http.get(`/v2/rolex/getAll/${page}?tags=${query}`);
  }

  get10RandomRolex(){
    return http.get('/v2/rolex/get10Random')
  }
  getAllCollections() {
    return http.get('/v2/rolex/getAllCollections');
  }

  getDetailedWatch(id) {
    // getRolexDetailsV2
    return http.get(`/v2/rolex/${id}`);

  }

  getAllAccesories(){
    return http.get('/v2/rolex-accesories/getAll')
  }

  getIndividualAccesories(code){
    return http.get(`/v2/rolex-accesories/get/${code}`)
  }


}

export default new Rolex();