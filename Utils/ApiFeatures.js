class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;    
    this.queryStr = queryStr;
  }

  filter() {
    //-> 1a) Filtering
    const queryObj = { ... this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //-> 1b) Advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  };

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('name');
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);      
    } else {
      this.query = this.query.select('-__v')
    }

    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;



//*EXAMPLES

// 127.0.0.1:3000/users/?age[lte]=40
// 127.0.0.1:3000/users/?sort=age
// 127.0.0.1:3000/users/?sort=-team
// 127.0.0.1:3000/users/?fields=name,age,team
// 127.0.0.1:3000/users/?page=1&limit=5 //-> afisam cate 5 pe 1 pagina

