import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
import pagination from './pagination.js';


let productModal = {};
let delProductModal = {};
const app = createApp({
    components: {
        pagination
    },
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: '124478313',
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
            pagination: {},
        }
    },
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
            axios.defaults.headers.common.Authorization = token;
            axios.post(url)
                .then(() => {
                    this.getProduct();
                })
                .catch((err) => {
                    alert(err.data.message)
                    window.location = 'login.html';
                })
        },
        getProduct(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then((response) => {
                    this.products = response.data.products;
                    this.pagination = response.data.pagination;
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        openProduct(product) {
            this.tempProduct = product;
        },
        openModal(status, product) {

            if (status === 'isNew') {
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                this.tempProduct = { ...product };
                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                delProductModal.show();
                this.tempProduct = { ...product };
            }

        },

    },
    mounted() {
        // 取出 Token
        this.checkAdmin()
        productModal = new bootstrap.Modal(document.getElementById('productModal'));

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));



    }
});
app.component('productModal', {
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: '124478313',
        }
    },
    props: ['tempProduct', 'isNew'],
    template: '#templateForProductModal',
    methods: {
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.tempProduct })
                .then(res => {
                    console.log(res);
                    this.$emit('get-products')
                    productModal.hide();
                });
        },
    }
})
app.component('delProductModal', {
    template: '#delProductModal',
    props: ['item'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: '124478313',
        };
    },
    mounted() {
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static',
        });
    },
    methods: {
        delProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`;
            axios.delete(url)
                .then((response) => {
                    this.hideModal();
                    this.$emit('update');
                }).catch((error) => {
                    alert(error.data.message);
                });
        },
        openModal() {
            delProductModal.show();
        },
        hideModal() {
            delProductModal.hide();
        },
    },
});


app.mount('#app');