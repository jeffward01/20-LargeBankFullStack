    //Deeper in!
    function AccountModel() {
        this.AccountId = ko.observable();
        this.CustomerId = ko.observable();
        this.CreatedDate = ko.observable();
        this.Balance = ko.observable();
        this.TransactionCount = ko.observable();
    };

    function CustomerModel() {
        this.CustomerId = ko.observable();
        this.CreatedDate = ko.observable();
        this.FirstName = ko.observable();
        this.LastName = ko.observable();
        this.Address1 = ko.observable();
        this.Address2 = ko.observable();
        this.City = ko.observable();
        this.States = ko.observable();
        this.Zip = ko.observable();
    };

    function TransactionModel() {
        this.TransactionId = ko.observable();
        this.AccountId = ko.observable();
        this.CreatedDate = ko.observable();
        this.AccountNumber = ko.observable();
        this.Balance = ko.observable();
    };

    function MyViewModel() {
        var self = this;

        //Page Management
        self.page = ko.observable('customer.grid');

        self.customers = ko.observableArray();

        self.page = ko.observable();

        self.error = ko.observable(false);
        self.errorMessage = ko.observable();

        //My code above this
        //New Code Below this

        self.selectedCustomer = new CustomerModel();
        self.AllCustomers = new CustomerModel();
        self.selectedCustomerAccounts = ko.observableArray();
        self.saveCustomer = function () {
            if (self.page() == 'customer.add') {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:49690/api/cutsomers',
                    contentType: 'application/json;charset=utf-8',
                    data: ko.mapping.toJson(self.selectedCustomer),
                    success: function (data) {
                        alert("Added Customer");

                        //Change Page
                        self.page('customer.grid')
                    }
                });
            } else {
                $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:49690/api/cutsomers?id=',
                    contentType: 'application/json;charset=utf-8',
                    data: ko.mapping.toJson(self.selectedCustomer),
                    success: function (data) {
                        alert("Save was successful!");

                        self.page('customer.grid');
                    }
                });
            }
        };


        //Customer Grid
        self.customers = ko.observableArray();
        self.addCustomer = function () {
            self.page('customer.add');
        };

        self.editCustomer = function (customer) {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:49690/api/customers/' + customer.CustomerId(),
                success: function (data) {
                    ko.mapping.fromJS(data, {}, self.selectedCustomer);

                    $.ajax({
                        type: 'GET',
                        url: 'http://localhost:49690/api/customers/' + customer.CustomerId() + '/accounts',
                        success: function (data) {
                            ko.mapping.fromJS(data, {}, self.selectedCustomerAccounts);

                            self.page('customer.detail');
                        }
                    });
                }
            });
        };

        self.deleteCustomer = function (customer) {
            if (confirm("Are you sure you wish to delete this customer? This cannot be undone.")) {
                $.ajax({
                    type: 'DELETE',
                    url: 'http://localhost:49690/api/customers?id=' + customer.CustomerId(),
                    success: function (data) {
                        alert("Customer has been deleted");
                    }
                });
            }
        };

        //Test Code Region Below
      

            $.ajax({
                type: 'GET',
                url: 'http://localhost:49690/api/customers/',
                success: function (data) {
                    ko.mapping.fromJS(data, {}, self.customers);

                    self.page('customer.grid');
                }
            });
    };


    ko.applyBindings(new MyViewModel());

    //My code below
    /*
    self.getAllCustomers = function () {

        $.getJSON("http://localhost:49690/api/customers").done(function (data) {
            self.error(false);
            self.errorMessage('');

            ko.mapping.fromJS(data, {}, self.customers);

        });
    };

    self.viewCustomerAccounts = function (customerID) {
        $.getJSON("http://localhost:49690/api/customers/" + customerID.CustomerId() + "/accounts/").done(function (data) {
            window.location.href = 'accounts.html';
            self.error(false);
            self.errorMessage('');

            ko.mapping.fromJS(data, {}, AccountModel);
        });
    };

    self.currentCustomer = function (customerID) {
        $.getJSON("http://localhost:49690/api/customers").done(function (data) {
            self.error(false);
            self.errorMessage('');

            var custID = customerID.CustomerId() - 1;
            data = data[custID];

            ko.mapping.fromJS(data, CustomerModel);
        });
    };
    self.getCurrentPage = function () {
        return self.currentPage();
    }





    self.clear = function () {

    };


    //Dynamic calls
    self.getAllCustomers();
    self.currentCustomer();
    self.getAllCustomers();
    */









