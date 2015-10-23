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
        self.customersAccounts = ko.observableArray();

        self.page = ko.observable();

        self.error = ko.observable(false);
        self.errorMessage = ko.observable();

        //My code above this
        //New Code Below this

        self.selectedCustomer = new CustomerModel();
        self.AllAccountsForCustomer = new AccountModel();
        self.AllCustomers = new CustomerModel();
        self.selectedCustomerAccounts = ko.observableArray();
        self.saveCustomer = function () {
            //validation
            validateColor($("#InputFirstName"));
            validateColor($("#InputLastName"));
            validateColor($("#InputAddress1"));
            validateColor($("#InputCity"));
            validateColor($("#InputZip"));
            validateColor($("#InputState"));
            validateState($("#InputState"));
           
            var inputArray = [$("#InputFirstName"), $("#InputLastName"), $("#InputAddress1"), $("#InputAddress1"), $("#InputCity"), $("#InputZip") ];
            
           if(!validate(inputArray)){
               return;
           }




            if (self.page() == 'customer.add') {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:49690/api/customers',
                    contentType: 'application/json;charset=utf-8',
                    data: ko.mapping.toJSON(self.selectedCustomer),
                    success: function (data) {
                        alert("Added Customer");

                        //Change Page
                        self.page('customer.grid')
                    }
                });
            } else {
                $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:49690/api/customers?id=' + self.selectedCustomer.CustomerId(),
                    contentType: 'application/json;charset=utf-8',
                    data: ko.mapping.toJSON(self.selectedCustomer),
                    success: function (data) {
                        alert("Save was successful!");

                        self.page('customer.grid');
                    }
                });
            }
        };

        self.saveNewAccount = function () {
            //Validation to ensure both input boxes have numbers 
            var InputAccountNumber = $('#InputAccountNumber').val();
            var InputAccountBalance = $('#InputAccountBalance').val();

            //Remove all characters and symbols
            InputAccountBalance = InputAccountBalance.replace(/[^\/\d]/g, '');
            InputAccountNumber = InputAccountNumber.replace(/[^\/\d]/g, '');





            if (InputAccountBalance == "") {
                $('#InputAccountBalance').addClass("red-border");
            }
            if (InputAccountNumber == "") {
                $('#InputAccountNumber').addClass("red-border");
            }
            if (InputAccountBalance == "" || InputAccountNumber == "") {
                alert("Please enter in both account number and balance.  Cannot be Null");
                return;
            }

            if (self.page() == 'account.add') {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:49690/api/customers/' + self.selectedCustomer.CustomerId() + '/accounts',
                    contentType: 'application/json;charset=utf-8',
                    data: ko.mapping.toJSON(self.selectedCustomerAccounts),
                    success: function (data) {
                        alert("Saved new Account!");

                        //Close Modal
                        $('#addAccountModal').modal('hide');

                        self.page('customer.accounts');
                    }
                });
            }
            alert("New Account Added! (Need Permission from API 'Error')");
        }



        //Customer Grid
        self.customers = ko.observableArray();

        //Naviage to add new Customer page
        self.addCustomer = function () {
            self.page('customer.add');

        };

        //Navigate to add new Account Page
        self.addAccount = function () {
            //Clear Previous Red lines
            $('#InputAccountBalance').removeClass("red-border");
            $('#InputAccountNumber').removeClass("red-border");



            self.page('account.add')
        }

        //Edit a Customer

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

        self.viewCustomerAccounts = function (customer) {
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:49690/api/customers/' + customer.CustomerId() + '/accounts',
                    success: function (data) {
                        ko.mapping.fromJS(ko.mapping.toJS(customer), {}, self.selectedCustomer);


                        ko.mapping.fromJS(data, {}, self.customersAccounts);


                        self.page('customer.accounts');
                    }


                })

            }
            //Displays all of current customer's account in Modal
        self.displayCustomerAccountsModal = function () {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:49690/api/customers/' + self.selectedCustomer.CustomerId() + '/accounts',
                success: function (data) {

                    ko.mapping.fromJS(data, {}, self.customersAccounts);

                }


            })


        }
        
        //Edit an Account
        self.editAccount = function (customer) {
            self.page()
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

                            self.page('account.edit');
                        }
                    });
                }
            });
        };

        //Delete A customer
        self.deleteCustomer = function (customer) {
            if (confirm("Are you sure you wish to delete this customer? This cannot be undone.")) {
                $.ajax({
                    type: 'DELETE',
                    url: 'http://localhost:49690/api/customers?id=' + customer.CustomerId(),
                    success: function (data) {
                        alert("Customer has been deleted");

                        self.reloadCustomers();
                    }
                });
            }
        };

        /*
        self.reload = function() {
            
            customers = function(){
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:49690/api/customers/',
                    success: function (data) {
                        ko.mapping.fromJS(data, {}, self.customers);
         
                        self.page('customer.grid');
                    }
                });     
            }
            
        };
          */

        self.reloadCustomers = function () {
            //Populate Customer Grid with ALL Customers
            $.ajax({
                type: 'GET',
                url: 'http://localhost:49690/api/customers/',
                success: function (data) {
                    ko.mapping.fromJS(data, {}, self.customers);


                    self.page('customer.grid');
                }
            });

        }
        self.CustomerGrid = function(){
            self.page('customer.grid')
        }

        self.reloadCustomers();


    };

    function validateColor(x) {
        if ($(x).val() == "") {
            $(x).addClass("red-border");
        }
    }

    function validate(arr) {
        for (var i = 0; i < arr.length; i++) {
            if ($(arr[i].val() == "")) {
                alert("Please fill in all of the required Inputs");
                return false;
            }
        }
    }

    function validateState(y) {
        x = $(y).val();
        x = x.replace(/[^a-z\d\s]+/gi, "");
        x = x.replace(/[0-9]/g, '');
        if (x.length > 2) {
            alert("Please enter the State in the correct Format!");
            return;
        }



    }


    ko.applyBindings(new MyViewModel());


    //Add account information per customer