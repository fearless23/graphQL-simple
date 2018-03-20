// import { stringify } from "querystring";
const ROOT_URL = 'http://localhost:4000/graphql?query='


var one = new Vue({
  el: '#vue-app',
  data: {
    post: {},
    customers: [],
    customer: {},
    userid: 2
  },
  methods: {
    getCustomer(id) {
      const query = '{customer(id: "' + id + '"){name email id}}';
      axios.get(ROOT_URL + query).then(res => this.customer = res.data.data.customer)
    }
  },
  created() {
    // From JSON PLACEHOLDER FAKE REST API
    axios.get('http://jsonplaceholder.typicode.com/posts/1')
      .then(res => this.post = res.data);
    // LOCAL DATA SERVER by JSON SERVER .. REST API
    // axios.get('http://localhost:3000/customers')
    // .then(res => console.log(res.data));
    // GraphQL Server
    const ROOT_URL = 'http://localhost:4000/graphql?query='
    const query = `{customers{name}}`;
    const query2 = '{customer(id: "3"){name email}}'
    axios.get(ROOT_URL + query).then(res => this.customers = res.data.data.customers)
    axios.get(ROOT_URL + query2).then(res => this.customer = res.data.data.customer)

  }
});
