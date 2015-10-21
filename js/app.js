function MyViewModel() {
    var self = this;
 
    self.customers = ko.observableArray();
    self.searchTerm = ko.observable();
    self.moreInfo = ko.observableArray();
    
    //Deeper in!
    self.currentMovie = {
        Type: ko.observable(),
        Year: ko.observable(),
        Genre: ko.observable(),
        Released: ko.observable(),
        Runtime: ko.observable(),
        Poster: ko.observable(),
        Rated: ko.observable(),
        imdbRating: ko.observable(),
        imdbVotes: ko.observable(),
        Actors: ko.observable(),
        Plot: ko.observable(),
        Writer: ko.observable(),
        Director: ko.observable(),
        Country: ko.observable(),
        Language: ko.observable(),
        Title: ko.observable()
        
    };

    self.error = ko.observable(false);
    self.errorMessage = ko.observable();

    self.getAllCustomers = function () {
            
        $.getJSON("http://localhost:49690/api/customers").done(function (data) {
            self.error(false);
            self.errorMessage('');

                ko.mapping.fromJS(data, {}, self.customers);
            
        });
    };

    self.viewMoreInfo = function (movie) {
        $.getJSON("http://omdbapi.com/?t=" + movie.Title(), {
            api_key: '7a5035cca9022ea67734112eb921d5d33680a63d'
        }).done(function (data) {
            self.error(false);
            self.errorMessage('');

            if (data) {
                ko.mapping.fromJS(data, {}, self.currentMovie);
            } else {
                self.error(true);
                self.errorMessage(data.Error);
            }
        });
    };
    
    self.clear = function(){
        $(".searchForm").val("");
        $(".results").fadeOut("fast");
    };
    
    
    //Dynamic calls
    self.getAllCustomers();
};




ko.applyBindings(new MyViewModel());
